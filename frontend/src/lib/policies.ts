import { UserRole as Role } from "@/services/auth_service";

export type { Role };

type Policy = {
  [page: string]: { actions: string[] };
};

export const policies: Record<Role, Policy> = {
  SUPER_ADMIN: {
    "*": { actions: ["*"] }, // full access
  },
  ADMIN: {
    "*": { actions: ["*"] }, // full access
  },
  PROCUREMENT_MANAGER: {
    "/profile": { actions: ["view", "edit"] },
    "/offices": { actions: ["view"] },
    "/items": { actions: ["view", "edit", "create"] },
    "/purchases": { actions: ["view", "edit", "create"] },
    "/distributions": { actions: ["view", "edit", "create"] },
    "/reports": { actions: ["view"] },
    "/dashboard": { actions: ["view"] },
  },
  DEPARTMENT_HEAD: {
    "/profile": { actions: ["view", "edit"] },
    "/offices": { actions: ["view", "edit"] },
    "/items": { actions: ["view", "edit", "create"] },
    "/purchases": { actions: ["view", "edit", "create"] },
    "/distributions": { actions: ["view", "edit", "create"] },
    "/reports": { actions: ["view"] },
    "/dashboard": { actions: ["view"] },
  },
  DEPARTMENT_ADMIN: {
    "/profile": { actions: ["view", "edit"] },
    "/offices": { actions: ["view", "edit"] },
    "/items": { actions: ["view", "edit", "create"] },
    "/purchases": { actions: ["view", "edit", "create"] },
    "/distributions": { actions: ["view", "edit", "create"] },
    "/reports": { actions: ["view"] },
    "/dashboard": { actions: ["view"] },
  },
  FACULTY_ADMIN: {
    "/profile": { actions: ["view", "edit"] },
    "/office": { actions: ["view", "edit"] },
    "/offices": { actions: ["view", "edit", "create"] },
    "/items": { actions: ["view", "edit", "create"] },
    "/purchases": { actions: ["view", "edit", "create"] },
    "/distributions": { actions: ["view", "edit", "create"] },
    "/reports": { actions: ["view"] },
    "/dashboard": { actions: ["view"] },
  },
  FACULTY_MEMBER: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/items": { actions: ["view"] },
    "/purchases": { actions: ["view"] },
    "/distributions": { actions: ["view"] },
    "/reports": { actions: ["view"] },
  },
  OFFICE_MANAGER: {
    "/profile": { actions: ["view", "edit"] },
    "/offices": { actions: ["view"] },
    "/items": { actions: ["view", "edit", "create"] },
    "/purchases": { actions: ["view", "edit", "create"] },
    "/distributions": { actions: ["view", "edit", "create"] },
    "/reports": { actions: ["view"] },
    "/dashboard": { actions: ["view"] },
  },
  STAFF: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/items": { actions: ["view", "edit"] },
    "/purchases": { actions: ["view"] },
    "/distributions": { actions: ["view", "edit"] },
  },
  STUDENT: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/items": { actions: ["view"] },
  },
  USER: {
    "/profile": { actions: ["view", "edit"] },
    "/dashboard": { actions: ["view"] },
    "/offices": { actions: ["view"] },
    "/items": { actions: ["view"] },
    "/purchases": { actions: ["view"] },
    "/distributions": { actions: ["view"] },
  },
  VIEWER: {
    "/profile": { actions: ["view", "edit"] },
    "/offices": { actions: ["view"] },
    "/items": { actions: ["view"] },
    "/purchases": { actions: ["view"] },
    "/distributions": { actions: ["view"] },
    "/reports": { actions: ["view"] },
    "/dashboard": { actions: ["view"] },
  },
  GUEST: {},
};

// ---- Check if user can access a route ----
export const canAccessRoute = (role: Role, path: string): boolean => {
  const rolePolicy = policies[role];
  if (!rolePolicy) return false;

  if (rolePolicy["*"]?.actions.includes("*")) return true; // full access
  return Object.keys(rolePolicy).some((page) => path.startsWith(page));
};

// ---- Check if user can perform an action ----
export const canPerformAction = (role: Role, page: string, action: string): boolean => {
  const rolePolicy = policies[role];
  if (!rolePolicy) return false;

  if (rolePolicy["*"]?.actions.includes("*")) return true;

  const pagePolicy = rolePolicy[page];
  if (!pagePolicy) return false;

  const allowedActions = pagePolicy.actions;
  return allowedActions.includes(action);
};
