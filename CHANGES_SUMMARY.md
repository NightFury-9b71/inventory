# 🎯 Office-Based Inventory System - Changes Summary

## What Was Changed

### ✅ 1. **Simplified Role Structure**
**Before**: 13 different roles (SUPER_ADMIN, ADMIN, PROCUREMENT_MANAGER, DEPARTMENT_HEAD, FACULTY_MEMBER, STAFF, STUDENT, VIEWER, etc.)

**After**: 3 main roles
- `SUPER_ADMIN` - Full system access
- `ADMIN` - Office administrator with purchasing power
- `USER` - Regular user without purchasing power

**Impact**: Cleaner permission model, easier to understand and maintain

---

### ✅ 2. **Office-Based Inventory Tracking**
**Before**: Global inventory shared across all offices

**After**: Each office has its own inventory
- Purchases are linked to the purchasing office
- Distributions are office-specific
- Movements track items between offices
- Office inventory table maintains per-office quantities

**Impact**: True multi-tenant inventory management

---

### ✅ 3. **Hierarchical Access Control**
**New Feature**: Parent offices can see child office data

**Access Rules**:
| Role | Own Office | Child Offices | All Offices |
|------|-----------|---------------|-------------|
| SUPER_ADMIN | ✅ | ✅ | ✅ |
| ADMIN | ✅ | ✅ | ❌ |
| USER | ✅ | ❌ | ❌ |

**Example**:
```
Vice Chancellor Office (admin_vc)
├── CSE Department (admin_cse)
└── Physics Department (admin_phy)

admin_vc: Can see VC Office + CSE + Physics data
admin_cse: Can see ONLY CSE data
user_cse: Can see ONLY CSE data
```

---

## 📁 Files Added/Modified

### Backend Files

#### ✨ New Files
1. `backend/src/main/resources/db/changelog/db.changelog-add-office-to-transactions.xml`
   - Database migration for office-based inventory
   - Adds office_id to purchases table
   - Simplifies roles to ADMIN and USER

2. `backend/src/main/java/bd/edu/just/backend/service/OfficeHierarchyService.java`
   - Manages office hierarchy
   - Determines accessible offices for users
   - Provides office access validation

#### 📝 Modified Files
1. `backend/src/main/resources/db/changelog/db.changelog-master.xml`
   - Includes new migration file

2. `backend/src/main/java/bd/edu/just/backend/model/Purchase.java`
   - Added `Office office` field
   - Updated constructor to require office

3. `backend/src/main/java/bd/edu/just/backend/dto/PurchaseDTO.java`
   - Added `officeId` and `officeName` fields

4. `backend/src/main/java/bd/edu/just/backend/service/PurchaseService.java`
   - Added `getPurchasesForUser()` method for office-based filtering
   - Updated `createPurchase()` to set office from user's designation
   - Updated `convertToDTO()` to include office information

5. `backend/src/main/java/bd/edu/just/backend/service/DesignationService.java`
   - Added `getPrimaryOfficeId(Long userId)` method
   - Added `isUserAdmin(Long userId)` method

6. `backend/src/main/java/bd/edu/just/backend/service/DesignationServiceImpl.java`
   - Implemented new methods for office and role checks

7. `backend/src/main/java/bd/edu/just/backend/repository/OfficeRepository.java`
   - Added `findAllChildOfficeIds()` for recursive hierarchy queries
   - Added `findActiveChildOffices()` for direct children
   - Added `findByCode()` lookup method

8. `backend/src/main/java/bd/edu/just/backend/repository/PurchaseRepository.java`
   - Added `findByOfficeIdAndIsActiveTrue()`
   - Added `findByOfficeIdsAndIsActiveTrue()`
   - Added `findByOfficeIdAndDateRange()`
   - Added `getTotalPurchaseValueByOffice()`

9. `backend/src/main/java/bd/edu/just/backend/repository/ItemDistributionRepository.java`
   - Added `findByOfficeIdAndIsActiveTrue()`
   - Added `findByOfficeIdsAndIsActiveTrue()`
   - Added `findByOfficeIdAndDateRange()`

10. `backend/src/main/java/bd/edu/just/backend/repository/ItemMovementRepository.java`
    - Added `findByOfficeId()`
    - Added `findByOfficeIds()`

11. `backend/src/main/java/bd/edu/just/backend/repository/DesignationRepository.java`
    - Added `findByUserIdAndIsActive()`
    - Added `findByUserIdAndIsActiveAndIsPrimary()`

### Frontend Files

#### 📝 Modified Files
1. `frontend/src/lib/policies.ts`
   - **COMPLETELY REWRITTEN** with simplified role structure
   - Added office hierarchy support in policy functions
   - New functions: `canAccessOfficeData()`, `canManageOfficeItems()`, etc.
   - Simplified from 13 roles to 3 main roles (+ legacy compatibility)

2. `frontend/src/lib/policies-old.ts` (NEW)
   - Backup of previous policies for reference

### Documentation Files

#### ✨ New Documentation
1. `IMPLEMENTATION_GUIDE.md`
   - Comprehensive guide to all changes
   - Database schema documentation
   - Backend and frontend changes explained
   - Migration instructions
   - Troubleshooting guide

2. `CHANGES_SUMMARY.md` (this file)
   - Quick overview of changes
   - Testing instructions
   - Migration steps

---

## 🚀 How to Deploy

### 1. Backend Deployment

```bash
cd backend

# The migration will run automatically on application startup
mvn clean install
mvn spring-boot:run
```

The Liquibase migration will:
- ✅ Add office_id column to purchases table
- ✅ Migrate existing purchases to include office from user's designation
- ✅ Update role purchasing_power flags
- ✅ Consolidate legacy roles into ADMIN or USER
- ✅ Add performance indexes

### 2. Frontend Deployment

```bash
cd frontend

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

**Note**: The policies have been updated. Clear browser cache if needed.

---

## 🧪 Testing Instructions

### Test Scenario 1: Role Simplification

**Test Case**: Login with different users and verify role-based access

1. Login as `admin_cse` (password: `password`)
   - ✅ Should have ADMIN role
   - ✅ Can create purchases
   - ✅ Can access /purchases, /distributions, /items pages
   - ✅ Can see "Create Purchase" button

2. Login as `user_cse` (password: `password`)
   - ✅ Should have USER role
   - ✅ Cannot create purchases
   - ✅ Can view purchases (read-only)
   - ✅ Cannot see "Create Purchase" button
   - ✅ Can create distributions

### Test Scenario 2: Office-Based Inventory

**Test Case**: Verify purchases are office-specific

1. Login as `admin_cse`
   - Create a purchase for CSE department
   - ✅ Purchase should be saved with office_id = CSE office ID
   - ✅ Response should include `officeId` and `officeName` fields

2. Login as `admin_phy` (Physics department)
   - View purchases
   - ✅ Should see ONLY Physics department purchases
   - ✅ Should NOT see CSE purchases (different office)

3. Login as `user_cse`
   - View purchases
   - ✅ Should see CSE purchases
   - ✅ Should NOT see Physics purchases

### Test Scenario 3: Hierarchical Access (Parent-Child)

**Test Case**: Parent office admin can see child office data

**Setup**: Assuming office hierarchy exists:
```
Vice Chancellor Office (ID: 2)
├── CSE Department (ID: 10)
└── Physics Department (ID: 20)
```

1. Login as `admin_vc` (Vice Chancellor Office admin)
   - View purchases
   - ✅ Should see VC Office purchases
   - ✅ Should see CSE Department purchases (child)
   - ✅ Should see Physics Department purchases (child)

2. Login as `admin_cse`
   - View purchases
   - ✅ Should see ONLY CSE purchases
   - ✅ Should NOT see VC Office purchases (parent)
   - ✅ Should NOT see Physics purchases (sibling)

### Test Scenario 4: Office Inventory Tracking

**Test Case**: Verify office_inventory table is updated correctly

1. Login as `admin_cse`
2. Create a purchase:
   - Item: Laptop
   - Quantity: 5
   - ✅ Check `purchases` table: office_id should be CSE office ID
   - ✅ Check `office_inventory` table: CSE office should have 5 laptops
   - ✅ Check `items` table: Global quantity should increase by 5

3. Login as `admin_phy`
4. Create a purchase:
   - Item: Laptop
   - Quantity: 3
   - ✅ Check `office_inventory`: Physics office should have 3 laptops
   - ✅ CSE office should still have 5 laptops (separate inventory)

### Test Scenario 5: Distribution Filtering

**Test Case**: Distributions are office-specific

1. Login as `admin_cse`
   - Create a distribution from CSE inventory
   - ✅ Distribution should be linked to CSE office
   
2. Login as `user_phy`
   - View distributions
   - ✅ Should see ONLY Physics distributions
   - ✅ Should NOT see CSE distributions

### Test Scenario 6: API Response Validation

**Test Case**: API responses include office information

```bash
# Get purchases for a user
curl -X GET http://localhost:8080/api/purchases \
  -H "Authorization: Bearer <token>"
```

**Expected Response**:
```json
[
  {
    "id": 1,
    "vendorName": "Vendor A",
    "totalPrice": 50000.0,
    "officeId": 10,
    "officeName": "Computer Science & Engineering",
    "purchasedById": 15,
    "purchasedByName": "admin_cse",
    ...
  }
]
```

✅ Verify `officeId` and `officeName` are present in response

---

## 🔍 Database Verification

### Check Migration Status

```sql
-- Check if migration ran
SELECT * FROM databasechangelog 
WHERE id = 'add-office-to-purchases';

-- Check office_id column exists
DESCRIBE purchases;

-- Check roles are simplified
SELECT * FROM roles;
-- Should show: ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_USER

-- Check office_id is populated
SELECT id, vendor_name, office_id FROM purchases;
-- All rows should have office_id (not NULL)
```

### Verify Office Hierarchy

```sql
-- Get office hierarchy
SELECT o1.id, o1.name, o1.parent_id, o2.name as parent_name
FROM offices o1
LEFT JOIN offices o2 ON o1.parent_id = o2.id
ORDER BY o1.parent_id, o1.id;
```

### Check User Designations

```sql
-- Check user roles and offices
SELECT 
    u.username, 
    u.name,
    r.name as role,
    o.name as office,
    d.is_primary
FROM users u
JOIN designations d ON u.id = d.user_id
JOIN roles r ON d.role_id = r.id
JOIN offices o ON d.office_id = o.id
WHERE d.is_active = 1
ORDER BY u.username;
```

---

## 📊 Expected Results

### Database State After Migration

1. **Roles Table**:
   ```
   ROLE_SUPER_ADMIN (purchasing_power: 1)
   ROLE_ADMIN       (purchasing_power: 1)
   ROLE_USER        (purchasing_power: 0)
   ```

2. **Purchases Table**:
   - All purchases have `office_id` set
   - No NULL values in `office_id` column

3. **Designations Table**:
   - Legacy roles migrated to ADMIN or USER
   - All users retain their office assignments

### Frontend Behavior

1. **Admin Users** (`admin_*` accounts):
   - See "Create Purchase" button
   - Can access all admin features
   - See their office + child office data

2. **Regular Users** (`user_*` accounts):
   - No "Create Purchase" button
   - Limited to viewing and distributions
   - See only their office data

---

## ⚠️ Known Issues & Limitations

### Current Limitations

1. **Controllers Not Updated**: 
   - Backend controllers still call `getAllPurchases()`
   - Need to update to call `getPurchasesForUser(officeId, isAdmin)`
   - **TODO**: Update PurchaseController, DistributionController, etc.

2. **Frontend Services Not Updated**:
   - Frontend still fetches all data
   - Need to pass office context from AuthContext
   - **TODO**: Update purchase_service.ts, distribution_service.ts

3. **No Office Filter UI**:
   - UI doesn't show office filter dropdown yet
   - **TODO**: Add office selector for admins viewing child office data

### Workarounds

Until controllers are updated:
- Backend still returns all data
- Frontend should filter based on user's office
- Use policies to hide unauthorized actions

---

## 🎓 Next Steps

### Immediate Next Steps (Required for Full Functionality)

1. **Update Controllers**:
   ```java
   // In PurchaseController.java
   @GetMapping
   public List<PurchaseDTO> getPurchases(@AuthenticationPrincipal User user) {
       Long officeId = designationService.getPrimaryOfficeId(user.getId());
       boolean isAdmin = designationService.isUserAdmin(user.getId());
       return purchaseService.getPurchasesForUser(officeId, isAdmin);
   }
   ```

2. **Update Frontend Services**:
   - Add office context to API calls
   - Filter data based on accessible offices
   - Show office information in tables

3. **Add Office Filter UI**:
   - For admins, show dropdown to filter by child offices
   - Display office name in purchase/distribution lists
   - Add visual indicators for parent/child office data

### Future Enhancements

1. **Office Dashboard**:
   - Show office-specific statistics
   - Compare inventory across child offices
   - Track inter-office movements

2. **Reporting**:
   - Office-wise purchase reports
   - Inventory comparison reports
   - Child office summary reports

3. **Notifications**:
   - Alert parent office admins of child office activities
   - Low inventory alerts per office
   - Purchase approval workflow

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: Migration fails with "column already exists"
- **Solution**: Column may have been added manually. Drop it and rerun migration.

**Issue**: User sees "not authorized" error
- **Solution**: Check user has designation with is_active=1 and is_primary=1

**Issue**: Office hierarchy not working
- **Solution**: Verify office parent_id relationships in database

**Issue**: Purchases not filtered by office
- **Solution**: Controllers not updated yet. See "Next Steps" section.

### Debug Queries

```sql
-- Check user's office
SELECT u.username, o.name as office, r.name as role
FROM users u
JOIN designations d ON u.id = d.user_id
JOIN offices o ON d.office_id = o.id
JOIN roles r ON d.role_id = r.id
WHERE u.username = 'admin_cse' AND d.is_primary = 1;

-- Get accessible offices for a user (if they're admin of office ID 10)
WITH RECURSIVE office_tree AS (
    SELECT id FROM offices WHERE id = 10
    UNION ALL
    SELECT o.id FROM offices o
    INNER JOIN office_tree ot ON o.parent_id = ot.id
)
SELECT * FROM offices WHERE id IN (SELECT id FROM office_tree);
```

---

## ✅ Checklist

Before deploying to production:

- [ ] Run database migration successfully
- [ ] Test with ADMIN user account
- [ ] Test with USER user account
- [ ] Verify office hierarchy queries work
- [ ] Test purchase creation with office assignment
- [ ] Verify distributions are office-specific
- [ ] Check API responses include office information
- [ ] Frontend policies correctly restrict access
- [ ] Update controllers for office-based filtering
- [ ] Update frontend services
- [ ] Add office filter UI components
- [ ] Update documentation for end users

---

## 📝 Summary

**What changed**: 
- Simplified 13 roles → 3 roles (SUPER_ADMIN, ADMIN, USER)
- Added office-based inventory tracking
- Implemented parent-child office hierarchy access
- Each office has separate inventory and transactions

**Impact**:
- ✅ Cleaner, easier to understand permission system
- ✅ True multi-tenant inventory management
- ✅ Hierarchical oversight for parent offices
- ✅ Better data isolation and security

**Status**: 
- ✅ Database migrations: Complete
- ✅ Backend models & services: Complete
- ✅ Frontend policies: Complete
- ⏳ Backend controllers: Needs update
- ⏳ Frontend services/components: Needs update

**For questions or issues**, please refer to `IMPLEMENTATION_GUIDE.md` or create an issue in the repository.
