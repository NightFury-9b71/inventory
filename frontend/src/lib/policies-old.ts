import { UserRole as Role } from "@/services/auth_service";

export type { Role };

/**
 * ============================================================================
 * INVENTORY MANAGEMENT SYSTEM - ACCESS CONTROL POLICIES
 * ============================================================================
 * 
 * Role Hierarchy:
 * ---------------
 * 1. SUPER_ADMIN: Full system access across all offices and data
 * 2. ADMIN: Administrative access with management privileges
 * 3. PROCUREMENT_MANAGER: Purchasing and inventory management access
 * 4. DEPARTMENT_HEAD: Department-level management with purchasing power
 * 5. FACULTY_MEMBER: Faculty-level access with basic permissions
 * 6. STAFF: Operational staff with office-specific access
 * 7. STUDENT: Limited read-only access for students
 * 8. VIEWER: Read-only access for viewers
 * 9. USER: Basic user with limited access
 * 
 * Office-Based Access Control:
 * ---------------------------
 * - Users are assigned to specific offices through designations
 * - Users can only perform operations on data related to their assigned office
 * - SUPER_ADMIN and ADMIN can access all offices
 * - Other roles are restricted to their designated office/department
 * 
 * Permission Actions:
 * ------------------
 * - view: Read access to resources
 * - create: Create new resources
 * - edit: Modify existing resources
 * - delete: Remove resources
 * - approve: Approve requests/transactions
 * - export: Export data to files
 * - import: Import data from files
 * 
 * Purchasing Power:
 * ----------------
 * Roles with purchasing_power = true can:
 * - Create purchase orders
 * - Approve purchases
 * - Manage procurement activities
 */

type Policy = {
  [page: string]: { actions: string[] };
};

export const policies: Record<Role, Policy> = {
  /**
   * SUPER_ADMIN - Full System Access
   * Can access and manage all features across all offices
   */
  SUPER_ADMIN: {
    "*": { actions: ["*"] },
  },

  /**
   * ADMIN - Administrative Management
   * Full access to manage system, users, and data
   */
  ADMIN: {
    "*": { actions: ["*"] },
  },

  /**
   * PROCUREMENT_MANAGER - Procurement & Inventory Management
   * Can manage purchases, items, and distributions with full CRUD access
   */
  PROCUREMENT_MANAGER: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view", "edit"] },
    "/categories": { actions: ["view", "create", "edit", "delete"] },
    "/units": { actions: ["view", "create", "edit", "delete"] },
    "/items": { actions: ["view", "create", "edit", "delete", "export", "import"] },
    "/barcode": { actions: ["view", "create", "edit"] },
    "/purchases": { actions: ["view", "create", "edit", "delete", "approve", "export"] },
    "/distributions": { actions: ["view", "create", "edit", "delete", "approve", "export"] },
    "/movements": { actions: ["view", "create", "edit", "export"] },
    "/reports": { actions: ["view", "export"] },
    "/analytics": { actions: ["view", "export"] },
    "/logs": { actions: ["view", "export"] },
    "/settings": { actions: ["view", "edit"] },
  },

  /**
   * DEPARTMENT_HEAD - Department Management
   * Full access to manage department resources with purchasing power
   */
  DEPARTMENT_HEAD: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/categories": { actions: ["view", "create", "edit"] },
    "/units": { actions: ["view", "create", "edit"] },
    "/items": { actions: ["view", "create", "edit", "delete", "export"] },
    "/barcode": { actions: ["view", "create"] },
    "/purchases": { actions: ["view", "create", "edit", "approve", "export"] },
    "/distributions": { actions: ["view", "create", "edit", "approve", "export"] },
    "/movements": { actions: ["view", "create", "edit"] },
    "/reports": { actions: ["view", "export"] },
    "/analytics": { actions: ["view"] },
    "/logs": { actions: ["view"] },
    "/settings": { actions: ["view"] },
  },

  /**
   * FACULTY_MEMBER - Faculty Access
   * Can view inventory and request distributions, but cannot make purchases
   */
  FACULTY_MEMBER: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/categories": { actions: ["view"] },
    "/units": { actions: ["view"] },
    "/items": { actions: ["view"] },
    "/barcode": { actions: ["view"] },
    "/purchases": { actions: ["view"] },
    "/distributions": { actions: ["view", "create"] },
    "/movements": { actions: ["view"] },
    "/reports": { actions: ["view", "export"] },
    "/analytics": { actions: ["view"] },
  },

  /**
   * STAFF - Operational Staff
   * Can manage day-to-day operations within their office
   */
  STAFF: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/categories": { actions: ["view"] },
    "/units": { actions: ["view"] },
    "/items": { actions: ["view", "edit", "export"] },
    "/barcode": { actions: ["view", "create"] },
    "/purchases": { actions: ["view"] },
    "/distributions": { actions: ["view", "create", "edit"] },
    "/movements": { actions: ["view", "create"] },
    "/reports": { actions: ["view"] },
  },

  /**
   * STUDENT - Student Access
   * Limited read-only access to department resources
   */
  STUDENT: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/items": { actions: ["view"] },
    "/reports": { actions: ["view"] },
  },

  /**
   * VIEWER - Read-Only Access
   * Can view data but cannot make any changes
   */
  VIEWER: {
    "/profile": { actions: ["view"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/categories": { actions: ["view"] },
    "/units": { actions: ["view"] },
    "/items": { actions: ["view"] },
    "/purchases": { actions: ["view"] },
    "/distributions": { actions: ["view"] },
    "/movements": { actions: ["view"] },
    "/reports": { actions: ["view"] },
    "/analytics": { actions: ["view"] },
  },

  /**
   * USER - Basic User Access
   * Minimal access for regular users
   */
  USER: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/items": { actions: ["view"] },
    "/reports": { actions: ["view"] },
  },

  /**
   * FACULTY_ADMIN - Faculty Administration
   * Administrative access at faculty level
   */
  FACULTY_ADMIN: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view", "edit", "create"] },
    "/categories": { actions: ["view", "create", "edit", "delete"] },
    "/units": { actions: ["view", "create", "edit", "delete"] },
    "/items": { actions: ["view", "create", "edit", "delete", "export"] },
    "/barcode": { actions: ["view", "create", "edit"] },
    "/purchases": { actions: ["view", "create", "edit", "approve", "export"] },
    "/distributions": { actions: ["view", "create", "edit", "approve", "export"] },
    "/movements": { actions: ["view", "create", "edit"] },
    "/reports": { actions: ["view", "export"] },
    "/analytics": { actions: ["view"] },
    "/logs": { actions: ["view"] },
    "/settings": { actions: ["view", "edit"] },
  },

  /**
   * DEPARTMENT_ADMIN - Department Administration
   * Administrative access at department level
   */
  DEPARTMENT_ADMIN: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view", "edit"] },
    "/categories": { actions: ["view", "create", "edit", "delete"] },
    "/units": { actions: ["view", "create", "edit"] },
    "/items": { actions: ["view", "create", "edit", "delete", "export"] },
    "/barcode": { actions: ["view", "create"] },
    "/purchases": { actions: ["view", "create", "edit", "approve", "export"] },
    "/distributions": { actions: ["view", "create", "edit", "approve", "export"] },
    "/movements": { actions: ["view", "create", "edit"] },
    "/reports": { actions: ["view", "export"] },
    "/analytics": { actions: ["view"] },
    "/logs": { actions: ["view"] },
  },

  /**
   * OFFICE_MANAGER - Office Management
   * Can manage office operations and inventory
   */
  OFFICE_MANAGER: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/categories": { actions: ["view", "create", "edit"] },
    "/units": { actions: ["view", "create", "edit"] },
    "/items": { actions: ["view", "create", "edit", "export"] },
    "/barcode": { actions: ["view", "create"] },
    "/purchases": { actions: ["view", "create", "edit", "export"] },
    "/distributions": { actions: ["view", "create", "edit", "export"] },
    "/movements": { actions: ["view", "create", "edit"] },
    "/reports": { actions: ["view", "export"] },
    "/analytics": { actions: ["view"] },
  },

  /**
   * GUEST - Unauthenticated User
   * Can only access login page
   */
  GUEST: {
    "/login": { actions: ["view"] },
  },
};

// ============================================================================
// PERMISSION CHECKING UTILITIES
// ============================================================================

/**
 * Check if user can access a specific route
 * @param role - The user's role
 * @param path - The route path to check
 * @returns true if access is allowed
 */
export const canAccessRoute = (role: Role, path: string): boolean => {
  const rolePolicy = policies[role];
  if (!rolePolicy) return false;

  // Full access for super admin and admin
  if (rolePolicy["*"]?.actions.includes("*")) return true;

  // Check if route exists in role's policy
  return Object.keys(rolePolicy).some((page) => path.startsWith(page));
};

/**
 * Check if user can perform a specific action on a page
 * @param role - The user's role
 * @param page - The page/route being accessed
 * @param action - The action to perform (view, create, edit, delete, etc.)
 * @returns true if action is allowed
 */
export const canPerformAction = (
  role: Role,
  page: string,
  action: string
): boolean => {
  const rolePolicy = policies[role];
  if (!rolePolicy) return false;

  // Full access for super admin and admin
  if (rolePolicy["*"]?.actions.includes("*")) return true;

  const pagePolicy = rolePolicy[page];
  if (!pagePolicy) return false;

  const allowedActions = pagePolicy.actions;
  return allowedActions.includes(action) || allowedActions.includes("*");
};

// ============================================================================
// OFFICE-BASED ACCESS CONTROL
// ============================================================================

/**
 * Check if user can access office-specific data
 * Users can only access data from their assigned office unless they are SUPER_ADMIN or ADMIN
 * 
 * @param userRole - The user's role
 * @param userOfficeId - The user's assigned office ID
 * @param targetOfficeId - The office ID of the data being accessed
 * @param action - The action being performed (view, edit, create, delete)
 * @returns true if access is allowed
 */
export const canAccessOfficeData = (
  userRole: Role,
  userOfficeId: number | null,
  targetOfficeId: number | null,
  action: string = "view"
): boolean => {
  // SUPER_ADMIN and ADMIN can access all offices
  if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
    return true;
  }

  // If no target office specified, allow access based on role permissions
  if (!targetOfficeId) {
    return canPerformAction(userRole, "/dashboard", action);
  }

  // Users can only access their own office's data
  if (userOfficeId === targetOfficeId) {
    return canPerformAction(userRole, "/offices", action);
  }

  return false;
};

/**
 * Check if user can manage items in a specific office
 * 
 * @param userRole - The user's role
 * @param userOfficeId - The user's assigned office ID
 * @param targetOfficeId - The office ID where items are managed
 * @param action - The action (view, create, edit, delete)
 * @returns true if access is allowed
 */
export const canManageOfficeItems = (
  userRole: Role,
  userOfficeId: number | null,
  targetOfficeId: number | null,
  action: string = "view"
): boolean => {
  // SUPER_ADMIN and ADMIN can manage all items
  if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
    return true;
  }

  // Users can only manage items in their own office
  if (userOfficeId === targetOfficeId) {
    return canPerformAction(userRole, "/items", action);
  }

  return false;
};

/**
 * Check if user can manage purchases for a specific office
 * Only roles with purchasing power can create/approve purchases
 * 
 * @param userRole - The user's role
 * @param userOfficeId - The user's assigned office ID
 * @param targetOfficeId - The office ID for purchases
 * @param action - The action (view, create, edit, delete, approve)
 * @returns true if access is allowed
 */
export const canManageOfficePurchases = (
  userRole: Role,
  userOfficeId: number | null,
  targetOfficeId: number | null,
  action: string = "view"
): boolean => {
  // SUPER_ADMIN and ADMIN can manage all purchases
  if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
    return true;
  }

  // Check if user has purchasing power for certain actions
  const purchasingRoles: Role[] = [
    "PROCUREMENT_MANAGER" as Role,
    "DEPARTMENT_HEAD" as Role,
    "FACULTY_ADMIN" as Role,
    "DEPARTMENT_ADMIN" as Role,
  ];

  const requiresPurchasingPower = ["create", "approve", "delete"].includes(action);
  
  if (requiresPurchasingPower && !purchasingRoles.includes(userRole)) {
    return false;
  }

  // Users can manage purchases for their own office
  if (userOfficeId === targetOfficeId) {
    return canPerformAction(userRole, "/purchases", action);
  }

  return false;
};

/**
 * Check if user can manage distributions for a specific office
 * 
 * @param userRole - The user's role
 * @param userOfficeId - The user's assigned office ID
 * @param targetOfficeId - The office ID for distributions
 * @param action - The action (view, create, edit, delete, approve)
 * @returns true if access is allowed
 */
export const canManageOfficeDistributions = (
  userRole: Role,
  userOfficeId: number | null,
  targetOfficeId: number | null,
  action: string = "view"
): boolean => {
  // SUPER_ADMIN and ADMIN can manage all distributions
  if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
    return true;
  }

  // Users can manage distributions for their own office
  if (userOfficeId === targetOfficeId) {
    return canPerformAction(userRole, "/distributions", action);
  }

  return false;
};

/**
 * Check if user can manage item movements
 * 
 * @param userRole - The user's role
 * @param userOfficeId - The user's assigned office ID
 * @param fromOfficeId - The source office ID
 * @param toOfficeId - The destination office ID
 * @param action - The action (view, create, edit)
 * @returns true if access is allowed
 */
export const canManageMovements = (
  userRole: Role,
  userOfficeId: number | null,
  fromOfficeId: number | null,
  toOfficeId: number | null,
  action: string = "view"
): boolean => {
  // SUPER_ADMIN and ADMIN can manage all movements
  if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
    return true;
  }

  // User must be from either source or destination office
  const isInvolvedOffice = 
    userOfficeId === fromOfficeId || userOfficeId === toOfficeId;

  if (isInvolvedOffice) {
    return canPerformAction(userRole, "/movements", action);
  }

  return false;
};

/**
 * Check if user has purchasing power
 * 
 * @param userRole - The user's role
 * @returns true if role has purchasing power
 */
export const hasPurchasingPower = (userRole: Role): boolean => {
  const purchasingRoles: Role[] = [
    "SUPER_ADMIN" as Role,
    "ADMIN" as Role,
    "PROCUREMENT_MANAGER" as Role,
    "DEPARTMENT_HEAD" as Role,
    "FACULTY_ADMIN" as Role,
    "DEPARTMENT_ADMIN" as Role,
  ];

  return purchasingRoles.includes(userRole);
};

/**
 * Get list of allowed actions for a role on a specific page
 * 
 * @param role - The user's role
 * @param page - The page/route
 * @returns Array of allowed actions
 */
export const getAllowedActions = (role: Role, page: string): string[] => {
  const rolePolicy = policies[role];
  if (!rolePolicy) return [];

  // Full access for super admin and admin
  if (rolePolicy["*"]?.actions.includes("*")) {
    return ["view", "create", "edit", "delete", "approve", "export", "import"];
  }

  const pagePolicy = rolePolicy[page];
  return pagePolicy?.actions || [];
};

/**
 * Check if user can export data from a page
 * 
 * @param role - The user's role
 * @param page - The page/route
 * @returns true if export is allowed
 */
export const canExportData = (role: Role, page: string): boolean => {
  return canPerformAction(role, page, "export");
};

/**
 * Check if user can import data to a page
 * 
 * @param role - The user's role
 * @param page - The page/route
 * @returns true if import is allowed
 */
export const canImportData = (role: Role, page: string): boolean => {
  return canPerformAction(role, page, "import");
};

/**
 * Check if user can approve transactions/requests
 * 
 * @param role - The user's role
 * @param page - The page/route
 * @returns true if approval permission exists
 */
export const canApprove = (role: Role, page: string): boolean => {
  return canPerformAction(role, page, "approve");
};
