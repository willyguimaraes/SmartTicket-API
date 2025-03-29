// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importação das páginas
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import Dashboard from "./pages/dashboard";
import EventsList from "./pages/eventsList";
import EventDetails from "./pages/eventDetails";
import EventCreation from "./pages/eventCreation";
import LocationsManagement from "./pages/locationsManagement";
import ReservationPage from "./pages/reservationPage";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rota protegida - Dashboard com rotas aninhadas */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Tela principal do dashboard (poderia ser um resumo ou landing page interna) */}
          <Route index element={<div>Bem-vindo ao Dashboard!</div>} />
          <Route path="events" element={<EventsList />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="create-event" element={<EventCreation />} />
          <Route path="locations" element={<LocationsManagement />} />
          <Route path="reservation" element={<ReservationPage />} />
          {/* Exemplo: <Route path="my-reservations" element={<MyReservations />} /> */}
        </Route>

        {/* Redireciona a raiz para a página de login */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </Router>
  );
};

export default App;
