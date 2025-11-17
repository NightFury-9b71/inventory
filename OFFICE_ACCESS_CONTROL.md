# Office-Based Access Control

## Overview

The inventory management system implements **office-based access control** where each user can only perform CRUD operations on data related to their assigned office or department.

## Role Structure

Each office/department should have these role types:

### Core Roles
- **`DEPARTMENT_HEAD`**: Full CRUD access to their department's data
- **`FACULTY_MEMBER`**: Read-only access to their department's data
- **`STAFF`**: Read/Edit access to their office's operational data
- **`STUDENT`**: Limited read access to their office/department
- **`VIEWER`**: Read-only access to their office/department

### Administrative Roles
- **`SUPER_ADMIN`**: Full access to all offices and data
- **`ADMIN`**: Full access to all offices and data

## Permission Matrix

| Role | Profile | Dashboard | Offices | Items | Purchases | Distributions | Reports |
|------|---------|-----------|---------|-------|-----------|---------------|---------|
| SUPER_ADMIN | view, edit | view | view, edit, create, delete | view, edit, create, delete | view, edit, create, delete | view, edit, create, delete | view |
| ADMIN | view, edit | view | view, edit, create, delete | view, edit, create, delete | view, edit, create, delete | view, edit, create, delete | view |
| DEPARTMENT_HEAD | view, edit | view | view | view, edit, create, delete | view, edit, create, delete | view, edit, create, delete | view |
| FACULTY_MEMBER | view, edit | view | view | view | view | view | view |
| STAFF | view, edit | view | view | view, edit | view | view, edit, create | view |
| STUDENT | view, edit | view | view | view | - | - | view |
| VIEWER | view | view | view | view | view | view | view |

## Office-Based Restrictions

**Important**: Users can only access data related to their assigned office. For example:
- A CSE Department Head can only manage items, purchases, and distributions for the CSE department
- A Registrar Staff member can only view and edit items in the Registrar's office
- Students can only view data related to their department/office

## Usage Examples

### Basic Page Access
```typescript
import { canAccessRoute, canPerformAction } from '@/lib/policies';

// Check if user can access a page
const canViewDashboard = canAccessRoute(userRole, '/dashboard');

// Check if user can perform an action on a page
const canCreateItem = canPerformAction(userRole, '/items', 'create');
```

### Office-Specific Data Access
```typescript
import {
  canAccessOfficeData,
  canManageOfficeItems,
  canManageOfficePurchases,
  canManageOfficeDistributions
} from '@/lib/policies';

// Check if user can access data from a specific office
const canViewOfficeData = canAccessOfficeData(
  userRole,
  userOfficeId,
  targetOfficeId,
  'view'
);

// Check if user can manage items in a specific office
const canEditOfficeItem = canManageOfficeItems(
  userRole,
  userOfficeId,
  targetOfficeId,
  'edit'
);

// Check if user can manage purchases for their office
const canCreatePurchase = canManageOfficePurchases(
  userRole,
  userOfficeId,
  targetOfficeId,
  'create'
);

// Check if user can manage distributions for their office
const canDeleteDistribution = canManageOfficeDistributions(
  userRole,
  userOfficeId,
  targetOfficeId,
  'delete'
);
```

## Implementation Notes

### Frontend Components
When displaying data, always filter by the user's office:

```typescript
// Example: Filter items by user's office
const userItems = allItems.filter(item =>
  item.officeId === userOfficeId ||
  userRole === 'SUPER_ADMIN' ||
  userRole === 'ADMIN'
);
```

### API Endpoints
Backend APIs should implement office-based filtering:

```typescript
// Example: Check permissions in API endpoint
if (!canManageOfficeItems(userRole, userOfficeId, item.officeId, 'edit')) {
  return res.status(403).json({ error: 'Access denied' });
}
```

### Database Queries
Always include office-based WHERE clauses:

```sql
-- Example: Get items for user's office only
SELECT * FROM items
WHERE office_id = ? OR ? IN ('SUPER_ADMIN', 'ADMIN')
```

## Migration from Legacy Roles

The following legacy roles are kept for backward compatibility but should be migrated:

- `PROCUREMENT_MANAGER` → Use `DEPARTMENT_HEAD` or `STAFF`
- `DEPARTMENT_ADMIN` → Use `DEPARTMENT_HEAD`
- `FACULTY_ADMIN` → Use `DEPARTMENT_HEAD`
- `OFFICE_MANAGER` → Use `STAFF`
- `USER` → Use appropriate role based on office type

## Best Practices

1. **Always check permissions** before displaying UI elements
2. **Filter data by office** in both frontend and backend
3. **Use the helper functions** for consistent permission checking
4. **Test with different roles** to ensure proper access control
5. **Document office requirements** when adding new features

## Database Seeding

The database has been seeded with users for each office following this pattern:
- `user_{office_code}`: Regular user (STAFF/FACULTY_MEMBER)
- `admin_{office_code}`: Administrator (DEPARTMENT_HEAD/ADMIN)

All users have the password: `password`</content>
<parameter name="filePath">/home/nextspring/Desktop/inventory/OFFICE_ACCESS_CONTROL.md