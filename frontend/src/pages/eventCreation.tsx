// src/pages/EventCreation.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventCreation: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  // IDs de local e organizador podem vir de seletores ou do contexto do usuário
  const [locationId, setLocationId] = useState<number>(0);
  const [organizerId, setOrganizerId] = useState<number>(0);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/events", {
        title,
        description,
        date,
        time,
        category,
        locationId,
        organizerId,
      });
      alert("Evento criado com sucesso!");
      navigate("/events");
    } catch (error) {
      alert("Erro ao criar evento.");
    }
  };

  return (
    <div className="event-creation">
      <h2>Criar Evento</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="ID do Local"
          value={locationId}
          onChange={(e) => setLocationId(Number(e.target.value))}
          required
        />
        <input
          type="number"
          placeholder="ID do Organizador"
          value={organizerId}
          onChange={(e) => setOrganizerId(Number(e.target.value))}
          required
        />
        <button type="submit">Criar Evento</button>
      </form>
    </div>
  );
};

export default EventCreation;
