import { useState } from 'react';
import useChangePassword from '../../hooks/auth/useChangePassword';
import useAuth from '../../hooks/useAuth';

const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const colors = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'];
  return { score, label: labels[score], color: colors[score] };
};

const ForceChangePwdPage = () => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate: changePassword, isPending, error } = useChangePassword();
  const strength = getPasswordStrength(newPassword);
  const mismatch = confirmPassword && newPassword !== confirmPassword;
  const errorMessage = error?.response?.data?.message || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mismatch) return;
    changePassword({ newPassword, confirmPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 to-brand-700 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">🔑</span>
              <h1 className="text-xl font-bold">Password Change Required</h1>
            </div>
            <p className="text-amber-100 text-sm">
              Hello <strong>{user?.name}</strong>! For your security, you must create a new password before accessing the system.
            </p>
          </div>

          <div className="p-8">
            {errorMessage && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">⚠️ {errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNew ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field pr-12"
                    placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNew ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Strength Bar */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength.score ? strength.color : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Strength: <span className="font-semibold">{strength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`input-field pr-12 ${
                      mismatch ? 'border-red-400 focus:ring-red-400' : ''
                    }`}
                    placeholder="Repeat your new password"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {mismatch && (
                  <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
                )}
              </div>

              <ul className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg">
                <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>✓ At least 8 characters</li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>✓ One uppercase letter</li>
                <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>✓ One number</li>
                <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : ''}>✓ One special character</li>
              </ul>

              <button
                id="change-pwd-btn"
                type="submit"
                disabled={isPending || !!mismatch || newPassword.length < 8}
                className="btn-primary w-full text-base py-3.5"
              >
                {isPending ? (
                  <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                ) : 'Set New Password & Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForceChangePwdPage;
