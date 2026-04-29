import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactElement;
}

export default function RequireAuth({ children }: Props) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}