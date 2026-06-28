/**
 * Utility to determine the correct dashboard route based on user permissions
 * instead of hardcoded role names.
 */
export const getDashboardRouteForUser = (user) => {
  if (!user || !user.permissions || !Array.isArray(user.permissions)) {
    return '/dashboard';
  }

  const p = user.permissions;

  // Admin Level Access
  if (p.includes('role:read') || p.includes('user:read') || p.includes('system:settings')) {
    return '/dashboard/admin';
  }

  // Manager Level Access
  if (p.includes('loan:approve') || p.includes('payment:verify')) {
    return '/dashboard/manager';
  }

  // Accountant Level Access
  if (p.includes('capital:read') || p.includes('salary:read') || p.includes('expense:read')) {
    return '/dashboard/accountant';
  }

  // Field Officer Level Access
  if (p.includes('loan:create') || p.includes('payment:create')) {
    return '/dashboard/officer';
  }

  // Fallback
  return '/dashboard';
};
