import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    if (!role) {
      navigate("/select-role");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
      // Redirect to user's own dashboard if they don't have access
      switch (role) {
        case "tenant":
          navigate("/tenant/dashboard");
          break;
        case "owner":
          navigate("/owner/dashboard");
          break;
        case "agent":
          navigate("/agent/dashboard");
          break;
        case "vendor":
          navigate("/vendor/dashboard");
          break;
        case "technician":
          navigate("/technician/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, role, isLoading, allowedRoles, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !role) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
