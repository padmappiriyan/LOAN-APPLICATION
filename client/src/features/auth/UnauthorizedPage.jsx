import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⛔</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          You do not have the required permissions to view this page or perform this action.
          Please contact your Super Admin if you believe this is a mistake.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-secondary">Go Back Home</Link>
          <Link to="/login" className="btn-primary">Sign In with Different Account</Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
