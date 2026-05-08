import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactElement;
}

export default function RequireAuth({ children }: Props) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login but save the current location
  // This is a nice "Human Touch" so that after logging in, they return to the page they wanted
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}