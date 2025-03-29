// src/pages/EventsList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Event {
  id: number;
  title: string;
  date: string;
  category: string;
}

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Erro ao buscar eventos", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-list">
      <h2>Eventos</h2>
      {events.length === 0 ? (
        <p>Nenhum evento encontrado.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <Link to={`/events/${event.id}`}>
                <h3>{event.title}</h3>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <p>{event.category}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventsList;
