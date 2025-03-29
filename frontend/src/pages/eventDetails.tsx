// src/pages/EventDetails.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

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
        const response = await axios.get(`/api/events/${id}`);
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
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p>
        Data: {new Date(event.date).toLocaleDateString()} - {event.time}
      </p>
      <p>Categoria: {event.category}</p>
      <Link to="/reservation">Reservar Ingresso</Link>
    </div>
  );
};

export default EventDetails;
