import { Link } from 'react-router-dom';
import useGetRoles from '../../hooks/roles/useGetRoles';
import usePermission from '../../hooks/usePermission';

const RoleListPage = () => {
  const { data: roles = [], isLoading } = useGetRoles();
  const canCreate = usePermission('role:create');

  if (isLoading) return <div className="p-8">Loading roles...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-500 mt-1">Configure system roles and access permissions.</p>
        </div>
        {canCreate && (
          <Link to="/roles/create" className="btn-primary">
            + Create Custom Role
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role._id} className="card flex flex-col h-full hover:border-brand-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {role.name}
                  {role.isDefault && (
                    <span className="badge-info text-[10px] px-2 py-0.5">System Default</span>
                  )}
                </h3>
                <p className="text-sm text-gray-500 mt-1 min-h-[40px]">{role.description || 'No description provided.'}</p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                  {role.permissions.length}
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Permissions</span>
              </div>
              <button className="text-sm font-medium text-brand-600 hover:text-brand-800">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleListPage;
