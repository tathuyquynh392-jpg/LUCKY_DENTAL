import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export const PatientLayout = () => {
  const { user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Authorization check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === 'DOCTOR') {
    return <Navigate to="/doctor/dashboard" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar isMobileOpen={isMobileOpen} toggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)} />
      <div className="main-content">
        <Navbar toggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)} />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
