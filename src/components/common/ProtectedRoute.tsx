import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts';
import { Spinner } from '@/components/ui/spinner';

export function ProtectedRoute() {
  const { isAuthenticated, isPending } = useAuth();
  const location = useLocation();

  // Show loading while checking auth status
  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child routes
  return <Outlet />;
}
