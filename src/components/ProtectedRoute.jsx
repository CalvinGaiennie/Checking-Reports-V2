import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ element, allowedPermissions }) {
  const { authState } = useAuth();

  if (authState.status !== "logged in") {
    return <Navigate to="/login" replace />;
  }

  if (!allowedPermissions.includes(authState.permissions)) {
    return <Navigate to="/input" replace />;
  }

  return element;
}

export default ProtectedRoute;
