const isProduction = process.env.NODE_ENV === 'production';
const isSecure = process.env.COOKIE_SECURE === 'true';

export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: isSecure,
  sameSite: isProduction ? 'strict' : 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes in ms
};

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isSecure,
  sameSite: isProduction ? 'strict' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export const clearCookieOptions = {
  httpOnly: true,
  secure: isSecure,
  sameSite: isProduction ? 'strict' : 'lax',
};
