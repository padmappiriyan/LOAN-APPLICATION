import { useState } from 'react';
import { Link } from 'react-router-dom';
import useForgotPassword from '../../hooks/auth/useForgotPassword';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const { mutate: sendReset, isPending, isSuccess, error } = useForgotPassword();

  const errorMessage = error?.response?.data?.message || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    sendReset({ email });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md text-center animate-slide-up">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <div className="text-6xl mb-4">📬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h2>
            <p className="text-gray-500 mb-6">
              If <strong>{email}</strong> is registered, we've sent a password reset link.
              Check your inbox and follow the instructions.
            </p>
            <p className="text-xs text-gray-400 mb-8">The link expires in 1 hour.</p>
            <Link to="/login" className="btn-primary">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Enter your work email and we'll send you a reset link.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">⚠️ {errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@smartloans.lk"
              />
            </div>

            <button
              id="forgot-pwd-btn"
              type="submit"
              disabled={isPending}
              className="btn-primary w-full"
            >
              {isPending ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
              ) : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-brand-600 hover:text-brand-800 font-medium">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
