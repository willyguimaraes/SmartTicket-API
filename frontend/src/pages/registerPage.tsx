// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/register", { name, email, password });
      alert("Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (error) {
      alert("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="register-page">
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
        />
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
        <button type="submit">Cadastrar</button>
      </form>
      <p>Já tem conta? <a href="/login">Entrar</a></p>
    </div>
  );
};

export default RegisterPage;
