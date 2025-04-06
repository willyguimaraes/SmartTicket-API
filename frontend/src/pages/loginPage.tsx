// src/pages/LoginPage.tsx
import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import "./loginPage.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);

      // Salva token e userId
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", String(response.data.id));
      

      navigate("/dashboard");
    } catch (error) {
      alert("Erro ao fazer login. Verifique suas credenciais.");
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
        <h2>LOGIN</h2>
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
        <button type="submit" onClick={handleSubmit}>
          Entrar
        </button>
        <p className="register-link">
          <Link to="/register">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
