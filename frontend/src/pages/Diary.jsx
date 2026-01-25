import React, { useState } from 'react';
import '../App.css';
import NavBar from '../components/NavBar';
import Calendar from '../components/Calendar';
import { useNavigate } from 'react-router-dom';

const Diary = ({ setIsAuthenticated, user, setUser }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const navigate = useNavigate();
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app">
      <NavBar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        handleLogout={handleLogout}
      />
      <main className="main-content">
        <div className="appointments-content">
          <div className="content-header">
            <h1>Agenda de Turnos</h1>
          </div>
          <Calendar userId={user?.id} />
        </div>
      </main>
    </div>
  );
};

export default Diary;
