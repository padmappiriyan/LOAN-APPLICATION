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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* Top Blue Section */}
      <div className="relative bg-[#0066FF] rounded-b-[40px] pt-10 pb-16 lg:pb-24 px-8 lg:px-24 w-full mb-6 lg:mb-32">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row relative">
          
          {/* Left Text Content */}
          <div className="lg:w-7/12 text-white pt-4 lg:pt-4 lg:pr-12">
            <div className="flex items-center gap-2 mb-12 lg:mb-8">
              <Landmark size={24} className="text-white" />
              <div>
                <div className="text-xl font-bold tracking-tight leading-none">Smart Loans</div>
                <div className="text-[10px] text-blue-200 uppercase tracking-wider mt-1">Management Platform</div>
              </div>
            </div>
            
            <h1 className="text-3xl lg:text-[46px] font-bold leading-[1.1] mb-3">
              Loan Management<br />System 
            </h1>
            
            <p className="text-blue-100 text-lg leading-relaxed max-w-md">
              A complete end-to-end loan management infrastructure that empowers you to originate, service, and collect loans with unprecedented efficiency.
            </p>
          </div>

          {/* Right Login Card (Floating) */}
          <div className="lg:w-5/12 mt-12 lg:mt-0 lg:absolute lg:right-0 lg:top-20 lg:translate-y-12 w-full max-w-md ml-auto z-10">
            <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,30,100,0.08)] p-10">
              <h2 className="text-[22px] font-medium text-slate-800 mb-8 leading-snug">
                Enter your credentials below<br/>to sign in
              </h2>

              {/* Banners */}
              {resetSuccess && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="text-green-600 shrink-0" size={18} />
                  <p className="text-green-800 text-xs font-medium">Password reset successfully.</p>
                </div>
              )}
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center gap-3">
                  <AlertTriangle className="text-red-600 shrink-0" size={18} />
                  <p className="text-red-800 text-xs font-medium">{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-[13px] font-semibold text-slate-500 mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] text-sm text-slate-800 placeholder-slate-300 transition-all"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-[13px] font-semibold text-slate-500 mb-2">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] text-sm text-slate-800 placeholder-slate-300 transition-all pr-16"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Link to="/forgot-password" className="text-xs font-medium text-[#0066FF] hover:text-blue-800 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-medium py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-8 lg:px-24 pt-12 lg:pt-16 pb-16 w-full flex-1">
        <h3 className="text-2xl font-bold text-slate-700 mb-12">Some of our features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={24} />
            </div>
            <div className="text-sm font-semibold text-slate-700">100% Secure</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Users size={24} />
            </div>
            <div className="text-sm font-semibold text-slate-700">+100,000 clients</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
              <Building size={24} />
            </div>
            <div className="text-sm font-semibold text-slate-700">Multiple Branches</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
              <ClipboardList size={24} />
            </div>
            <div className="text-sm font-semibold text-slate-700">Automated Ledgers</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
              <CircleDollarSign size={24} />
            </div>
            <div className="text-sm font-semibold text-slate-700">Real-time Collections</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
              <CheckCircle2 size={24} />
            </div>
            <div className="text-sm font-semibold text-slate-700">+99% Accuracy</div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-medium text-slate-400">
        <p>© Smart Loans 2026. All rights reserved.</p>
        <div className="flex gap-4">
           <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
           <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
           <a href="#" className="hover:text-slate-600 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
