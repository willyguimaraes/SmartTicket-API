// src/pages/EventDetails.tsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useParams, Link } from "react-router-dom";
import UserMenu from "../components/userMenu";
import "./eventDetails.css";

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

  if (!event) return <p>Carregando...</p>;

  return (
    <div className="event-details">
      <header className="event-details-header">
        <Link to="/dashboard" className="back-button">&#8592;</Link>
        <div className="header-title">SmartTicket</div>
        <UserMenu />
      </header>
      <div className="event-details-content">
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p>
          Data: {new Date(event.date).toLocaleDateString()} - {event.time}
        </p>
        <p>Categoria: {event.category}</p>
        <Link to="/reservation" className="reserve-link">
          Reservar Ingresso
        </Link>
      </div>
    </div>
  );
};

export default EventDetails;
