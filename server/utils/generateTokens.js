import jwt from 'jsonwebtoken';

/**
 * Generate a short-lived JWT access token.
 * @param {Object} payload - { id, email }
 * @returns {string} Signed JWT
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
};

/**
 * Generate a long-lived JWT refresh token.
 * @param {Object} payload - { id, email }
 * @returns {string} Signed JWT
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};
