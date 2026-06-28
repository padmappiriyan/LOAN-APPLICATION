// ─────────────────────────────────────────────────────────────────────────────
// PERMISSIONS — Frontend mirror of server/config/permissions.js
// Use these constants in: usePermission(), RequireAuth, route guards, UI checks
// ─────────────────────────────────────────────────────────────────────────────

export const PERMISSIONS = {
  USER_CREATE:    'user:create',
  USER_READ:      'user:read',
  USER_UPDATE:    'user:update',
  USER_DISABLE:   'user:disable',

  ROLE_CREATE:    'role:create',
  ROLE_READ:      'role:read',
  ROLE_UPDATE:    'role:update',
  ROLE_DELETE:    'role:delete',

  LOAN_CREATE:    'loan:create',
  LOAN_READ_ALL:  'loan:read_all',
  LOAN_READ_OWN:  'loan:read_own',
  LOAN_UPDATE:    'loan:update',
  LOAN_REVIEW:    'loan:review',
  LOAN_APPROVE:   'loan:approve',
  LOAN_DISBURSE:  'loan:disburse',

  PAYMENT_CREATE:    'payment:create',
  PAYMENT_READ_ALL:  'payment:read_all',
  PAYMENT_READ_OWN:  'payment:read_own',
  PAYMENT_VERIFY:    'payment:verify',

  CAPITAL_READ:   'capital:read',
  CAPITAL_WRITE:  'capital:write',
  EXPENSE_READ:   'expense:read',
  EXPENSE_WRITE:  'expense:write',

  REPORT_VIEW:    'report:view',
  REPORT_EXPORT:  'report:export',

  SALARY_READ:    'salary:read',
  SALARY_WRITE:   'salary:write',
  BONUS_WRITE:    'bonus:write',

  AUDIT_LOG_READ:  'audit:read',
  SYSTEM_SETTINGS: 'system:settings',
  KPI_VIEW:        'kpi:view',
};

// Permission groups for the Role Creation UI (Super Admin permission picker)
export const PERMISSION_GROUPS = [
  {
    group: 'User Management',
    permissions: [
      { key: 'user:create',  label: 'Create Users' },
      { key: 'user:read',    label: 'View Users' },
      { key: 'user:update',  label: 'Edit Users' },
      { key: 'user:disable', label: 'Disable / Enable Users' },
    ],
  },
  {
    group: 'Role Management',
    permissions: [
      { key: 'role:create', label: 'Create Roles' },
      { key: 'role:read',   label: 'View Roles' },
      { key: 'role:update', label: 'Edit Roles' },
      { key: 'role:delete', label: 'Delete Roles' },
    ],
  },
  {
    group: 'Loan Applications',
    permissions: [
      { key: 'loan:create',   label: 'Create Applications' },
      { key: 'loan:read_all', label: 'View All Loans' },
      { key: 'loan:read_own', label: 'View Own Loans' },
      { key: 'loan:update',   label: 'Edit Applications' },
      { key: 'loan:review',   label: 'Review & Recommend' },
      { key: 'loan:approve',  label: 'Approve Loans' },
      { key: 'loan:disburse', label: 'Disburse Loans' },
    ],
  },
  {
    group: 'Payments & Collections',
    permissions: [
      { key: 'payment:create',   label: 'Record Payments' },
      { key: 'payment:read_all', label: 'View All Payments' },
      { key: 'payment:read_own', label: 'View Own Collections' },
      { key: 'payment:verify',   label: 'Verify Payments' },
    ],
  },
  {
    group: 'Capital / Income / Expenses',
    permissions: [
      { key: 'capital:read',  label: 'View Capital' },
      { key: 'capital:write', label: 'Manage Capital' },
      { key: 'expense:read',  label: 'View Expenses' },
      { key: 'expense:write', label: 'Manage Expenses' },
    ],
  },
  {
    group: 'Reports & Exports',
    permissions: [
      { key: 'report:view',   label: 'View Reports' },
      { key: 'report:export', label: 'Export (Excel / PDF / CSV)' },
    ],
  },
  {
    group: 'Staff & Salary',
    permissions: [
      { key: 'salary:read',  label: 'View Salaries' },
      { key: 'salary:write', label: 'Manage Salaries' },
      { key: 'bonus:write',  label: 'Manage Bonuses' },
    ],
  },
  {
    group: 'System & Audit',
    permissions: [
      { key: 'audit:read',      label: 'View Audit Logs' },
      { key: 'system:settings', label: 'System Settings' },
      { key: 'kpi:view',        label: 'View KPI Dashboard' },
    ],
  },
];
