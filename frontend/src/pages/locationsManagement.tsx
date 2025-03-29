// src/pages/LocationsManagement.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Location {
  id: number;
  name: string;
  address: string;
  capacity: number;
}

const LocationsManagement: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState<number>(0);

  const fetchLocations = async () => {
    try {
      const response = await axios.get("/api/locations");
      setLocations(response.data);
    } catch (error) {
      console.error("Erro ao buscar locais", error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/locations", { name, address, capacity });
      fetchLocations();
      setName("");
      setAddress("");
      setCapacity(0);
    } catch (error) {
      alert("Erro ao criar local.");
    }
  };

  return (
    <div className="locations-management">
      <h2>Gerenciar Locais</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Endereço"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Capacidade"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          required
        />
        <button type="submit">Adicionar Local</button>
      </form>
      <ul>
        {locations.map((loc) => (
          <li key={loc.id}>
            <strong>{loc.name}</strong> - {loc.address} (Capacidade: {loc.capacity})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationsManagement;
