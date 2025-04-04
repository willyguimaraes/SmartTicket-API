// src/pages/EventCreation.tsx
import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import UserMenu from "../components/userMenu";
import "./eventCreation.css";

const EventCreation: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [locationId, setLocationId] = useState<number>(0);
  const [organizerId, setOrganizerId] = useState<number>(0);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/events", {
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
    <div className="event-creation-container">
      <header className="event-creation-header">
        <Link to="/dashboard" className="back-button">&#8592;</Link>
        <div className="header-title">SmartTicket</div>
        <div className="placeholder"></div>
        <UserMenu />
      </header>
      <div className="event-creation-form">
        <h2>Criar Evento</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            placeholder="Título do evento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            placeholder="Descrição do evento"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label htmlFor="date">Data</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <label htmlFor="time">Horário</label>
          <input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <label htmlFor="category">Categoria</label>
          <input
            id="category"
            type="text"
            placeholder="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <label htmlFor="locationId">ID do Local</label>
          <input
            id="locationId"
            type="number"
            placeholder="ID do Local"
            value={locationId}
            onChange={(e) => setLocationId(Number(e.target.value))}
            required
          />
          <label htmlFor="organizerId">ID do Organizador</label>
          <input
            id="organizerId"
            type="number"
            placeholder="ID do Organizador"
            value={organizerId}
            onChange={(e) => setOrganizerId(Number(e.target.value))}
            required
          />
          <button type="submit">Criar Evento</button>
        </form>
      </div>
    </div>
  );
};

export default EventCreation;
