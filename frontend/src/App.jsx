import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import Datacenters from './pages/Datacenters';
import Repartiteurs from './pages/Repartiteurs';
import Splitters from './pages/Splitters';
import BoitesClients from './pages/BoitesClients';
import Clients from './pages/Clients';
import Equipements from './pages/Equipements';
import Users from './pages/Users';
import Logs from './pages/Logs';
import Profile from './pages/Profile';
import FibrePaths from './pages/FibrePaths';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes inside Global Layout Shell */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard Index */}
              <Route index element={<Dashboard />} />

              {/* Map view */}
              <Route path="map" element={<MapPage />} />

              {/* CRUD Views */}
              <Route path="datacenters" element={<Datacenters />} />
              <Route path="repartiteurs" element={<Repartiteurs />} />
              <Route path="splitters" element={<Splitters />} />
              <Route path="client-boxes" element={<BoitesClients />} />
              <Route path="clients" element={<Clients />} />
              <Route path="equipements" element={<Equipements />} />
              <Route path="fibre-paths" element={<FibrePaths />} />
              <Route path="profile" element={<Profile />} />

              {/* Admin Only Views */}
              <Route 
                path="users" 
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                    <Users />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="logs" 
                element={
                  <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                    <Logs />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Default Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
