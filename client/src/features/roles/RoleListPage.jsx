import { useState, useEffect, useRef } from 'react';
import useGetRolesInfinite from '../../hooks/roles/useGetRolesInfinite';
import useUpdateRoleStatus from '../../hooks/roles/useUpdateRoleStatus';
import useDeleteRole from '../../hooks/roles/useDeleteRole';
import usePermission from '../../hooks/usePermission';
import { AlertTriangle, Power, Trash2 } from 'lucide-react';
import RoleFilterBar from './components/RoleFilterBar';
import RoleCard from './components/RoleCard';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

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
    isLoading
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
  const isDeleting = confirmModal.action === 'delete';

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

        {/* Extracted Filter & Action Bar */}
        <RoleFilterBar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          canCreate={canCreate}
        />

        {/* Scrollable Container */}
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
                <RoleCard
                  key={role._id}
                  role={role}
                  activeMenuId={activeMenuId}
                  onToggleMenu={handleToggleMenu}
                  onAction={handleAction}
                  canUpdate={canUpdate}
                  canDelete={canDelete}
                />
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

      {/* Extracted Generic Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, action: null, role: null })}
        onConfirm={executeConfirmedAction}
        title={isDeleting ? 'Delete Role' : `${confirmModal.role?.isActive ? 'Deactivate' : 'Activate'} Role`}
        message={isDeleting 
          ? `Are you sure you want to delete the role "${confirmModal.role?.name}"? This action cannot be undone.`
          : `Are you sure you want to ${confirmModal.role?.isActive ? 'deactivate' : 'activate'} the role "${confirmModal.role?.name}"?`
        }
        icon={isDeleting ? Trash2 : Power}
        confirmText="Confirm"
        confirmVariant={isDeleting ? 'danger' : 'primary'}
      />

    </div>
  );
};

export default RoleListPage;
