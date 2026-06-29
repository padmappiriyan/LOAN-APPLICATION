import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Pencil, Power, Trash2, ArrowRight } from 'lucide-react';

const RoleCard = ({ 
  role, 
  activeMenuId, 
  onToggleMenu, 
  onAction,
  canUpdate,
  canDelete 
}) => {
  return (
    <div className="bg-[#f8f8f8] border border-zinc-200/50 rounded-2xl p-5 flex flex-col justify-between h-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group">
      
      {/* Top Header Section */}
      <div>
        <div className="flex justify-between items-start">
          <div className="pr-4">
            <h2 className="text-xl font-medium text-blue-500 tracking-tight leading-tight mb-1 group-hover:text-brand-600 transition-colors">
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
                  onClick={(e) => onToggleMenu(e, role._id)}
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
                          onClick={(e) => onAction(e, 'toggle-status', role)}
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
                        onClick={(e) => onAction(e, 'delete', role)}
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
        <p className="text-zinc-500 mt-4 text-[11px]  leading-relaxed line-clamp-3">
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
  );
};

export default RoleCard;
