import { Link } from 'react-router-dom';
import useGetUsers from '../../../hooks/users/useGetUsers';
import useToggleUserStatus from '../../../hooks/users/useToggleUserStatus';
import usePermission from '../../../hooks/usePermission';
import useAuth from '../../../hooks/useAuth';

const UserListPage = () => {
  const { data: users = [], isLoading } = useGetUsers();
  const { mutate: toggleStatus } = useToggleUserStatus();
  const { user: currentUser } = useAuth();
  
  const canCreate = usePermission('user:create');
  const canDisable = usePermission('user:disable');

  if (isLoading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Accounts</h1>
          <p className="text-gray-500 mt-1">Manage system access for all employees.</p>
        </div>
        {canCreate && (
          <Link to="/admin/users/create" className="btn-primary">
            + Provision New User
          </Link>
        )}
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {u.name}
                          {u._id === currentUser.id && <span className="badge-info text-[10px] px-1.5 py-0">You</span>}
                        </div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700">
                      {u.role?.name || 'No Role'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.isActive ? (
                      <span className="badge-success">Active</span>
                    ) : (
                      <span className="badge-danger">Disabled</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-sm font-medium text-brand-600 hover:text-brand-800">Edit</button>
                      {canDisable && u._id !== currentUser.id && (
                        <button 
                          onClick={() => toggleStatus(u._id)}
                          className={`text-sm font-medium ${u.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                        >
                          {u.isActive ? 'Disable' : 'Enable'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserListPage;
