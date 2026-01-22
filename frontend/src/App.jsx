import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from './pages/LoginForm';

function App() {

  return (

    <LoginForm/>
    // <Router>
    //   <Routes>
    //     <Route path="/pruebajoa" element={<Pruebajoa />} />
    //     {/* Puedes agregar más rutas aquí */}
    //   </Routes>
    // </Router>
  );
}

export default App
