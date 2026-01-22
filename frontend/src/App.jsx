import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pruebajoa from "./pages/pruebajoa";
import LoginForm from './pages/LoginForm';
import Home from './pages/Home'; // ajustado a la casuística real del archivo
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/pruebajoa" element={<Pruebajoa />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App
