import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import SpinnerFullPage from "../components/SpinnerFullPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  if (isAuthLoading) return <SpinnerFullPage />;

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
