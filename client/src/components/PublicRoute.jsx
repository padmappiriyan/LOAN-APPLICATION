import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getDashboardRouteForUser } from '../utils/routeUtils';

/**
 * Redirects authenticated users away from public pages (like /login).
 */
const PublicRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated && user) {
    const dest = getDashboardRouteForUser(user);
    return <Navigate to={dest} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
