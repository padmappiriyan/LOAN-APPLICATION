import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCreateUser from '../../hooks/users/useCreateUser';
import useGetRoles from '../../hooks/roles/useGetRoles';
import SelectDropdown from '../../components/ui/SelectDropdown';
import { User, Mail, Key, Shield, Info, CheckCircle2 } from 'lucide-react';

const CreateUserPage = () => {
  const navigate = useNavigate();
  const { mutate: createUser, isPending, error, isSuccess, data, reset } = useCreateUser();
  const { data: roles = [], isLoading: isLoadingRoles } = useGetRoles();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Temporary password for them
    roleId: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRoleChange = (value) => setFormData({ ...formData, roleId: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(formData);
  };

  const errorMessage = error?.response?.data?.message;

  const roleOptions = roles.map(r => ({ value: r._id, label: r.name }));

  const handleReset = () => {
    setFormData({ name: '', email: '', password: '', roleId: '' });
    reset();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-[calc(100vh-120px)] flex flex-col justify-center animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-600 tracking-tight">Create Staff User</h1>
          <p className="text-gray-500  text-[13px] mt-1">Provision a new staff account and assign their system access level.</p>
        </div>
        <Link to="/users" className="btn-secondary">Cancel</Link>
      </div>

      <div className="card border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 font-medium flex items-center gap-3">
            <Info className="text-red-500 shrink-0" size={20} />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-4 mb-6">User Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name <span className="text-brand-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleChange} 
                  className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all text-zinc-900 placeholder-zinc-400 font-medium" 
                  placeholder="e.g., Jane Smith" 
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address <span className="text-brand-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="email" name="email" required value={formData.email} onChange={handleChange} 
                  className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all text-zinc-900 placeholder-zinc-400 font-medium" 
                  placeholder="jane.smith@smartloans.lk" 
                />
              </div>
            </div>

            {/* Assign Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Role <span className="text-brand-500">*</span></label>
              {isLoadingRoles ? (
                <div className="w-full h-[42px] bg-zinc-50 border border-zinc-200 rounded-xl animate-pulse" />
              ) : (
                <div className="w-full">
                  <SelectDropdown
                    value={formData.roleId}
                    onChange={handleRoleChange}
                    icon={Shield}
                    placeholder="Select a system role..."
                    options={roleOptions}
                    className="w-full !max-w-none"
                  />
                </div>
              )}
            </div>

            {/* Temporary Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Temporary Password <span className="text-brand-500">*</span></label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  type="text" name="password" required minLength={8} value={formData.password} onChange={handleChange} 
                  className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all text-zinc-900 placeholder-zinc-400 font-mono" 
                  placeholder="Min 8 characters" 
                />
              </div>
              <div className="flex items-start gap-1.5 mt-2.5 text-zinc-500">
                <Info size={14} className="mt-0.5 shrink-0" />
                <p className="text-xs font-medium leading-snug">The user will be securely prompted to change this password upon their first login.</p>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-zinc-100 flex justify-end">
            <button type="submit" disabled={isPending || !formData.roleId} className="btn-primary w-full md:w-auto min-w-[200px] shadow-md shadow-brand-500/20">
              {isPending ? 'Provisioning...' : 'Create Staff Account'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal Overlay */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 p-8 md:p-10 text-center max-w-xl w-full animate-scale-in">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-extrabold text-brand-600 mb-2 tracking-tight">User Created Successfully!</h2>
            <p className="text-gray-500 mb-8 text-lg">
              The account for <strong className="text-gray-900">{data?.user?.name}</strong> has been provisioned.
            </p>
            
            <div className="bg-[#f8f8f8] rounded-xl p-6 mb-8 text-left border border-zinc-200/60 shadow-inner">
              <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Share these credentials:</h3>
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                  <span className="text-zinc-500 flex items-center gap-2"><Mail size={14}/> Email (Login):</span>
                  <span className="font-bold text-brand-600 text-base">{data?.user?.email}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                  <span className="text-zinc-500 flex items-center gap-2"><Key size={14}/> Temp Password:</span>
                  <span className="font-bold text-gray-900 text-base bg-white px-2 py-1 rounded border shadow-sm">{formData.password}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 flex items-center gap-2"><Shield size={14}/> Assigned Role:</span>
                  <span className="font-medium text-gray-700 bg-white px-3 py-1 rounded-full border shadow-sm text-xs">{data?.user?.role?.name}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Link to="/users" className="btn-secondary px-8">Back to Users</Link>
              <button onClick={handleReset} className="btn-primary px-8">Create Another User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateUserPage;
