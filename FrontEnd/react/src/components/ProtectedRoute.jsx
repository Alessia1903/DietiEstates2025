import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole, redirectTo }) => {
  const token = localStorage.getItem("jwtToken");
  const role = localStorage.getItem("role");

  // Controllo autenticazione e ruolo
  if (!token || !role || (requiredRole && role !== requiredRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
