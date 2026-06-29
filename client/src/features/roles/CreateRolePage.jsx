import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCreateRole from '../../hooks/roles/useCreateRole';
import { PERMISSION_GROUPS } from '../../config/permissions';

const CreateRolePage = () => {
  const navigate = useNavigate();
  const { mutate: createRole, isPending, error } = useCreateRole();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPerms, setSelectedPerms] = useState(new Set());

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
    createRole(
      { name, description, permissions: Array.from(selectedPerms) },
      {
        onSuccess: () => {
          navigate('/roles');
        }
      }
    );
  };

  const errorMessage = error?.response?.data?.message;

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-600">Create Custom Role</h1>
          <p className="text-gray-500  text-[13px] mt-1">Define a new role and configure its system access level.</p>
        </div>
        <Link to="/roles" className="btn-secondary">Cancel</Link>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          ⚠️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Role Details */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-6">Role Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role Name <span className="text-red-500">*</span></label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="e.g., Senior Auditor" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" placeholder="Brief description of responsibilities" />
            </div>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="card">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900">Permissions Configuration <span className="text-red-500">*</span></h2>
            <div className="text-sm text-gray-500 font-medium">Selected: {selectedPerms.size}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {PERMISSION_GROUPS.map((group) => {
              const allSelected = group.permissions.every((p) => selectedPerms.has(p.key));
              const someSelected = group.permissions.some((p) => selectedPerms.has(p.key)) && !allSelected;

              return (
                <div key={group.group} className="border border-zinc-200/50 rounded-xl overflow-hidden bg-[#f8f8f8] shadow-sm">
                  <div className="bg-[#f8f8f8] p-4 border-b border-zinc-200/50 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm">{group.group}</h3>
                    <button type="button" onClick={() => handleSelectGroup(group.permissions, !allSelected)}
                      className="text-xs font-medium text-brand-600 hover:text-brand-800">
                      {allSelected ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    {group.permissions.map((p) => (
                      <label key={p.key} className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center mt-0.5">
                          <input type="checkbox" className="peer sr-only" checked={selectedPerms.has(p.key)} onChange={() => handleTogglePerm(p.key)} />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded transition-all peer-checked:bg-brand-600 peer-checked:border-brand-600 group-hover:border-brand-400 flex items-center justify-center">
                            <svg className={`w-3.5 h-3.5 text-white transition-opacity ${selectedPerms.has(p.key) ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{p.label}</p>
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
          <button type="submit" disabled={isPending || !name || selectedPerms.size === 0} className="btn-primary min-w-[200px]">
            {isPending ? 'Creating...' : 'Create Role & Save Permissions'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRolePage;
