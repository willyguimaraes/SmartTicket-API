// src/pages/ReservationPage.tsx
import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import "./reservationPage.css";

const ReservationPage: React.FC = () => {
  const [ticketId, setTicketId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [eventId, setEventId] = useState<number>(0);
  const [userId, setUserId] = useState<number>(0);
  const navigate = useNavigate();

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post(
        "/reservations",
        {
          userId,
          eventId,
          ticketId,
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Reserva criada com sucesso!");
      navigate("/my-reservations");
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao criar reserva.");
    }
  };

  return (
    <div className="reservation-page">
      <header className="reservation-header">
        <Link to="/dashboard" className="back-button">&#8592;</Link>
        <div className="header-title">SmartTicket</div>
        <div className="placeholder" />
      </header>

      <h2>Reservar Ingresso</h2>
      <form onSubmit={handleReservation}>
        <label htmlFor="userId">ID do Usuário</label>
        <input
          id="userId"
          type="number"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          required
        />

        <label htmlFor="eventId">ID do Evento</label>
        <input
          id="eventId"
          type="number"
          value={eventId}
          onChange={(e) => setEventId(Number(e.target.value))}
          required
        />

        <label htmlFor="ticketId">ID do Ticket</label>
        <input
          id="ticketId"
          type="number"
          value={ticketId}
          onChange={(e) => setTicketId(Number(e.target.value))}
          required
        />

        <label htmlFor="quantity">Quantidade</label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />

        <button type="submit">Confirmar Reserva</button>
      </form>
    </div>
  );
};

export default ReservationPage;
