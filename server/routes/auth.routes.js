import express from 'express';
const router = express.Router();

import { login, logout, refreshToken, getMe, changePassword } from '../controllers/auth.controller.js';
import { forgotPassword, resetPassword } from '../controllers/forgotPassword.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import { loginRateLimiter, forgotPasswordRateLimiter } from '../middleware/rateLimiter.js';

router.post('/login', loginRateLimiter, login);
router.post('/logout', verifyToken, logout);
router.post('/refresh-token', refreshToken);
router.get('/me', verifyToken, getMe);
router.post('/change-password', verifyToken, changePassword);
router.post('/forgot-password', forgotPasswordRateLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
