// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

const Dashboard: React.FC = () => {
  // Estado para controlar a abertura do menu retrátil
  const [menuOpen, setMenuOpen] = useState(false);

  // Dados simulados (em uma implementação real, esses dados seriam obtidos via API ou contexto)
  const userName = "Test User";
  const reservations = [
    { id: 1, event: "Evento 1", quantity: 2 },
    { id: 2, event: "Evento 2", quantity: 1 },
  ];

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button className="menu-toggle" onClick={toggleMenu}>
          &#9776;
        </button>
        <div className="dashboard-title">SmartTicket</div>
        <div className="profile-icon">&#9787;</div>
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
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <p>
                <strong>Evento:</strong> {reservation.event}
              </p>
              <p>
                <strong>Quantidade:</strong> {reservation.quantity}
              </p>
            </div>
          ))}
        </div>
        <button className="find-events-btn">
          <Link to="/events">Encontrar Eventos</Link>
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
