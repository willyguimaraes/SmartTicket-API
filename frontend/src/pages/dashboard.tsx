// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import UserMenu from "../components/userMenu";
import "./dashboard.css";

interface Reservation {
  id: number;
  event: string;
  quantity: number;
}

const Dashboard: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Test User");
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axiosInstance.get("/reservations", {
          params: { userId: 1 },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setReservations(response.data);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
      }
    };
    fetchReservations();
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button className="menu-toggle" onClick={toggleMenu}>
          &#9776;
        </button>
        <div className="dashboard-title">SmartTicket</div>
        {/* Substituindo o ícone de perfil pelo componente UserMenu */}
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
                  <strong>Evento:</strong> {reservation.event}
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
