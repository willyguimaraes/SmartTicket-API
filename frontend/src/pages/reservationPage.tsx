// src/pages/ReservationPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReservationPage: React.FC = () => {
  const [ticketId, setTicketId] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [eventId, setEventId] = useState<number>(0);
  const [userId, setUserId] = useState<number>(0);
  const navigate = useNavigate();

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/reservations", {
        userId,
        eventId,
        ticketId,
        quantity,
      });
      alert("Reserva criada com sucesso!");
      navigate("/my-reservations");
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao criar reserva.");
    }
  };

  return (
    <div className="reservation-page">
      <h2>Reservar Ingresso</h2>
      <form onSubmit={handleReservation}>
        <input
          type="number"
          placeholder="ID do Usuário"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          required
        />
        <input
          type="number"
          placeholder="ID do Evento"
          value={eventId}
          onChange={(e) => setEventId(Number(e.target.value))}
          required
        />
        <input
          type="number"
          placeholder="ID do Ticket"
          value={ticketId}
          onChange={(e) => setTicketId(Number(e.target.value))}
          required
        />
        <input
          type="number"
          placeholder="Quantidade"
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
