import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pruebajoa from "./pages/pruebajoa";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/pruebajoa" element={<Pruebajoa />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </Router>
  );
}

export default App
