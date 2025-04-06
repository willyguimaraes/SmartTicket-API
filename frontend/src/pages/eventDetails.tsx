import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useParams, Link } from "react-router-dom";
import "./eventDetails.css";
import UserMenu from "../components/userMenu";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  category: string;
}

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [quantityAvailable, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance.get(`/events/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error("Erro ao buscar evento", error);
      }
    };
    fetchEvent();
  }, [id]);

  const handleReserveClick = () => {
    setShowReservationForm(true);
  };

  const handleReservation = async () => {
    const userId = Number(localStorage.getItem("userId"));
    const token = localStorage.getItem("token");
    

    if (!userId || !token || !event) {
      alert("Usuário não autenticado ou evento inválido.");
      return;
    }

    try {
      // Cria o ticket
      const ticketResponse = await axiosInstance.post(
        "/tickets",
        {
          type: "padrão",
          price: 50, // valor fixo
          quantityAvailable,
          eventId: event.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const ticketId = ticketResponse.data.id;

      // Cria a reserva
      await axiosInstance.post(
        "/reservations",
        {
          userId,
          eventId: event.id,
          ticketId,
          quantity: quantityAvailable,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Reserva criada com sucesso!");
      setShowReservationForm(false);
    } catch (error: any) {
      
      alert(error.response?.data?.message || "Erro ao criar reserva.");
    }
  };

  if (!event) return <p>Carregando...</p>;

  return (
    <div className="event-details">
      <header className="event-details-header">
        <Link to="/dashboard" className="back-button">&#8592;</Link>
        <div className="header-title">SmartTicket</div>
        <div className="placeholder"></div>
        <UserMenu />
      </header>
      <div className="event-details-content">
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p>
          Data: {new Date(event.date).toLocaleDateString()} - {event.time}
        </p>
        <p>Categoria: {event.category}</p>

        {!showReservationForm ? (
          <button onClick={handleReserveClick} className="reserve-link">
            Reservar Ingresso
          </button>
        ) : (
          <div className="reservation-form">
            <label>Quantidade de Ingressos</label>
            <input
              type="number"
              value={quantityAvailable}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button onClick={handleReservation}>Confirmar Reserva</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
