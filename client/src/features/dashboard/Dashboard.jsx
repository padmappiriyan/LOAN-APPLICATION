import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/auth/useLogout';
import usePermission from '../../hooks/usePermission';
import { Link } from 'react-router-dom';
import { Landmark, Users, Shield, Settings, TrendingUp, UserCheck, Briefcase } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { can, hasAny } = usePermission();
  const { mutate: logout, isPending } = useLogout();

  const showAdminPanel = hasAny(['user:read', 'role:read', 'system:settings']);
  const showCustomerPanel = hasAny(['customer:read_all', 'customer:read_own', 'customer:create']);
  const showLoanPanel = hasAny(['loan:read_all', 'loan:read_own', 'loan:create']);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col relative overflow-hidden selection:bg-brand-500 selection:text-white">
      
      {/* ── LIGHT BLUE LOAN & FINANCE BACKGROUND WATERMARK ── */}
      <div className="absolute inset-0 pointer-events-none z-0 select-none">
        <svg className="w-full h-full text-brand-600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          {/* Grid lines - very faint */}
          <rect width="100%" height="100%" fill="url(#grid)" className="opacity-[0.035]" />
          
          {/* Financial Growth Curves - soft */}
          <g className="opacity-[0.06]">
            <path d="M 0 700 Q 300 500 600 620 T 1200 400 T 1800 250" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M 0 750 Q 350 450 700 580 T 1300 320 T 1800 150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" />
            {/* Keypoints */}
            <circle cx="600" cy="620" r="8" fill="currentColor" />
            <circle cx="1200" cy="400" r="8" fill="currentColor" />
            <circle cx="1300" cy="320" r="5" fill="currentColor" />
          </g>

          {/* Float Labels - stand out slightly more */}
          <g className="opacity-[0.11]">
            <text x="620" y="615" fontSize="18" fill="currentColor" fontWeight="bold" fontFamily="sans-serif">$ Loans</text>
            <text x="1220" y="395" fontSize="18" fill="currentColor" fontWeight="bold" fontFamily="sans-serif">% Interest</text>
            <text x="1320" y="315" fontSize="18" fill="currentColor" fontWeight="bold" fontFamily="sans-serif">Approval</text>
          </g>
        </svg>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20">
              <Landmark size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-zinc-900 tracking-tight">Smart Loans</span>
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-100 shadow-sm animate-pulse-slow">
              {user?.role?.name || 'User'}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-zinc-950">{user?.name}</div>
              <div className="text-xs text-zinc-500">{user?.email}</div>
            </div>
            <button 
              onClick={() => logout()} 
              disabled={isPending}
              className="text-sm font-medium text-zinc-500 hover:text-brand-600 transition-colors py-2 px-3 hover:bg-zinc-100 rounded-lg"
            >
              {isPending ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full z-10 animate-fade-in space-y-12">
        
        {showAdminPanel && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-50 border border-brand-100 shadow-sm rounded-lg">
                <TrendingUp size={20} className="text-brand-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">
                  {user?.role?.name || 'User'} Control Center
                </h1>
                <p className="text-zinc-500 mt-1 text-sm sm:text-base">
                  Manage system configuration, staff accounts, and access control.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {can('user:read') && (
                <div className="bg-zinc-100/80 p-2 rounded-[32px] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 group">
                  <div className="bg-white border border-zinc-200 rounded-[24px] p-6 flex flex-col h-full relative overflow-hidden">
                    <div className="icon-brand-container group-hover:bg-brand-600 group-hover:text-white group-hover:border-transparent relative z-10">
                      <Users size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-950 mb-2 mt-2 group-hover:text-brand-600 transition-colors relative z-10">Staff Management</h2>
                    <p className="text-zinc-500 mb-6 flex-1 text-sm leading-relaxed relative z-10">
                      Provision new accounts, reset passwords, and manage employee access levels.
                    </p>
                    <div className="space-y-3 relative z-10">
                      <Link to="/users" className="btn-brand-secondary">
                        View All Staff
                      </Link>
                      {can('user:create') && (
                        <Link to="/users/create" className="btn-brand-primary">
                          + Provision New User
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {can('role:read') && (
                <div className="bg-zinc-100/80 p-2 rounded-[32px] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 group">
                  <div className="bg-white border border-zinc-200 rounded-[24px] p-6 flex flex-col h-full relative overflow-hidden">
                    <div className="icon-brand-container group-hover:bg-brand-600 group-hover:text-white group-hover:border-transparent relative z-10">
                      <Shield size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-950 mb-2 mt-2 group-hover:text-brand-600 transition-colors relative z-10">Role & Permissions</h2>
                    <p className="text-zinc-500 mb-6 flex-1 text-sm leading-relaxed relative z-10">
                      Configure granular access control roles. Control exactly what each staff member can do.
                    </p>
                    <div className="space-y-3 relative z-10">
                      <Link to="/roles" className="btn-brand-secondary">
                        Manage Roles
                      </Link>
                      {can('role:create') && (
                        <Link to="/roles/create" className="btn-brand-primary">
                          + Create Custom Role
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {can('system:settings') && (
                <div className="bg-zinc-100/80 p-2 rounded-[32px] border border-zinc-200/70 opacity-70 group shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <div className="bg-zinc-50 border border-zinc-200 rounded-[24px] p-6 flex flex-col h-full">
                    <div className="w-12 h-12 bg-zinc-200/60 text-zinc-400 rounded-xl flex items-center justify-center mb-4 border border-zinc-300/30">
                      <Settings size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-400 mb-2 mt-2">System Settings</h2>
                    <p className="text-zinc-400 mb-6 flex-1 text-sm leading-relaxed">
                      Configure branch details, email templates, and global parameters. (Coming soon)
                    </p>
                    <div className="space-y-3 mt-auto">
                      <button disabled className="block w-full py-2.5 px-4 bg-zinc-200/30 text-zinc-400 font-semibold rounded-xl text-center border border-zinc-300/20 cursor-not-allowed">
                        Go to Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {showCustomerPanel && (
          <section className="space-y-6 pt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-brand-50 border border-brand-100 shadow-sm rounded-lg">
                <Briefcase size={20} className="text-brand-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">
                  Client Operations
                </h1>
                <p className="text-zinc-500 mt-1 text-sm sm:text-base">
                  Manage borrower profiles and loan workflows.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hasAny(['customer:read_all', 'customer:read_own']) && (
                <div className="bg-zinc-100/80 p-2 rounded-[32px] border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 group">
                  <div className="bg-white border border-zinc-200 rounded-[24px] p-6 flex flex-col h-full relative overflow-hidden">
                    <div className="icon-brand-container group-hover:bg-brand-600 group-hover:text-white group-hover:border-transparent relative z-10">
                      <UserCheck size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-950 mb-2 mt-2 group-hover:text-brand-600 transition-colors relative z-10">Customer Profiles</h2>
                    <p className="text-zinc-500 mb-6 flex-1 text-sm leading-relaxed relative z-10">
                      View borrower histories, update contact details, and manage KYC records.
                    </p>
                    <div className="space-y-3 mt-auto relative z-10">
                      <Link to="/customers" className="btn-brand-secondary">
                        View Customers
                      </Link>
                      {can('customer:create') && (
                        <Link to="/customers/create" className="btn-brand-primary">
                          + Register New Customer
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Generic user welcome if they have no admin tools */}
        {!showAdminPanel && !showCustomerPanel && !showLoanPanel && (
          <section className="text-center py-20 bg-white border border-zinc-200 rounded-3xl p-8 max-w-2xl mx-auto shadow-sm relative overflow-hidden">
            <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-500/10">
              <Landmark size={32} className="text-brand-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-zinc-950 mb-3">Welcome, {user?.name}!</h1>
            <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">
              Your account has been set up successfully. Await further module releases or check with your admin for specific tool access.
            </p>
          </section>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
