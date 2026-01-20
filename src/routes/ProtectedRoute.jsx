import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuth, checking } = useAuth();

  if (checking) return null; // or loader

  return isAuth ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
