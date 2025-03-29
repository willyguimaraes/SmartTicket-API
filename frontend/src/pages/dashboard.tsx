// src/pages/Dashboard.tsx
import React from "react";
import { Link, Outlet } from "react-router-dom";
//import "./Dashboard.css"; // Arquivo de estilo opcional

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <aside className="side-menu">
        <h3>Menu</h3>
        <ul>
          <li><Link to="/dashboard">Início</Link></li>
          <li><Link to="/events">Eventos</Link></li>
          <li><Link to="/create-event">Criar Evento</Link></li>
          <li><Link to="/locations">Gerenciar Locais</Link></li>
          <li><Link to="/reservation">Reservar Ingresso</Link></li>
          <li><Link to="/my-reservations">Minhas Reservas</Link></li>
        </ul>
      </aside>
      <main className="dashboard-content">
        <h2>Bem-vindo ao Dashboard!</h2>
        {/* O Outlet renderiza as sub-rotas */}
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
