import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useGetRole from '../../hooks/roles/useGetRole';
import useUpdateRole from '../../hooks/roles/useUpdateRole';
import { PERMISSION_GROUPS } from '../../config/permissions';

const EditRolePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: role, isLoading: isRoleLoading, error: roleError } = useGetRole(id);
  const { mutate: updateRole, isPending: isUpdating, error: updateError } = useUpdateRole();

  const [description, setDescription] = useState('');
  const [selectedPerms, setSelectedPerms] = useState(new Set());

  // Pre-fill form when role data loads
  useEffect(() => {
    if (role) {
      setDescription(role.description || '');
      setSelectedPerms(new Set(role.permissions || []));
    }
  }, [role]);

  const handleTogglePerm = (permKey) => {
    const newPerms = new Set(selectedPerms);
    if (newPerms.has(permKey)) newPerms.delete(permKey);
    else newPerms.add(permKey);
    setSelectedPerms(newPerms);
  };

  const handleSelectGroup = (groupPerms, selectAll) => {
    const newPerms = new Set(selectedPerms);
    groupPerms.forEach((p) => {
      if (selectAll) newPerms.add(p.key);
      else newPerms.delete(p.key);
    });
    setSelectedPerms(newPerms);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateRole(
      { id, data: { description, permissions: Array.from(selectedPerms) } },
      {
        onSuccess: () => navigate('/roles')
      }
    );
  };

  if (isRoleLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (roleError) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          ⚠️ Failed to load role details. Please go back and try again.
        </div>
      </div>
    );
  }

  const errorMessage = updateError?.response?.data?.message;

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Role: {role?.name}</h1>
          <p className="text-gray-500 mt-1">Modify the description and access permissions for this role.</p>
        </div>
        <Link to="/roles" className="btn-secondary">Cancel</Link>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          ⚠️ {errorMessage}
        </div>
      )}

      {role?.isDefault && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 font-medium">
          ℹ️ This is a default system role. You cannot change its name or permissions.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Role Details */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-6">Role Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role Name <span className="text-gray-400 font-normal">(Read-only)</span></label>
              <input 
                type="text" 
                value={role?.name || ''} 
                disabled 
                className="input-field bg-zinc-100 text-zinc-500 cursor-not-allowed select-none border-zinc-200" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <input 
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="input-field" 
                placeholder="Brief description of responsibilities" 
              />
            </div>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="card">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900">Permissions Configuration</h2>
            <div className="text-sm text-gray-500 font-medium">Selected: {selectedPerms.size}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {PERMISSION_GROUPS.map((group) => {
              const allSelected = group.permissions.every((p) => selectedPerms.has(p.key));
              const someSelected = group.permissions.some((p) => selectedPerms.has(p.key)) && !allSelected;

              return (
                <div key={group.group} className={`border ${role?.isDefault ? 'border-zinc-200 bg-zinc-50' : 'border-zinc-200/50 bg-[#f8f8f8]'} rounded-xl overflow-hidden shadow-sm`}>
                  <div className={`${role?.isDefault ? 'bg-zinc-50' : 'bg-[#f8f8f8]'} p-4 border-b border-zinc-200/50 flex items-center justify-between`}>
                    <h3 className="font-semibold text-gray-800 text-sm">{group.group}</h3>
                    {!role?.isDefault && (
                      <button type="button" onClick={() => handleSelectGroup(group.permissions, !allSelected)}
                        className="text-xs font-medium text-brand-600 hover:text-brand-800">
                        {allSelected ? 'Deselect All' : 'Select All'}
                      </button>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    {group.permissions.map((p) => (
                      <label key={p.key} className={`flex items-start gap-3 ${role?.isDefault ? 'cursor-not-allowed opacity-70' : 'cursor-pointer group'}`}>
                        <div className="relative flex items-center mt-0.5">
                          <input 
                            type="checkbox" 
                            className="peer sr-only" 
                            checked={selectedPerms.has(p.key)} 
                            disabled={role?.isDefault}
                            onChange={() => handleTogglePerm(p.key)} 
                          />
                          <div className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center
                            ${role?.isDefault 
                              ? 'border-gray-300 peer-checked:bg-gray-400 peer-checked:border-gray-400' 
                              : 'border-gray-300 peer-checked:bg-brand-600 peer-checked:border-brand-600 group-hover:border-brand-400'}`}
                          >
                            <svg className={`w-3.5 h-3.5 text-white transition-opacity ${selectedPerms.has(p.key) ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{p.label}</p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">{p.key}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={isUpdating || role?.isDefault} className="btn-primary min-w-[200px]">
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRolePage;
