import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserRoleId, isTokenExpired } from '../utils/tokenUtils';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const tokenExpired = isTokenExpired();
  const role = getUserRoleId();

  if (tokenExpired || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
