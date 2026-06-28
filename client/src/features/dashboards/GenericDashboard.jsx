import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/auth/useLogout';

const GenericDashboard = ({ title }) => {
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🏦</span>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">Smart Loans</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.role?.name || 'Staff'}</div>
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-2 text-lg">Welcome back, {user?.name}. Your dashboard is ready.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Under Construction</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            The {title} view is currently being built. Core authentication and role-based access control are complete.
          </p>
        </div>
      </main>
    </div>
  );
};

export default GenericDashboard;
