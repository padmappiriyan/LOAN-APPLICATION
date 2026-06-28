import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import useResetPassword from '../../hooks/auth/useResetPassword';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate: resetPassword, isPending, error } = useResetPassword();
  const mismatch = confirmPassword && newPassword !== confirmPassword;
  const errorMessage = error?.response?.data?.message || null;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-500 mb-4">This link is missing or invalid.</p>
          <Link to="/forgot-password" className="btn-primary">Request New Link</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mismatch) return;
    resetPassword({ token, newPassword, confirmPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
            <p className="text-gray-500 mt-1 text-sm">Create a strong new password for your account.</p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">⚠️ {errorMessage}</p>
              {errorMessage.includes('expired') && (
                <Link to="/forgot-password" className="text-brand-600 text-sm font-medium mt-1 block">Request a new link →</Link>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="reset-new-pwd" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input id="reset-new-pwd" type={showNew ? 'text' : 'password'} required minLength={8}
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field pr-12" placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showNew ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reset-confirm-pwd" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input id="reset-confirm-pwd" type={showConfirm ? 'text' : 'password'} required
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input-field pr-12 ${mismatch ? 'border-red-400' : ''}`}
                  placeholder="Repeat new password" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
              {mismatch && <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>}
            </div>

            <button id="reset-pwd-btn" type="submit" disabled={isPending || !!mismatch}
              className="btn-primary w-full">
              {isPending ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Resetting...</>
              ) : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
