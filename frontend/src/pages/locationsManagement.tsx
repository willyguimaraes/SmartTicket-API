// src/pages/LocationsManagement.tsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Link } from "react-router-dom";
import UserMenu from "../components/userMenu";

import "./locationsManagement.css";

interface Location {
  id: number;
  name: string;
  address: string;
  capacity: number;
}

const LocationsManagement: React.FC = () => {
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [capacity, setCapacity] = useState<number>(0);
  const [locations, setLocations] = useState<Location[]>([]);

  const fetchLocations = async () => {
    try {
      const response = await axiosInstance.get("/locations", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setLocations(response.data);
    } catch (error) {
      console.error("Erro ao buscar locais", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        "/locations",
        {
          name: locationName,
          address: locationAddress,
          capacity: capacity,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setLocations([...locations, response.data]);
      setLocationName("");
      setLocationAddress("");
      setCapacity(0);
    } catch (error) {
      alert("Erro ao cadastrar local.");
    }
  };

  return (
    <div className="locations-management-container">
      <header className="locations-management-header">
        <Link to="/dashboard" className="back-button">
        
          &#8592;
        </Link>
        <div className="header-title">SmartTicket</div>
        <div className="placeholder"></div>
        <UserMenu />
      </header>
      <main className="locations-management-content">
        <section className="add-location-section">
          <h2>Cadastrar novo local</h2>
          <form onSubmit={handleAddLocation} className="add-location-form">
            <label htmlFor="locationName">Nome do Local</label>
            <input
              id="locationName"
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
            />
            <label htmlFor="locationAddress">Endereço</label>
            <input
              id="locationAddress"
              type="text"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              required
            />
            <label htmlFor="capacity">Capacidade</label>
            <input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              required
            />
            <button type="submit">Adicionar Local</button>
          </form>
        </section>
        <section className="locations-list-section">
          <h2>Seus locais:</h2>
          <ul className="locations-list">
            {locations.length === 0 ? (
              <p>Nenhum local cadastrado.</p>
            ) : (
              locations.map((loc) => (
                <li key={loc.id} className="location-item">
                  <span className="location-id">ID: {loc.id}</span>
                  <span className="location-name">{loc.name}</span>
                  <span className="location-address">{loc.address}</span>
                  <span className="location-capacity">
                    Capacidade: {loc.capacity}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default LocationsManagement;
