import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCreateCustomer from '../../hooks/customers/useCreateCustomer';
import SelectDropdown from '../../components/ui/SelectDropdown';
import { User, Phone, MapPin, CreditCard, Calendar, Info, CheckCircle2, Type, Users, Mail, MessageCircle } from 'lucide-react';

const CreateCustomerPage = () => {
  const navigate = useNavigate();
  const { mutate: createCustomer, isPending, error, isSuccess, data, reset } = useCreateCustomer();

  const [formData, setFormData] = useState({
    fullName: '',
    nic: '',
    dob: '',
    gender: 'Male',
    maritalStatus: 'Single',
    mobileNumber: '',
    whatsappNumber: '',
    emailAddress: '',
    currentAddress: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    createCustomer(formData);
  };

  const handleReset = () => {
    setFormData({
      fullName: '', nic: '', dob: '', gender: 'Male', maritalStatus: 'Single',
      mobileNumber: '', whatsappNumber: '', emailAddress: '', currentAddress: ''
    });
    reset();
  };

  const errorMessage = error?.response?.data?.message;

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-[calc(100vh-120px)] flex flex-col justify-center animate-fade-in pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-600 tracking-tight">Create Customer Profile</h1>
          <p className="text-gray-500 text-[13px] mt-1">Register a new borrower into the system before initiating a loan application.</p>
        </div>
        <Link to="/customers" className="btn-secondary">Cancel</Link>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-10 border border-zinc-100 shadow-[0_8px_40px_rgba(0,0,0,0.03)]">
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-800 font-medium flex items-center gap-3 shadow-inner">
            <Info className="text-red-500 shrink-0" size={20} />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* SECTION 1: Personal Details */}
          <div>
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-8">
              <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center shadow-sm">
                <User size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div>
                <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Full Legal Name <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-[15px] font-medium text-gray-900 placeholder-zinc-400 transition-all outline-none" placeholder="e.g., John Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">NIC Number <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                  <input type="text" name="nic" required value={formData.nic} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-[15px] font-medium text-gray-900 placeholder-zinc-400 transition-all outline-none font-mono" placeholder="National Identity Card" />
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Date of Birth <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-500 transition-colors z-10" size={18} />
                  <input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-[15px] font-medium text-gray-900 transition-all outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Gender <span className="text-red-500">*</span></label>
                  <SelectDropdown
                    value={formData.gender}
                    onChange={(val) => setFormData({ ...formData, gender: val })}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Other' },
                    ]}
                    icon={User}
                    className="w-full !rounded-2xl"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Marital Status <span className="text-red-500">*</span></label>
                  <SelectDropdown
                    value={formData.maritalStatus}
                    onChange={(val) => setFormData({ ...formData, maritalStatus: val })}
                    options={[
                      { value: 'Single', label: 'Single' },
                      { value: 'Married', label: 'Married' },
                      { value: 'Divorced', label: 'Divorced' },
                      { value: 'Widowed', label: 'Widowed' },
                    ]}
                    icon={Users}
                    className="w-full !rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Contact Details */}
          <div>
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-8">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                <Phone size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div>
                <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Mobile Number <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                  <input type="tel" name="mobileNumber" required value={formData.mobileNumber} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-[15px] font-medium text-gray-900 placeholder-zinc-400 transition-all outline-none font-mono" placeholder="07XXXXXXXX" />
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">WhatsApp Number</label>
                <div className="relative group">
                  <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-500 transition-colors" size={18} />
                  <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-green-500/10 focus:border-green-500 text-[15px] font-medium text-gray-900 placeholder-zinc-400 transition-all outline-none font-mono" placeholder="07XXXXXXXX" />
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                  <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-[15px] font-medium text-gray-900 placeholder-zinc-400 transition-all outline-none" placeholder="Optional" />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">Current Residential Address <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-4 text-zinc-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                  <textarea name="currentAddress" required rows={3} value={formData.currentAddress} onChange={handleChange} className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-[15px] font-medium text-gray-900 placeholder-zinc-400 transition-all outline-none resize-none leading-relaxed" placeholder="Enter the full street address..." />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-10 border-t border-zinc-100 flex justify-end">
            <button type="submit" disabled={isPending} className="btn-primary w-full md:w-auto min-w-[240px] shadow-lg shadow-brand-500/25 py-3.5 text-base rounded-2xl">
              {isPending ? 'Saving Customer Profile...' : 'Save Customer Profile'}
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
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Customer Registered!</h2>
            <p className="text-gray-500 mb-8 text-lg">
              The profile for <strong className="text-gray-900">{data?.customer?.fullName}</strong> has been saved.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link to="/customers" className="btn-secondary px-8">View All Customers</Link>
              {/* Note: Eventually this button could directly route to /loans/create?customerId=... */}
              <button onClick={handleReset} className="btn-primary px-8">Register Another Customer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCustomerPage;
