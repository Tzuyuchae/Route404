import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { username } = useAuth();

  if (!username) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;