import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to their own role dashboard if unauthorized for this route
      if (user.role === 'HR') return <Navigate to="/hr" replace />;
      if (user.role === 'Manager') return <Navigate to="/manager" replace />;
      return <Navigate to="/employee" replace />;
    }
    return children;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

