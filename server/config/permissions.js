// ─────────────────────────────────────────────────────────────────────────────
// PERMISSIONS — Single source of truth for all permission keys in the system.
// These keys are stored in Role.permissions[] array in MongoDB.
// Used by: checkPermission middleware (backend) and permissions.js (frontend).
// ─────────────────────────────────────────────────────────────────────────────

export const PERMISSIONS = {
  // ── User Management ────────────────────────────────────────
  USER_CREATE:    'user:create',
  USER_READ:      'user:read',
  USER_UPDATE:    'user:update',
  USER_DISABLE:   'user:disable',

  // ── Role Management ────────────────────────────────────────
  ROLE_CREATE:    'role:create',
  ROLE_READ:      'role:read',
  ROLE_UPDATE:    'role:update',
  ROLE_DELETE:    'role:delete',

  // ── Loan Applications ──────────────────────────────────────
  LOAN_CREATE:    'loan:create',
  LOAN_READ_ALL:  'loan:read_all',
  LOAN_READ_OWN:  'loan:read_own',
  LOAN_UPDATE:    'loan:update',
  LOAN_REVIEW:    'loan:review',
  LOAN_APPROVE:   'loan:approve',
  LOAN_DISBURSE:  'loan:disburse',

  // ── Payments & Collections ─────────────────────────────────
  PAYMENT_CREATE:    'payment:create',
  PAYMENT_READ_ALL:  'payment:read_all',
  PAYMENT_READ_OWN:  'payment:read_own',
  PAYMENT_VERIFY:    'payment:verify',

  // ── Capital / Income / Expenses ────────────────────────────
  CAPITAL_READ:   'capital:read',
  CAPITAL_WRITE:  'capital:write',
  EXPENSE_READ:   'expense:read',
  EXPENSE_WRITE:  'expense:write',

  // ── Reports & Exports ──────────────────────────────────────
  REPORT_VIEW:    'report:view',
  REPORT_EXPORT:  'report:export',

  // ── Staff & Salary ─────────────────────────────────────────
  SALARY_READ:    'salary:read',
  SALARY_WRITE:   'salary:write',
  BONUS_WRITE:    'bonus:write',

  // ── System & Audit ─────────────────────────────────────────
  AUDIT_LOG_READ:    'audit:read',
  SYSTEM_SETTINGS:   'system:settings',
  KPI_VIEW:          'kpi:view',
};

// All permission keys as a flat array (used for Super Admin role)
export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

// Default permissions per role (used in seeder)
export const DEFAULT_ROLE_PERMISSIONS = {
  manager: [
    'loan:read_all', 'loan:review', 'loan:approve',
    'payment:read_all', 'payment:verify',
    'report:view', 'report:export',
    'user:read',
  ],
  field_officer: [
    'loan:create', 'loan:read_own', 'loan:update',
    'payment:create', 'payment:read_own',
  ],
  accountant: [
    'capital:read', 'capital:write',
    'expense:read', 'expense:write',
    'salary:read', 'salary:write', 'bonus:write',
    'report:view', 'report:export',
  ],
};

// Permission groups for the frontend Role Creation UI
export const PERMISSION_GROUPS = [
  {
    group: 'User Management',
    icon: 'users',
    permissions: [
      { key: 'user:create',  label: 'Create Users' },
      { key: 'user:read',    label: 'View Users' },
      { key: 'user:update',  label: 'Edit Users' },
      { key: 'user:disable', label: 'Disable Users' },
    ],
  },
  {
    group: 'Role Management',
    icon: 'shield',
    permissions: [
      { key: 'role:create', label: 'Create Roles' },
      { key: 'role:read',   label: 'View Roles' },
      { key: 'role:update', label: 'Edit Roles' },
      { key: 'role:delete', label: 'Delete Roles' },
    ],
  },
  {
    group: 'Loan Applications',
    icon: 'file-text',
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
    icon: 'credit-card',
    permissions: [
      { key: 'payment:create',   label: 'Record Payments' },
      { key: 'payment:read_all', label: 'View All Payments' },
      { key: 'payment:read_own', label: 'View Own Collections' },
      { key: 'payment:verify',   label: 'Verify Payments' },
    ],
  },
  {
    group: 'Capital / Income / Expenses',
    icon: 'trending-up',
    permissions: [
      { key: 'capital:read',  label: 'View Capital' },
      { key: 'capital:write', label: 'Manage Capital' },
      { key: 'expense:read',  label: 'View Expenses' },
      { key: 'expense:write', label: 'Manage Expenses' },
    ],
  },
  {
    group: 'Reports & Exports',
    icon: 'bar-chart',
    permissions: [
      { key: 'report:view',   label: 'View Reports' },
      { key: 'report:export', label: 'Export Reports (Excel/PDF/CSV)' },
    ],
  },
  {
    group: 'Staff & Salary',
    icon: 'dollar-sign',
    permissions: [
      { key: 'salary:read',  label: 'View Salaries' },
      { key: 'salary:write', label: 'Manage Salaries' },
      { key: 'bonus:write',  label: 'Manage Bonuses' },
    ],
  },
  {
    group: 'System & Audit',
    icon: 'settings',
    permissions: [
      { key: 'audit:read',      label: 'View Audit Logs' },
      { key: 'system:settings', label: 'System Settings' },
      { key: 'kpi:view',        label: 'View KPI Dashboard' },
    ],
  },
];
