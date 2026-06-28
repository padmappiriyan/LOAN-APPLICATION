import useAuth from './useAuth';

/**
 * Custom hook to check if the current user has specific permissions.
 *
 * Usage:
 *   const { can, hasAny, hasAll } = usePermission();
 *   {can('loan:create') && <button>Create</button>}
 */
const usePermission = () => {
  const { user } = useAuth();

  const can = (permission) => {
    if (!user || !Array.isArray(user.permissions)) return false;
    return user.permissions.includes(permission);
  };

  const hasAny = (permissionsArray) => {
    if (!user || !Array.isArray(user.permissions)) return false;
    return permissionsArray.some((p) => user.permissions.includes(p));
  };

  const hasAll = (permissionsArray) => {
    if (!user || !Array.isArray(user.permissions)) return false;
    return permissionsArray.every((p) => user.permissions.includes(p));
  };

  return { can, hasAny, hasAll };
};

export default usePermission;
