import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

import PublicRoute from '../components/PublicRoute';
import RequireAuth from '../components/RequireAuth';

// Auth Pages
import LoginPage from '../features/auth/LoginPage';
import ForceChangePwdPage from '../features/auth/ForceChangePwdPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';
import UnauthorizedPage from '../features/auth/UnauthorizedPage';

// Landing Page
import LandingPage from '../features/landing/LandingPage';

// Dashboards
import Dashboard from '../features/dashboard/Dashboard';

// Admin Pages
import RoleListPage from '../features/roles/RoleListPage';
import CreateRolePage from '../features/roles/CreateRolePage';
import EditRolePage from '../features/roles/EditRolePage';
import UserListPage from '../features/users/UserListPage';
import CreateUserPage from '../features/users/CreateUserPage';

// Customer Pages
import CustomerListPage from '../features/customers/CustomerListPage';
import CreateCustomerPage from '../features/customers/CreateCustomerPage';

const AppRouter = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Root redirect logic based on permissions
  const getRootRedirect = () => {
    if (!isAuthenticated) return '/login';
    if (user?.mustChangePassword) return '/change-password';
    return '/dashboard';
  };

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Routes (Only accessible if NOT logged in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Semi-Private Route (Logged in, but must change password) */}
      <Route path="/change-password" element={
        isAuthenticated && user?.mustChangePassword ? 
        <ForceChangePwdPage /> : 
        <Navigate to={getRootRedirect()} replace />
      } />

      {/* Fully Private Routes (Must be logged in & password changed) */}
      <Route element={<RequireAuth />}>
        {/* Unified Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Role Management (Requires 'role:read' / 'role:create' permissions) */}
      <Route element={<RequireAuth requiredPermission="role:read" />}>
        <Route path="/roles" element={<RoleListPage />} />
      </Route>
      <Route element={<RequireAuth requiredPermission="role:create" />}>
        <Route path="/roles/create" element={<CreateRolePage />} />
      </Route>
      <Route element={<RequireAuth requiredPermission="role:update" />}>
        <Route path="/roles/edit/:id" element={<EditRolePage />} />
      </Route>

      {/* User Management (Requires 'user:read' / 'user:create' permissions) */}
      <Route element={<RequireAuth requiredPermission="user:read" />}>
        <Route path="/users" element={<UserListPage />} />
      </Route>
      <Route element={<RequireAuth requiredPermission="user:create" />}>
        <Route path="/users/create" element={<CreateUserPage />} />
      </Route>

      {/* Customer Management */}
      <Route element={<RequireAuth requiredPermission={['customer:read_all', 'customer:read_own']} />}>
        <Route path="/customers" element={<CustomerListPage />} />
      </Route>
      <Route element={<RequireAuth requiredPermission="customer:create" />}>
        <Route path="/customers/create" element={<CreateCustomerPage />} />
      </Route>

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* 404 Catch-all */}
      <Route path="*" element={<Navigate to={getRootRedirect()} replace />} />
    </Routes>
  );
};

export default AppRouter;
