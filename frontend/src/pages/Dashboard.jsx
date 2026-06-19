import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import TechDashboard from './TechDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === 'TECHNICIAN') {
    return <TechDashboard />;
  }
  
  return <AdminDashboard />;
};

export default Dashboard;
