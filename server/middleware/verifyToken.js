import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

/**
 * Middleware: Verifies the accessToken HTTP-only cookie.
 * Populates req.user with: { id, name, email, role, permissions[], mustChangePassword }
 */
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    console.log('🔑 Verifying access token:', token);

    if (!token) {
      return res.status(401).json({
        message: 'No access token provided. Please log in.',
        code: 'NO_TOKEN',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Populate role → get permissions[]
    const user = await User.findById(decoded.id)
      .populate('role', 'name permissions')
      .select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'User not found. Please log in again.',
        code: 'USER_NOT_FOUND',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: 'Your account has been disabled. Contact your administrator.',
        code: 'ACCOUNT_DISABLED',
      });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: {
        id: user.role?._id?.toString(),
        name: user.role?.name,
      },
      permissions: user.role?.permissions || [],
      mustChangePassword: user.mustChangePassword,
      isActive: user.isActive,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Access token has expired.',
        code: 'TOKEN_EXPIRED',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid access token.',
        code: 'INVALID_TOKEN',
      });
    }
    next(error);
  }
};

export default verifyToken;
