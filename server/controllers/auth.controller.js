import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import { accessTokenCookieOptions, refreshTokenCookieOptions, clearCookieOptions } from '../utils/cookieOptions.js';

// ──────────────────────────────────────────────────────────────
// @desc   Login user
// @route  POST /api/auth/login
// @access Public
// ──────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user with password (select:false by default)
    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+password')
      .populate('role', 'name permissions');

    // Generic message prevents user enumeration
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: 'Your account has been disabled. Contact your administrator.',
        code: 'ACCOUNT_DISABLED',
      });
    }

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    // Generate tokens
    const tokenPayload = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Set HTTP-only cookies
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: {
          id: user.role._id,
          name: user.role.name,
        },
        permissions: user.role.permissions,
        mustChangePassword: user.mustChangePassword,
        lastLoginAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────
// @desc   Logout user
// @route  POST /api/auth/logout
// @access Private
// ──────────────────────────────────────────────────────────────
export const logout = (req, res) => {
  res.clearCookie('accessToken', clearCookieOptions);
  res.clearCookie('refreshToken', clearCookieOptions);
  res.status(200).json({ message: 'Logged out successfully.' });
};

// ──────────────────────────────────────────────────────────────
// @desc   Refresh access token using refresh token cookie
// @route  POST /api/auth/refresh-token
// @access Public (uses HttpOnly refresh token cookie)
// ──────────────────────────────────────────────────────────────
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: 'No refresh token provided. Please log in again.',
        code: 'NO_REFRESH_TOKEN',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id).select('_id email isActive');
    if (!user || !user.isActive) {
      return res.status(401).json({
        message: 'Session is invalid. Please log in again.',
        code: 'INVALID_SESSION',
      });
    }

    const newAccessToken = generateAccessToken({ id: user._id, email: user.email });
    res.cookie('accessToken', newAccessToken, accessTokenCookieOptions);

    res.status(200).json({ message: 'Token refreshed successfully.' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Session expired. Please log in again.',
        code: 'REFRESH_TOKEN_EXPIRED',
      });
    }
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────
// @desc   Get current authenticated user
// @route  GET /api/auth/me
// @access Private
// ──────────────────────────────────────────────────────────────
export const getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};

// ──────────────────────────────────────────────────────────────
// @desc   Change password (forced on first login or voluntary)
// @route  POST /api/auth/change-password
// @access Private
// ──────────────────────────────────────────────────────────────
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'New password and confirmation are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If NOT a forced change, require current password verification
    if (!user.mustChangePassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required.' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }
    }

    user.password = newPassword; // will be hashed by pre-save hook
    user.mustChangePassword = false;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully. Welcome to Smart Loans!' });
  } catch (error) {
    next(error);
  }
};
