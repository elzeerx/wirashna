
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'supervisor' | 'subscriber')[];
};

const ProtectedRoute = ({ children, allowedRoles = [] }: ProtectedRouteProps) => {
  const { user, isLoading, userRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Return a loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="wirashna-loader"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has the required role
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to dashboard or home based on role
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'supervisor') {
      return <Navigate to="/supervisor" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated and has the required role (if specified)
  return <>{children}</>;
};

export default ProtectedRoute;
