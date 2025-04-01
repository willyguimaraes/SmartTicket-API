import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './locationsManagement.css';

const LocationsManagement: React.FC = () => {
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [locations, setLocations] = useState([
    { id: 1, name: 'Local 1', address: 'Endereço 1' },
    { id: 2, name: 'Local 2', address: 'Endereço 2' },
    // Adicione mais locais conforme necessário
  ]);

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const newLocation = {
      id: locations.length + 1,
      name: locationName,
      address: locationAddress,
    };
    setLocations([...locations, newLocation]);
    setLocationName('');
    setLocationAddress('');
  };

  return (
    <div className="locations-management-container">
      <header className="locations-management-header">
        <Link to="/dashboard" className="back-button">
          &#8592;
        </Link>
        <div className="header-title">SmartTicket</div>
        <div className="placeholder"></div>
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
            <button type="submit">Adicionar Local</button>
          </form>
        </section>
        <section className="locations-list-section">
          <h2>Seus locais:</h2>
          <ul className="locations-list">
            {locations.map((location) => (
              <li key={location.id} className="location-item">
                <span className="location-name">{location.name}</span>
                <span className="location-address">{location.address}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default LocationsManagement;
