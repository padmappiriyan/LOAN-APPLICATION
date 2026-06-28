/**
 * Middleware factory: Checks that req.user has ALL required permission keys.
 * Usage: router.post('/loans', verifyToken, checkPermission('loan:create'), handler)
 * Usage (multiple): checkPermission('loan:create', 'payment:create')
 */
const checkPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || [];

    const missingPermissions = requiredPermissions.filter(
      (perm) => !userPermissions.includes(perm)
    );

    if (missingPermissions.length > 0) {
      return res.status(403).json({
        message: 'Forbidden: You do not have the required permission to perform this action.',
        code: 'INSUFFICIENT_PERMISSION',
        missing: missingPermissions,
      });
    }

    next();
  };
};

export default checkPermission;
