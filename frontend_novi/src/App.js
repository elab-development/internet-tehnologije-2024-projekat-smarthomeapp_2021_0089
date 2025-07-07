import './App.css';
import {Routes, Route, BrowserRouter } from "react-router-dom";
import { ChakraProvider} from "@chakra-ui/react";
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Devices from './pages/DevicesPage';
import RootLayout from './layouts/RootLayout';
import { system } from "@chakra-ui/react/preset";
import Create from './pages/CreateDevicePage';
import Profile from './pages/ProfilePage';
import Dashboard from './pages/DashboardPage';


function App() {
  return (
    <ChakraProvider value={system}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<RootLayout />}>
            <Route path="/main/dashboard" element={<Dashboard />} />
            <Route path="/main/devices" element={<Devices />} /> {/* Child route */}
            <Route path="/main/create" element={<Create />} />
            <Route path="/main/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
