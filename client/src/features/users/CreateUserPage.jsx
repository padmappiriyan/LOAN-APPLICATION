import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCreateUser from '../../hooks/users/useCreateUser';
import useGetRoles from '../../hooks/roles/useGetRoles';

const CreateUserPage = () => {
  const navigate = useNavigate();
  const { mutate: createUser, isPending, error, isSuccess, data } = useCreateUser();
  const { data: roles = [], isLoading: isLoadingRoles } = useGetRoles();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Temporary password for them
    roleId: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(formData);
  };

  const errorMessage = error?.response?.data?.message;

  if (isSuccess) {
    return (
      <div className="p-8 max-w-2xl mx-auto animate-fade-in">
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            The user account for <strong>{data?.user?.name}</strong> has been created.
            They must change their password upon their first login.
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Share these credentials with the user:</h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Email (Login):</span>
                <span className="font-bold text-brand-700">{data?.user?.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Temporary Password:</span>
                <span className="font-bold text-gray-900">{formData.password}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assigned Role:</span>
                <span className="font-medium text-gray-700">{data?.user?.role?.name}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Link to="/users" className="btn-secondary">Back to User List</Link>
            <button onClick={() => window.location.reload()} className="btn-primary">Create Another User</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Staff User</h1>
          <p className="text-gray-500 mt-1">Provision a new staff account and assign a role.</p>
        </div>
        <Link to="/users" className="btn-secondary">Cancel</Link>
      </div>

      <div className="card">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="john.doe@smartloans.lk" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Role <span className="text-red-500">*</span></label>
              <select name="roleId" required value={formData.roleId} onChange={handleChange} className="input-field bg-white" disabled={isLoadingRoles}>
                <option value="" disabled>Select a role...</option>
                {roles.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Temporary Password <span className="text-red-500">*</span></label>
              <input type="text" name="password" required minLength={8} value={formData.password} onChange={handleChange} className="input-field font-mono" placeholder="Min 8 characters" />
              <p className="text-xs text-brand-600 mt-2 font-medium">ℹ️ The user will be forced to change this upon first login.</p>
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end">
            <button type="submit" disabled={isPending || !formData.roleId} className="btn-primary w-full md:w-auto min-w-[200px]">
              {isPending ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;
