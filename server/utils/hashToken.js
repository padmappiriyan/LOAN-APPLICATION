import crypto from 'crypto';

/**
 * SHA-256 hash a raw token string.
 * Used to securely store password reset tokens in DB without revealing raw value.
 * @param {string} rawToken
 * @returns {string} hex hash
 */
const hashToken = (rawToken) => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

export default hashToken;
