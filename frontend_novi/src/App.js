import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Devices from './pages/DevicesPage';
import RootLayout from './layouts/RootLayout';
import { system } from "@chakra-ui/react/preset";
import Profile from './pages/ProfilePage';
import Dashboard from './pages/DashboardPage';
import ProtectedRoute from './pages/ProtectedRoute';
import StatisticsPage from './pages/StatisticsPage';
import WeatherPage from './pages/WeatherPage';
import { Navigate } from "react-router-dom";
import AdminPanel from './pages/AdminPanelPage';


function App() {
  return (
    <ChakraProvider value={system}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<ProtectedRoute>  <RootLayout /> </ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} >
              <Route index element={<Navigate to="statistics" replace />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="weather" element={<WeatherPage />} />
              <Route path="adminpanel" element={<AdminPanel/>}></Route>
            </Route>
            <Route path="devices" element={<Devices />} /> {/* child ruta */}
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
