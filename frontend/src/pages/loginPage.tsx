// src/pages/LoginPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      // Armazena o token (por exemplo, no localStorage)
      localStorage.setItem("token", response.data.token);
      // Redireciona para o dashboard
      navigate("/dashboard");
    } catch (error) {
      alert("Erro de autenticação. Verifique suas credenciais.");
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem conta? <a href="/register">Cadastre-se</a></p>
    </div>
  );
};

export default LoginPage;
