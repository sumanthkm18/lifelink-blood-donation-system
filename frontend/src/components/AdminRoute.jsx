import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  if (userType !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}