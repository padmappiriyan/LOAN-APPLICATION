import crypto from 'crypto';
import User from '../models/User.model.js';
import PasswordResetToken from '../models/PasswordResetToken.model.js';
import sendEmail from '../utils/sendEmail.js';
import hashToken from '../utils/hashToken.js';

// ──────────────────────────────────────────────────────────────
// @desc   Send password reset email
// @route  POST /api/auth/forgot-password
// @access Public
// ──────────────────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return 200 — prevents user enumeration
    if (!user) {
      return res.status(200).json({
        message: 'If this email exists in our system, a password reset link has been sent.',
      });
    }

    // Remove any existing reset tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Generate cryptographically secure raw token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expireHours = parseInt(process.env.RESET_TOKEN_EXPIRE_HOURS || '1', 10);
    const expiresAt = new Date(Date.now() + expireHours * 60 * 60 * 1000);

    await PasswordResetToken.create({ userId: user._id, tokenHash, expiresAt });

    // Build reset link for frontend
    const resetURL = `${process.env.CLIENT_ORIGIN}/reset-password?token=${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Smart Loans — Password Reset Request',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 24px; border-radius: 12px;">
          <div style="background: white; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1e40af; font-size: 24px; margin: 0;">🏦 Smart Loans</h1>
              <p style="color: #6b7280; margin: 4px 0 0;">Loan Management System</p>
            </div>
            <h2 style="color: #111827; font-size: 20px;">Password Reset Request</h2>
            <p style="color: #374151;">Hello <strong>${user.name}</strong>,</p>
            <p style="color: #374151;">We received a request to reset your Smart Loans account password. Click the button below to create a new password.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetURL}" style="display: inline-block; padding: 14px 32px; background: #1e40af; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Reset My Password</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">⏰ This link expires in <strong>${expireHours} hour${expireHours > 1 ? 's' : ''}</strong>.</p>
            <p style="color: #6b7280; font-size: 14px;">If you did not request this, you can safely ignore this email. Your password will not change.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">Smart Loans Management System &bull; Internal Use Only</p>
          </div>
        </div>
      `,
      text: `Reset your Smart Loans password: ${resetURL} (expires in ${expireHours} hour(s))`,
    });

    res.status(200).json({
      message: 'If this email exists in our system, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────
// @desc   Reset password using token from email
// @route  POST /api/auth/reset-password
// @access Public
// ──────────────────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Token, new password, and confirmation are all required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    const tokenHash = hashToken(token);
    const resetTokenDoc = await PasswordResetToken.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
      usedAt: null,
    });

    if (!resetTokenDoc) {
      return res.status(400).json({
        message: 'This password reset link is invalid or has expired. Please request a new one.',
        code: 'INVALID_RESET_TOKEN',
      });
    }

    const user = await User.findById(resetTokenDoc.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update password
    user.password = newPassword; // hashed by pre-save hook
    user.mustChangePassword = false;
    await user.save();

    // Clean up: delete all reset tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    res.status(200).json({
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
