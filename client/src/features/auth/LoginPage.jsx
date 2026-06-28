import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useLogin from '../../hooks/auth/useLogin';
import { Landmark, ClipboardList, CircleDollarSign, Users, Building, CheckCircle2, AlertTriangle, Eye, EyeOff, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';

  const { mutate: login, isPending, error, reset } = useLogin();

  const errorMessage = error?.response?.data?.message || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    reset();
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-600 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-white">
              <Landmark size={24} />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl leading-tight">Smart Loans</h1>
              <p className="text-brand-200 text-sm">Management System</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <blockquote className="text-white text-2xl font-light leading-relaxed mb-8">
            "Empowering communities through
            <span className="font-semibold text-brand-200"> smart lending </span>
            and transparent management."
          </blockquote>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Active Loans', value: '—', icon: <ClipboardList size={24} className="text-sky-300" /> },
              { label: 'Collections Today', value: '—', icon: <CircleDollarSign size={24} className="text-emerald-300" /> },
              { label: 'Field Officers', value: '—', icon: <Users size={24} className="text-fuchsia-300" /> },
              { label: 'Branches', value: '1', icon: <Building size={24} className="text-amber-300" /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-20 hover:bg-opacity-20 transition-colors">
                <div className="mb-2">{stat.icon}</div>
                <div className="text-white font-bold text-xl">{stat.value}</div>
                <div className="text-brand-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-brand-300 text-sm">
            © 2026 Smart Loans. Internal use only.
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-brand-700 rounded-xl flex items-center justify-center text-white">
              <Landmark size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">Smart Loans</h1>
              <p className="text-gray-500 text-sm">Management System</p>
            </div>
          </div>

          <div className="animate-slide-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

            {/* Reset success banner */}
            {resetSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                <p className="text-green-800 text-sm font-medium">
                  Password reset successfully. Please sign in with your new password.
                </p>
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@smartloans.lk"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-brand-600 hover:text-brand-800 font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit */}
              <button
                id="login-btn"
                type="submit"
                disabled={isPending}
                className="btn-primary w-full text-base py-3.5"
              >
                {isPending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 flex flex-col items-center text-center text-xs text-gray-400 gap-1.5">
              <Lock size={14} className="text-gray-400" />
              <p>
                This system is for authorized Smart Loans staff only.
                <br />Unauthorized access is prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
