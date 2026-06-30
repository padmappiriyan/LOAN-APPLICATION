import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Route guard component.
 * Props:
 *   requiredPermission?: string  — optional single permission key
 *
 * Usage:
 *   <Route element={<RequireAuth requiredPermission="loan:approve" />}>
 *     <Route path="/loans/approve" element={<ApprovalPage />} />
 *   </Route>
 */
const RequireAuth = ({ requiredPermission }) => {
  const { isAuthenticated, isLoading, mustChangePassword, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading Smart Loans...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (mustChangePassword) {
    return <Navigate to="/change-password" replace />;
  }

  if (requiredPermission) {
    const hasPermission = Array.isArray(requiredPermission)
      ? requiredPermission.some(perm => user?.permissions?.includes(perm))
      : user?.permissions?.includes(requiredPermission);

    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default RequireAuth;
