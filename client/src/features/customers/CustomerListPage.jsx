import { useState } from 'react';
import { Link } from 'react-router-dom';
import useGetCustomers from '../../hooks/customers/useGetCustomers';
import { Search, Filter, Plus, ChevronLeft, ChevronRight, User } from 'lucide-react';

const CustomerListPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading, isError } = useGetCustomers({ page, limit: 15, search, status });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Profiles</h1>
          <p className="text-gray-500 text-sm mt-1">Manage borrower profiles and view their histories.</p>
        </div>
        <Link to="/customers/create" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add New Customer
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-200 mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, NIC, or phone..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium"
          />
        </form>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <select 
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="pl-10 pr-8 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm font-medium appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200">
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Contact</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Assigned To</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Registered</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
                      Loading customers...
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-red-500">Failed to load customers.</td>
                </tr>
              ) : data?.customers?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-16 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center">
                      <User size={48} className="text-zinc-200 mb-4" />
                      <p className="text-lg font-medium text-zinc-900 mb-1">No customers found</p>
                      <p className="text-sm">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.customers?.map(customer => (
                  <tr key={customer._id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{customer.fullName}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">NIC: {customer.nic}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-700">{customer.mobileNumber}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{customer.currentAddress?.substring(0, 30)}...</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${customer.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                          customer.status === 'Inactive' ? 'bg-zinc-100 text-zinc-700 border-zinc-200' : 
                          'bg-red-50 text-red-700 border-red-200'}`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-700">{customer.assignedOfficer?.name || 'Unassigned'}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      {/* For now, just a placeholder edit button */}
                      <button className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="bg-zinc-50 border-t border-zinc-200 p-4 flex items-center justify-between">
            <span className="text-sm text-zinc-500">
              Showing page <span className="font-medium text-zinc-900">{data.pagination.currentPage}</span> of <span className="font-medium text-zinc-900">{data.pagination.totalPages}</span>
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="p-2 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerListPage;
