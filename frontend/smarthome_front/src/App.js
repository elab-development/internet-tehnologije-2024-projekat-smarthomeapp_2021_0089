import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Devices from './pages/Devices';
import {Routes, Route, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Devices />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
