import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Protected from "./pages/Protected";
import RequireAuth from "./components/RequireAuth";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    // Wrapping the app in AuthProvider allows any page to check if the user is logged in
    <AuthProvider>
      <div className="min-h-screen font-outfit bg-[#FDFCFE] text-slate-700">
        <BrowserRouter>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route
              path="/protected"
              element={
                <RequireAuth>
                  <Protected />
                </RequireAuth>
              }
            />

            {/* Fallback for 404s */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}