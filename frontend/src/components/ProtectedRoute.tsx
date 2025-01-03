import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";;

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/check', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [])
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />
};

export default ProtectedRoute;
