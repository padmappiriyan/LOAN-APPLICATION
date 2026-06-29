import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useGetRolesInfinite from '../../hooks/roles/useGetRolesInfinite';
import useUpdateRoleStatus from '../../hooks/roles/useUpdateRoleStatus';
import useDeleteRole from '../../hooks/roles/useDeleteRole';
import usePermission from '../../hooks/usePermission';
import { 
  Landmark, MoreVertical, Search, Calendar, Filter, Plus, 
  Pencil, Power, Trash2, ArrowRight, AlertTriangle, ChevronDown 
} from 'lucide-react';

const RoleListPage = () => {
  const canCreate = usePermission('role:create');
  const canUpdate = usePermission('role:update');
  const canDelete = usePermission('role:delete');

  const { mutate: updateStatus } = useUpdateRoleStatus();
  const { mutate: deleteRole } = useDeleteRole();

  // Filter States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [dateRange, setDateRange] = useState('Any Time');
  
  // UI states
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, action: null, role: null });

  // Debounced Search state for API
  const [apiSearch, setApiSearch] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => setApiSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Convert date range selection into ISO strings for backend
  const getBackendFilters = () => {
    const filters = {};
    if (apiSearch) filters.search = apiSearch;
    if (status !== 'All Status') filters.status = status;

    if (dateRange !== 'Any Time') {
      const now = new Date();
      let start = new Date();
      if (dateRange === 'Today') {
        start.setHours(0,0,0,0);
      } else if (dateRange === 'Last 7 Days') {
        start.setDate(now.getDate() - 7);
      } else if (dateRange === 'Last 30 Days') {
        start.setDate(now.getDate() - 30);
      }
      filters.startDate = start.toISOString();
      filters.endDate = now.toISOString();
    }
    return filters;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useGetRolesInfinite(getBackendFilters());

  // Infinite Scroll Observer
  const observerTarget = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Close menus on click outside
  useEffect(() => {
    const closeMenu = () => setActiveMenuId(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleToggleMenu = (e, roleId) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === roleId ? null : roleId);
  };

  const handleAction = (e, actionType, role) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setConfirmModal({ show: true, action: actionType, role });
  };

  const executeConfirmedAction = () => {
    const { action, role } = confirmModal;
    if (action === 'toggle-status') {
      updateStatus({ id: role._id, isActive: !role.isActive });
    } else if (action === 'delete') {
      deleteRole(role._id);
    }
    setConfirmModal({ show: false, action: null, role: null });
  };



  const allRoles = data?.pages?.flatMap(page => page.roles) || [];

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col relative overflow-hidden pb-12">
      
     

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full z-10 space-y-6">
        
        {/* Header Bar */}
        <div className="mb-2">
          <h1 className="text-3xl font-extrabold text-brand-600 tracking-tight">Role Management</h1>
          <p className="text-zinc-500 mt-1 text-sm sm:text-base">
            Manage user roles, define access boundaries, and enforce security policies.
          </p>
        </div>

        {/* Filter & Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full pb-12">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search by role name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-100/80 border-none rounded-xl focus:outline-none focus:bg-zinc-200/40 text-sm transition-all text-zinc-800 placeholder-zinc-400 font-medium"
            />
          </div>

          {/* Filters + Create Action */}
          <div className="flex flex-wrap md:flex-nowrap gap-3 items-center w-full md:w-auto justify-end">
            {/* Date Filter Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full md:w-32 pl-9 pr-8 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-700 focus:outline-none appearance-none cursor-pointer hover:bg-zinc-50 transition-colors"
              >
                <option value="Any Time">Date</option>
                <option value="Today">Today</option>
                <option value="Last 7 Days">7 Days</option>
                <option value="Last 30 Days">30 Days</option>
              </select>
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={15} />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={15} />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full md:w-32 pl-9 pr-8 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-700 focus:outline-none appearance-none cursor-pointer hover:bg-zinc-50 transition-colors"
              >
                <option value="All Status">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={15} />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={15} />
            </div>

            {/* Create new role button */}
            {canCreate && (
              <Link to="/roles/create" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2 px-5 rounded-xl shadow-md shadow-brand-600/10 transition-colors shrink-0 text-sm">
                <span>Create new role</span>
              </Link>
            )}
          </div>
        </div>

        {/* Scrollable Container (No visible scrollbar) */}
        <div className="no-scrollbar max-h-[75vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : allRoles.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center shadow-sm">
              <AlertTriangle className="mx-auto text-zinc-400 mb-4" size={40} />
              <h3 className="text-lg font-bold text-zinc-950">No roles found</h3>
              <p className="text-zinc-500 mt-1">Try tweaking your search term or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
              {allRoles.map((role) => (
                <div 
                  key={role._id} 
                  className="bg-[#f8f8f8] border border-zinc-200/50 rounded-2xl p-6 flex flex-col justify-between h-56 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group"
                >
                  
                  {/* Top Header Section */}
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="pr-4">
                        <h2 className="text-xl font-bold text-zinc-950 tracking-tight leading-tight mb-1 group-hover:text-brand-600 transition-colors">
                          {role.name}
                        </h2>
                        <span className="text-xs text-zinc-400 font-semibold block">
                          {new Date(role.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0 relative">
                        {/* Status Capsule */}
                        {role.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                            Deactivated
                          </span>
                        )}

                        {/* Three-Dot Actions Dropdown */}
                        {!role.isDefault && (
                          <div className="relative">
                            <button 
                              onClick={(e) => handleToggleMenu(e, role._id)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>

                            {activeMenuId === role._id && (
                              <div className="absolute right-0 mt-1 w-44 bg-white border border-zinc-200 rounded-xl shadow-xl z-30 py-1.5 animate-slide-up text-left">
                                {canUpdate && (
                                  <>
                                    <Link to={`/roles/edit/${role._id}`} className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 font-medium">
                                      <Pencil size={14} className="text-zinc-400" />
                                      <span>Edit Role</span>
                                    </Link>
                                    <button 
                                      onClick={(e) => handleAction(e, 'toggle-status', role)}
                                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 font-medium text-left"
                                    >
                                      <Power size={14} className="text-zinc-400" />
                                      <span>{role.isActive ? 'Deactivate' : 'Activate'}</span>
                                    </button>
                                  </>
                                )}
                                {canDelete && (
                                  <button 
                                    disabled={role.isActive}
                                    onClick={(e) => handleAction(e, 'delete', role)}
                                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-left border-t border-zinc-100 ${
                                      role.isActive 
                                        ? 'text-zinc-300 cursor-not-allowed' 
                                        : 'text-red-600 hover:bg-red-50/50'
                                    }`}
                                    title={role.isActive ? "Deactivate role before deleting" : ""}
                                  >
                                    <Trash2 size={14} className={role.isActive ? 'text-zinc-200' : 'text-red-500'} />
                                    <span>Delete Role</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-500 mt-4 text-sm leading-relaxed line-clamp-3">
                      {role.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Card Footer Section */}
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-4">
                    <div className="flex items-center gap-2">
                      {/* Stacked Mock Avatars */}
                      {role.userCount > 0 ? (
                        <div className="flex -space-x-2.5 overflow-hidden">
                          {Array.from({ length: Math.min(role.userCount, 3) }).map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white text-zinc-600 ${
                                i === 0 ? 'bg-zinc-200' : i === 1 ? 'bg-zinc-300' : 'bg-zinc-400 text-white'
                              }`}
                            >
                              {(i + 1) * 3}
                            </div>
                          ))}
                          {role.userCount > 3 && (
                            <div className="w-7 h-7 rounded-full bg-zinc-800 text-white border-2 border-white flex items-center justify-center text-[8px] font-bold">
                              +{role.userCount - 3}
                            </div>
                          )}
                        </div>
                      ) : null}

                      <span className="text-xs font-semibold text-zinc-500 tracking-tight">
                        {role.userCount > 0 ? `${role.userCount} users assigned` : 'No users assigned'}
                      </span>
                    </div>

                    {/* View Details Link */}
                    <Link 
                      to={`/roles/view/${role._id}`} 
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                    >
                      <span>View role</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Loader for scrolling pagination */}
          <div ref={observerTarget} className="h-10 flex items-center justify-center mt-6">
            {isFetchingNextPage && (
              <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </div>

      </main>

      {/* ── CONFIRMATION MODAL ── */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 text-center animate-slide-up">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-xl ${
              confirmModal.action === 'delete' ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-700'
            }`}>
              {confirmModal.action === 'delete' ? <Trash2 size={24} /> : <Power size={24} />}
            </div>
            
            <h3 className="text-lg font-bold text-zinc-950">
              {confirmModal.action === 'delete' ? 'Delete Role' : `${confirmModal.role.isActive ? 'Deactivate' : 'Activate'} Role`}
            </h3>
            
            <p className="text-zinc-500 mt-2 text-sm leading-relaxed">
              {confirmModal.action === 'delete' ? (
                `Are you sure you want to delete the role "${confirmModal.role.name}"? This action cannot be undone.`
              ) : (
                `Are you sure you want to ${confirmModal.role.isActive ? 'deactivate' : 'activate'} the role "${confirmModal.role.name}"?`
              )}
            </p>

            <div className="flex gap-3 justify-end mt-6">
              <button 
                onClick={() => setConfirmModal({ show: false, action: null, role: null })}
                className="px-4 py-2 border border-zinc-200 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeConfirmedAction}
                className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-md transition-colors ${
                  confirmModal.action === 'delete' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/10' : 'bg-zinc-950 hover:bg-zinc-900'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RoleListPage;
