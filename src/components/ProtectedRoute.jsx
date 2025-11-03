// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Jika tidak ada pengguna (belum login),
    // redirect ke halaman /login
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login, tampilkan halaman asli
  return children;
};

export default ProtectedRoute;