// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import "./loginPage.css"; // Reutilizando os mesmos estilos do login

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // Valor padrão: Usuário (client)
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/users/register", { name, email, password, role });
      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      
      alert("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="login-container">
      <header className="header">
        <div className="menu-icon">&#9776;</div>
        <div className="title">SmartTicket</div>
        <div className="profile-icon">&#9787;</div>
      </header>
      <div className="login-form">
        <div className="profile-icon-large">&#9787;</div>
        <h2>CADASTRO</h2>
        <label htmlFor="name">NOME</label>
        <input
          id="name"
          type="text"
          placeholder="Digite seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="email">EMAIL</label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">SENHA</label>
        <input
          id="password"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="role">PAPEL</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="client">Usuário</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit" onClick={handleSubmit}>
          Cadastrar
        </button>
        <p className="register-link">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
