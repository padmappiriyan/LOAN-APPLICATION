import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Filter } from 'lucide-react';
import Button from '../../../components/ui/Button';
import SelectDropdown from '../../../components/ui/SelectDropdown';

const RoleFilterBar = ({ 
  search, 
  onSearchChange, 
  status, 
  onStatusChange, 
  dateRange, 
  onDateRangeChange,
  canCreate 
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full pb-12">
      {/* Search Input */}
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Search by role name or description..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-zinc-100/80 border-none rounded-xl focus:outline-none focus:bg-zinc-200/40 text-sm transition-all text-zinc-800 placeholder-zinc-400 font-medium"
        />
      </div>

      {/* Filters + Create Action */}
      <div className="flex flex-wrap md:flex-nowrap gap-3 items-center w-full md:w-auto justify-end">
        {/* Date Filter Dropdown */}
        <div className="flex-1 md:flex-none">
          <SelectDropdown
            value={dateRange}
            onChange={onDateRangeChange}
            icon={Calendar}
            placeholder="Date"
            options={[
              { value: 'Any Time', label: 'Date' },
              { value: 'Today', label: 'Today' },
              { value: 'Last 7 Days', label: 'Last 7 Days' },
              { value: 'Last 30 Days', label: 'Last 30 Days' }
            ]}
          />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex-1 md:flex-none">
          <SelectDropdown
            value={status}
            onChange={onStatusChange}
            icon={Filter}
            placeholder="Status"
            options={[
              { value: 'All Status', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
          />
        </div>

        {/* Create new role button */}
        {canCreate && (
          <Link to="/roles/create" className="shrink-0">
            <Button variant="primary">
              Create new role
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default RoleFilterBar;
