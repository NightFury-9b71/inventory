import { UserRole as Role } from "@/services/auth_service";

export type { Role };

type Policy = {
  [page: string]: { actions: string[] };
};

export const policies: Record<Role, Policy> = {

  SUPER_ADMIN: {
    "*": { actions: ["*"] },
  },

  ADMIN: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view", "edit"] },
    "/categories": { actions: ["view", "create", "edit", "delete"] },
    "/units": { actions: ["view", "create", "edit", "delete"] },
    "/items": { actions: ["view", "create", "edit", "delete", "export"] },
    "/inventory": { actions: ["view"] },
    "/barcode": { actions: ["view", "create", "edit"] },
    "/purchases": { actions: ["view", "create", "edit", "delete", "approve", "export"] },
    "/distributions": { actions: ["view", "create", "edit", "delete", "approve", "export"] },
    "/office-distributions": { actions: ["view", "create", "edit", "delete", "approve", "export"] },
    "/movements": { actions: ["view", "create", "edit", "export"] },
    "/reports": { actions: ["view", "export"] },
    "/analytics": { actions: ["view", "export"] },
    "/logs": { actions: ["view", "export"] },
    "/settings": { actions: ["view", "edit"] },
  },

  USER: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/categories": { actions: ["view"] },
    "/units": { actions: ["view"] },
    "/items": { actions: ["view"] },
    "/inventory": { actions: ["view"] },
    "/barcode": { actions: ["view"] },
    "/purchases": { actions: ["view"] },
    "/distributions": { actions: ["view"] },
    "/reports": { actions: ["view"] },
  },

  /**
   * GUEST - Unauthenticated User
   * Can only access login page
   */
  GUEST: {
    "/login": { actions: ["view"] },
  },

  // Legacy roles for backward compatibility (will be migrated to ADMIN or USER)
  PROCUREMENT_MANAGER: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view", "edit"] },
    "/categories": { actions: ["view", "create", "edit", "delete"] },
    "/units": { actions: ["view", "create", "edit", "delete"] },
    "/items": { actions: ["view", "create", "edit", "delete", "export", "import"] },
    "/inventory": { actions: ["view"] },
    "/barcode": { actions: ["view", "create", "edit"] },
    "/purchases": { actions: ["view", "create", "edit", "delete", "approve", "export"] },
    "/distributions": { actions: ["view", "create", "edit", "delete", "approve", "export"] },
    "/office-distributions": { actions: ["view", "create", "edit", "delete", "approve", "export"] },
    "/movements": { actions: ["view", "create", "edit", "export"] },
    "/reports": { actions: ["view", "export"] },
    "/analytics": { actions: ["view", "export"] },
    "/logs": { actions: ["view", "export"] },
    "/settings": { actions: ["view", "edit"] },
  },
  DEPARTMENT_HEAD: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/categories": { actions: ["view", "create", "edit"] },
    "/units": { actions: ["view", "create", "edit"] },
    "/items": { actions: ["view", "create", "edit", "delete", "export"] },
    "/inventory": { actions: ["view"] },
    "/barcode": { actions: ["view", "create"] },
    "/purchases": { actions: ["view", "create", "edit", "approve", "export"] },
    "/distributions": { actions: ["view", "create", "edit", "approve", "export"] },
    "/office-distributions": { actions: ["view", "create", "edit", "approve", "export"] },
    "/movements": { actions: ["view", "create", "edit"] },
    "/reports": { actions: ["view", "export"] },
    "/analytics": { actions: ["view"] },
    "/logs": { actions: ["view"] },
    "/settings": { actions: ["view"] },
  },
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
  STUDENT: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/items": { actions: ["view"] },
    "/reports": { actions: ["view"] },
  },
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
  FACULTY_ADMIN: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view", "edit", "create"] },
    "/categories": { actions: ["view", "create", "edit", "delete"] },
    "/units": { actions: ["view", "create", "edit", "delete"] },
    "/items": { actions: ["view", "create", "edit", "delete", "export"] },
    "/inventory": { actions: ["view"] },
    "/barcode": { actions: ["view", "create", "edit"] },
    "/purchases": { actions: ["view", "create", "edit", "approve", "export"] },
    "/distributions": { actions: ["view", "create", "edit", "approve", "export"] },
    "/movements": { actions: ["view", "create", "edit"] },
    "/reports": { actions: ["view", "export"] },
    "/analytics": { actions: ["view"] },
    "/logs": { actions: ["view"] },
    "/settings": { actions: ["view", "edit"] },
  },
  DEPARTMENT_ADMIN: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view", "edit"] },
    "/categories": { actions: ["view", "create", "edit", "delete"] },
    "/units": { actions: ["view", "create", "edit"] },
    "/items": { actions: ["view", "create", "edit", "delete", "export"] },
    "/inventory": { actions: ["view"] },
    "/barcode": { actions: ["view", "create"] },
    "/purchases": { actions: ["view", "create", "edit", "approve", "export"] },
    "/distributions": { actions: ["view", "create", "edit", "approve", "export"] },
    "/movements": { actions: ["view", "create", "edit"] },
    "/reports": { actions: ["view", "export"] },
    "/analytics": { actions: ["view"] },
    "/logs": { actions: ["view"] },
  },
  OFFICE_MANAGER: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/categories": { actions: ["view", "create", "edit"] },
    "/units": { actions: ["view", "create", "edit"] },
    "/items": { actions: ["view", "create", "edit", "export"] },
    "/inventory": { actions: ["view"] },
    "/barcode": { actions: ["view", "create"] },
    "/purchases": { actions: ["view", "create", "edit", "export"] },
    "/distributions": { actions: ["view", "create", "edit", "export"] },
    "/movements": { actions: ["view", "create", "edit"] },
    "/reports": { actions: ["view", "export"] },
    "/analytics": { actions: ["view"] },
  },
};

// ============================================================================
// PERMISSION CHECKING UTILITIES
// ============================================================================

/**
 * Check if user can access a specific route
 */
export const canAccessRoute = (role: Role, path: string): boolean => {
  const rolePolicy = policies[role];
  if (!rolePolicy) return false;

  // Full access for super admin
  if (rolePolicy["*"]?.actions.includes("*")) return true;

  // Check if route exists in role's policy
  return Object.keys(rolePolicy).some((page) => path.startsWith(page));
};

/**
 * Check if user can perform a specific action on a page
 */
export const canPerformAction = (
  role: Role,
  page: string,
  action: string
): boolean => {
  const rolePolicy = policies[role];
  if (!rolePolicy) return false;

  // Full access for super admin
  if (rolePolicy["*"]?.actions.includes("*")) return true;

  const pagePolicy = rolePolicy[page];
  if (!pagePolicy) return false;

  const allowedActions = pagePolicy.actions;
  return allowedActions.includes(action) || allowedActions.includes("*");
};

/**
 * Check if user can access office-specific data
 * - SUPER_ADMIN: Can access all offices
 * - ADMIN: Can access their office + all child offices
 * - USER: Can only access their own office
 */
export const canAccessOfficeData = (
  userRole: Role,
  userOfficeId: number | null,
  targetOfficeId: number | null,
  childOfficeIds: number[] = []
): boolean => {
  // SUPER_ADMIN can access all offices
  if (userRole === "SUPER_ADMIN") {
    return true;
  }

  // If no target office specified or no user office, deny access
  if (!targetOfficeId || !userOfficeId) {
    return false;
  }

  // User can always access their own office
  if (userOfficeId === targetOfficeId) {
    return true;
  }

  // ADMIN can access child offices
  if (userRole === "ADMIN") {
    return childOfficeIds.includes(targetOfficeId);
  }

  // USER can only access their own office
  return false;
};

/**
 * Check if user has purchasing power
 */
export const hasPurchasingPower = (userRole: Role): boolean => {
  return userRole === "SUPER_ADMIN" || userRole === "ADMIN" ||
         userRole === "PROCUREMENT_MANAGER" || userRole === "DEPARTMENT_HEAD" ||
         userRole === "FACULTY_ADMIN" || userRole === "DEPARTMENT_ADMIN";
};

/**
 * Get list of allowed actions for a role on a specific page
 */
export const getAllowedActions = (role: Role, page: string): string[] => {
  const rolePolicy = policies[role];
  if (!rolePolicy) return [];

  // Full access for super admin
  if (rolePolicy["*"]?.actions.includes("*")) {
    return ["view", "create", "edit", "delete", "approve", "export", "import"];
  }

  const pagePolicy = rolePolicy[page];
  return pagePolicy?.actions || [];
};

/**
 * Check if user can manage items in a specific office
 */
export const canManageOfficeItems = (
  userRole: Role,
  userOfficeId: number | null,
  targetOfficeId: number | null,
  action: string = "view",
  childOfficeIds: number[] = []
): boolean => {
  // Check if user can access the office
  if (!canAccessOfficeData(userRole, userOfficeId, targetOfficeId, childOfficeIds)) {
    return false;
  }

  // Check if user has permission for the action
  return canPerformAction(userRole, "/items", action);
};

/**
 * Check if user can manage purchases for a specific office
 */
export const canManageOfficePurchases = (
  userRole: Role,
  userOfficeId: number | null,
  targetOfficeId: number | null,
  action: string = "view",
  childOfficeIds: number[] = []
): boolean => {
  // Check if user can access the office
  if (!canAccessOfficeData(userRole, userOfficeId, targetOfficeId, childOfficeIds)) {
    return false;
  }

  // Check if user has permission for the action
  return canPerformAction(userRole, "/purchases", action);
};

/**
 * Check if user can manage distributions for a specific office
 */
export const canManageOfficeDistributions = (
  userRole: Role,
  userOfficeId: number | null,
  targetOfficeId: number | null,
  action: string = "view",
  childOfficeIds: number[] = []
): boolean => {
  // Check if user can access the office
  if (!canAccessOfficeData(userRole, userOfficeId, targetOfficeId, childOfficeIds)) {
    return false;
  }

  // Check if user has permission for the action
  return canPerformAction(userRole, "/distributions", action);
};

/**
 * Check if user can export data from a page
 */
export const canExportData = (role: Role, page: string): boolean => {
  return canPerformAction(role, page, "export");
};

/**
 * Check if user can import data to a page
 */
export const canImportData = (role: Role, page: string): boolean => {
  return canPerformAction(role, page, "import");
};

/**
 * Check if user can approve transactions/requests
 */
export const canApprove = (role: Role, page: string): boolean => {
  return canPerformAction(role, page, "approve");
};
