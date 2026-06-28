import useAuth from './useAuth';

/**
 * Check if the current user has a specific permission.
 * @param {string} permission - Permission key e.g. 'loan:create'
 * @returns {boolean}
 *
 * Usage:
 *   const canCreate = usePermission('loan:create');
 *   if (!canCreate) return null;
 */
const usePermission = (permission) => {
  const { user } = useAuth();
  if (!user || !Array.isArray(user.permissions)) return false;
  return user.permissions.includes(permission);
};

export default usePermission;
