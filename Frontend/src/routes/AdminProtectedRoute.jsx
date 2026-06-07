import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const adminToken = sessionStorage.getItem("adminToken");

  if (!token || !adminToken) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
