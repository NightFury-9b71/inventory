# 🎴 Quick Reference: Office-Based Inventory System

## Role Structure

| Role | Purchasing Power | Access Scope | Use Case |
|------|-----------------|--------------|----------|
| **SUPER_ADMIN** | ✅ Yes | All offices | System administrator |
| **ADMIN** | ✅ Yes | Own office + child offices | Office administrator |
| **USER** | ❌ No | Own office only | Regular staff |

## Access Rules Matrix

| User Type | Own Office | Child Offices | Parent Office | Sibling Offices |
|-----------|-----------|---------------|---------------|-----------------|
| SUPER_ADMIN | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| ADMIN | ✅ Full | ✅ Full | ❌ No | ❌ No |
| USER | ✅ View+Distribute | ❌ No | ❌ No | ❌ No |

## Backend Quick Reference

### Get User's Office and Role

```java
// Get user's primary office ID
Long officeId = designationService.getPrimaryOfficeId(userId);

// Check if user is admin
boolean isAdmin = designationService.isUserAdmin(userId);

// Get accessible office IDs
List<Long> officeIds = officeHierarchyService.getAccessibleOfficeIds(officeId, isAdmin);
```

### Query Data by Office

```java
// Purchases
List<PurchaseDTO> purchases = purchaseService.getPurchasesForUser(officeId, isAdmin);

// Distributions  
List<ItemDistribution> distributions = 
    distributionRepository.findByOfficeIdsAndIsActiveTrue(officeIds);

// Movements
List<ItemMovement> movements = movementRepository.findByOfficeIds(officeIds);
```

### Controller Pattern

```java
@GetMapping("/purchases")
public ResponseEntity<List<PurchaseDTO>> getPurchases(
    @AuthenticationPrincipal User user
) {
    Long officeId = designationService.getPrimaryOfficeId(user.getId());
    boolean isAdmin = designationService.isUserAdmin(user.getId());
    
    List<PurchaseDTO> purchases = purchaseService.getPurchasesForUser(officeId, isAdmin);
    return ResponseEntity.ok(purchases);
}
```

### Create with Office

```java
@PostMapping("/purchases")
public ResponseEntity<PurchaseDTO> createPurchase(
    @RequestBody PurchaseDTO dto,
    @AuthenticationPrincipal User user
) {
    // Office is automatically set from user's designation in service
    PurchaseDTO created = purchaseService.createPurchase(dto);
    return ResponseEntity.ok(created);
}
```

## Frontend Quick Reference

### Check Permissions

```typescript
import { canPerformAction, hasPurchasingPower, canAccessOfficeData } from '@/lib/policies';
import { useAuth } from '@/contexts/AuthContext';

const { user, role } = useAuth();

// Check if user can perform action
const canCreate = canPerformAction(role, '/purchases', 'create');

// Check purchasing power
const canPurchase = hasPurchasingPower(role);

// Check office access (assuming you have childOfficeIds)
const canAccessOffice = canAccessOfficeData(
  role,
  user?.officeId,
  targetOfficeId,
  childOfficeIds
);
```

### Conditional Rendering

```tsx
import { Can } from '@/components/auth/Can';

// Show button only if user can create
<Can do="create" on="/purchases">
  <button>Create Purchase</button>
</Can>

// Show based on role
{hasPurchasingPower(role) && (
  <button>Create Purchase</button>
)}

// Hide for regular users
{role !== 'USER' && (
  <button>Admin Action</button>
)}
```

### Display Office Info

```tsx
// In purchase list
<div>
  <h3>{purchase.vendorName}</h3>
  <p>Office: {purchase.officeName}</p>
  <span>Total: ${purchase.totalPrice}</span>
</div>
```

## Database Quick Queries

### Check User's Office and Role

```sql
SELECT 
    u.username,
    u.name,
    r.name as role,
    r.purchasing_power,
    o.name as office,
    o.id as office_id,
    d.is_primary
FROM users u
JOIN designations d ON u.id = d.user_id AND d.is_active = 1
JOIN roles r ON d.role_id = r.id
JOIN offices o ON d.office_id = o.id
WHERE u.username = 'admin_cse';
```

### Get Office Hierarchy

```sql
-- Get all child offices for office ID 2
WITH RECURSIVE office_tree AS (
    SELECT id, name, parent_id, 0 as level
    FROM offices WHERE id = 2
    UNION ALL
    SELECT o.id, o.name, o.parent_id, ot.level + 1
    FROM offices o
    INNER JOIN office_tree ot ON o.parent_id = ot.id
)
SELECT * FROM office_tree ORDER BY level, name;
```

### Check Purchases by Office

```sql
SELECT 
    p.id,
    p.vendor_name,
    p.total_price,
    o.name as office_name,
    u.username as purchased_by
FROM purchases p
JOIN offices o ON p.office_id = o.id
JOIN users u ON p.purchased_by = u.id
WHERE p.is_active = 1
ORDER BY p.purchase_date DESC;
```

### Office Inventory Status

```sql
SELECT 
    o.name as office,
    i.name as item,
    oi.quantity,
    oi.last_updated
FROM office_inventory oi
JOIN offices o ON oi.office_id = o.id
JOIN items i ON oi.item_id = i.id
WHERE o.id = 10  -- CSE Department
ORDER BY oi.quantity DESC;
```

## Common Scenarios

### Scenario 1: Admin Creates Purchase

```java
// Backend Controller
@PostMapping("/purchases")
public ResponseEntity<PurchaseDTO> create(
    @RequestBody PurchaseDTO dto,
    @AuthenticationPrincipal User user
) {
    // 1. Service gets user's office automatically
    PurchaseDTO result = purchaseService.createPurchase(dto);
    
    // 2. Purchase is saved with office_id from user's designation
    // 3. Office inventory is updated
    
    return ResponseEntity.ok(result);
}
```

### Scenario 2: Admin Views Purchases

```java
// Backend Controller
@GetMapping("/purchases")
public ResponseEntity<List<PurchaseDTO>> list(
    @AuthenticationPrincipal User user
) {
    // 1. Get user's office
    Long officeId = designationService.getPrimaryOfficeId(user.getId());
    
    // 2. Check if admin
    boolean isAdmin = designationService.isUserAdmin(user.getId());
    
    // 3. Get accessible offices (own + children if admin)
    List<PurchaseDTO> purchases = 
        purchaseService.getPurchasesForUser(officeId, isAdmin);
    
    return ResponseEntity.ok(purchases);
}
```

### Scenario 3: User Views Purchases

```java
// Same controller code as Scenario 2
// But isAdmin = false, so only own office purchases are returned
```

### Scenario 4: Filter by Office (Frontend)

```typescript
// Component
const { user, role } = useAuth();
const [selectedOfficeId, setSelectedOfficeId] = useState(user?.officeId);

// Fetch purchases
useEffect(() => {
  const fetchPurchases = async () => {
    const data = await getPurchases();
    
    // Filter if needed (or backend already filtered)
    const filtered = data.filter(p => 
      p.officeId === selectedOfficeId ||
      childOfficeIds.includes(p.officeId)
    );
    
    setPurchases(filtered);
  };
  
  fetchPurchases();
}, [selectedOfficeId]);
```

## API Response Structure

### Purchase Response

```json
{
  "id": 1,
  "vendorName": "Tech Supplier",
  "vendorContact": "01712345678",
  "totalPrice": 50000.0,
  "purchaseDate": "2025-11-20",
  "invoiceNumber": "INV-2025-001",
  "officeId": 10,
  "officeName": "Computer Science & Engineering",
  "purchasedById": 15,
  "purchasedByName": "admin_cse",
  "items": [
    {
      "itemId": 1,
      "itemName": "Laptop",
      "quantity": 5,
      "unitPrice": 10000.0,
      "totalPrice": 50000.0
    }
  ],
  "isActive": true
}
```

## Testing Commands

### Test User Accounts

```bash
# Admin accounts (can create purchases)
admin_cse / password  # CSE Department Admin
admin_vc  / password  # Vice Chancellor Office Admin
admin_phy / password  # Physics Department Admin

# User accounts (cannot create purchases)
user_cse  / password  # CSE Department User
user_vc   / password  # VC Office User
user_phy  / password  # Physics Department User

# Super admin
superadmin / password # System Administrator
```

### API Testing with cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_cse","password":"password"}'

# Get purchases (with token)
curl -X GET http://localhost:8080/api/purchases \
  -H "Authorization: Bearer <token>"

# Create purchase
curl -X POST http://localhost:8080/api/purchases \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "vendorName": "Test Vendor",
    "totalPrice": 10000,
    "purchaseDate": "2025-11-20",
    "items": [
      {
        "itemId": 1,
        "quantity": 2,
        "unitPrice": 5000
      }
    ]
  }'
```

## Migration Commands

```bash
# Backend - Run migrations
cd backend
mvn clean install
mvn liquibase:update  # Or just start the app

# Check migration status
mvn liquibase:status

# Rollback if needed
mvn liquibase:rollback -Dliquibase.rollbackCount=1
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "User does not have an assigned office" | Check `designations` table, ensure user has active designation with office |
| Cannot see purchases | Check user's office_id matches purchase office_id |
| Admin cannot see child office data | Verify office parent_id relationships |
| Migration fails | Check if columns already exist, may need manual cleanup |
| Role not recognized | Clear frontend cache, check AuthContext parsing |

## Key Files to Update

When adding new features, update these files:

### Backend
- Controller: Add office filtering logic
- Service: Use `getPurchasesForUser()` pattern
- Repository: Add office-based query methods
- DTO: Include `officeId` and `officeName` fields

### Frontend
- Service: Parse office fields from API responses
- Component: Display office information
- Policy: Check permissions before showing UI elements
- Context: Pass office and role information

---

**Remember**: 
- Every office has its own inventory
- ADMIN can see child offices, USER cannot
- All purchases/distributions are office-specific
- Use `OfficeHierarchyService` to check access
