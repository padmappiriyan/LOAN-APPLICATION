/**
 * Middleware: Restricts access to Super Admin role only.
 * Use for highly sensitive operations (e.g., system settings, audit logs).
 */
const isSuperAdmin = (req, res, next) => {
  if (req.user?.role?.name !== 'Super Admin') {
    return res.status(403).json({
      message: 'Forbidden: This action requires Super Admin access.',
      code: 'SUPER_ADMIN_REQUIRED',
    });
  }
  next();
};

export default isSuperAdmin;
