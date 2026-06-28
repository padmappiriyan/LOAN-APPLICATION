import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/auth/useLogout';
import usePermission from '../../hooks/usePermission';
import { Link } from 'react-router-dom';
import { Landmark, Users, Shield, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { can, hasAny } = usePermission();
  const { mutate: logout, isPending } = useLogout();

  const showAdminPanel = hasAny(['user:read', 'role:read', 'system:settings']);
  const showLoanPanel = hasAny(['loan:read_all', 'loan:read_own', 'loan:create']);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <Landmark size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Smart Loans</span>
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
              {user?.role?.name || 'User'}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
            <button 
              onClick={() => logout()} 
              disabled={isPending}
              className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
            >
              {isPending ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in space-y-12">
        
        {showAdminPanel && (
          <section>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
              <p className="text-gray-500 mt-1">Manage system configuration, staff accounts, and access control.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {can('user:read') && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Users size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Staff Management</h2>
                  <p className="text-gray-500 mb-6 flex-1 text-sm">Provision new accounts, reset passwords, and manage employee access.</p>
                  <div className="space-y-3">
                    <Link to="/users" className="block w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg text-center transition-colors">
                      View All Staff
                    </Link>
                    {can('user:create') && (
                      <Link to="/users/create" className="block w-full py-2.5 px-4 bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium rounded-lg text-center transition-colors">
                        + Provision New User
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {can('role:read') && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Shield size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Role & Permissions</h2>
                  <p className="text-gray-500 mb-6 flex-1 text-sm">Configure granular access control roles exactly what each staff can do.</p>
                  <div className="space-y-3">
                    <Link to="/roles" className="block w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg text-center transition-colors">
                      Manage Roles
                    </Link>
                    {can('role:create') && (
                      <Link to="/roles/create" className="block w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded-lg text-center transition-colors">
                        + Create Custom Role
                      </Link>
                    )}
                  </div>
                </div>
              )}
              
              {can('system:settings') && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow group opacity-75">
                  <div className="w-12 h-12 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                    <Settings size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">System Settings</h2>
                  <p className="text-gray-500 mb-6 flex-1 text-sm">Configure branch details, email templates, and global parameters.</p>
                  <div className="space-y-3 mt-auto">
                    <button disabled className="block w-full py-2.5 px-4 bg-gray-100 text-gray-400 font-medium rounded-lg text-center cursor-not-allowed">
                      Go to Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Generic user welcome if they have no admin tools */}
        {!showAdminPanel && !showLoanPanel && (
          <section className="text-center py-20">
            <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Landmark size={32} className="text-brand-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Your account has been set up successfully. Await further module releases or check with your admin for specific tool access.
            </p>
          </section>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
