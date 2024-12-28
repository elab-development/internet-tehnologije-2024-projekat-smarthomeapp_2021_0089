import './App.css';
import Login from './components/Login';
import Devices from './components/Devices';
import {Routes, Route, Link, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter className="App">
      <Routes>
        {/* Ruta za Login stranicu */}
        <Route path="/" element={<Login />} />
        {/* Ruta za Dashboard stranicu */}
        <Route path="/dashboard" element={<Devices />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
