// src/components/UserMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './userMenu.css';

const UserMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    // Remove o token e qualquer outro dado de autenticação
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Fecha o dropdown se o usuário clicar fora do componente
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="user-menu" ref={menuRef}>
      <div className="user-icon" onClick={() => setOpen(prev => !prev)}>
        &#9787;
      </div>
      {open && (
        <div className="user-dropdown">
          <button onClick={handleLogout}>Sair</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
