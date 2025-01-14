import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store";

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: Role[] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();

        if (response.ok) {
          setIsAuthenticated(true);
          setRole(result.user.role);
          setUser(result.user);
        } else {
          setIsAuthenticated(false);
          clearUser();
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setIsAuthenticated(false);
        clearUser();
        setLoading(false);
      }
    };

    checkAuth();
  }, [clearUser, setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role!)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
