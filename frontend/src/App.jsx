import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Pruebajoa from "./pages/pruebajoa";
import LoginForm from './pages/LoginForm';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Verificando autenticación inicial...');
        
        const authenticated = await authService.checkAuth();
        console.log('Autenticado:', authenticated);
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const userData = await authService.getUser();
          console.log('User data:', userData);
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error inicial de autenticación:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando aplicación...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home setIsAuthenticated={setIsAuthenticated} user={user} setUser={setUser} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pruebajoa" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Pruebajoa />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App
