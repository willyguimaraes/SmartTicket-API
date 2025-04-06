// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import UserMenu from "../components/userMenu";
import "./dashboard.css";

interface Reservation {
  id: number;
  quantity: number;
  event: {
    id: number;
    title: string;
  };
}

const Dashboard: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Usuário");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId"));
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    // Buscar dados do usuário para exibir o nome
    axiosInstance
      .get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserName(res.data.name))
      .catch(console.error);

    // Buscar reservas do usuário
    axiosInstance
      .get("/reservations", {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReservations(res.data))
      .catch(console.error);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button className="menu-toggle" onClick={toggleMenu}>
          &#9776;
        </button>
        <div className="dashboard-title">SmartTicket</div>
        <UserMenu />
      </header>

      {menuOpen && (
        <div className="collapsible-menu">
          <ul>
            <li>
              <Link to="/create-event" onClick={() => setMenuOpen(false)}>
                Criar Evento
              </Link>
            </li>
            <li>
              <Link to="/locations" onClick={() => setMenuOpen(false)}>
                Gerenciar Locais
              </Link>
            </li>
          </ul>
        </div>
      )}

      <main className="dashboard-content">
        <h2>Bem vindo, {userName}</h2>
        <h3>Suas reservas:</h3>
        <div className="reservations-list">
          {reservations.length === 0 ? (
            <p>Você ainda não possui reservas.</p>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card">
                <p>
                  <strong>Evento:</strong> {reservation.event.title}
                </p>
                <p>
                  <strong>Quantidade:</strong> {reservation.quantity}
                </p>
              </div>
            ))
          )}
        </div>
        <button className="find-events-btn">
          <Link to="/events">Encontrar Eventos</Link>
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
