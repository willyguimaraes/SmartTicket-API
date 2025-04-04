// src/pages/EventsList.tsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { Link } from "react-router-dom";
import UserMenu from "../components/userMenu";
import "./eventsList.css";

interface Event {
  id: number;
  title: string;
  category: string;
}

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get("/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Erro ao buscar eventos", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="events-list-container">
      <header className="event-details-header">
              <Link to="/dashboard" className="back-button">&#8592;</Link>
              <div className="header-title">SmartTicket</div>
              <div className="placeholder"></div>
              <UserMenu />
            </header>
      <h2>Eventos</h2>
      <div className="events-list">
        {events.length === 0 ? (
          <p>Nenhum evento encontrado.</p>
        ) : (
          events.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id} className="event-card">
              <div className="event-title">{event.title}</div>
              <div className="event-category">{event.category}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsList;
