# Office-Based Inventory System - Implementation Guide

## Overview
This system has been updated to implement **office-based inventory management** with a **simplified two-role structure** (ADMIN and USER). Each office maintains its own inventory with individual transaction tracking.

---

## ✅ Key Changes Implemented

### 1. **Database Schema Updates**

#### New Migration File
- **Location**: `backend/src/main/resources/db/changelog/db.changelog-add-office-to-transactions.xml`
- **Changes**:
  - Added `office_id` to `purchases` table
  - Migrated existing purchases to include office_id from user's designation
  - Simplified roles to keep only ROLE_ADMIN and ROLE_USER
  - Added indexes for better query performance on office-based queries

#### Role Simplification
```sql
-- Only two roles now:
ROLE_ADMIN   - Has purchasing_power = true
ROLE_USER    - Has purchasing_power = false
```

All legacy roles (DEPARTMENT_HEAD, FACULTY_MEMBER, STAFF, etc.) are automatically migrated to either ADMIN or USER based on their purchasing power.

---

### 2. **Backend Changes**

#### A. New Models & Updates

**Purchase Model** (`Purchase.java`)
- Added `Office office` field
- All purchases are now tied to a specific office
- Constructor updated to require office

**Repository Enhancements**:

1. **OfficeRepository.java**
   ```java
   // New method to get all child offices recursively
   List<Long> findAllChildOfficeIds(Long officeId);
   
   // Get direct child offices
   List<Office> findActiveChildOffices(Long parentId);
   ```

2. **PurchaseRepository.java**
   ```java
   // Office-based queries
   List<Purchase> findByOfficeIdAndIsActiveTrue(Long officeId);
   List<Purchase> findByOfficeIdsAndIsActiveTrue(List<Long> officeIds);
   ```

3. **ItemDistributionRepository.java**
   ```java
   // Office-based distribution queries
   List<ItemDistribution> findByOfficeIdAndIsActiveTrue(Long officeId);
   List<ItemDistribution> findByOfficeIdsAndIsActiveTrue(List<Long> officeIds);
   ```

4. **ItemMovementRepository.java**
   ```java
   // Query movements involving specific offices
   List<ItemMovement> findByOfficeId(Long officeId);
   List<ItemMovement> findByOfficeIds(List<Long> officeIds);
   ```

#### B. New Service: OfficeHierarchyService

**Location**: `backend/src/main/java/bd/edu/just/backend/service/OfficeHierarchyService.java`

**Purpose**: Manages office hierarchy and determines which offices a user can access

**Key Methods**:
```java
// Get list of accessible office IDs for a user
List<Long> getAccessibleOfficeIds(Long officeId, boolean isAdmin)

// Check if user can access specific office
boolean canAccessOffice(Long userOfficeId, Long targetOfficeId, boolean isAdmin)

// Get all child offices
List<Office> getChildOffices(Long officeId)
```

**Access Rules**:
- **ADMIN**: Can access their office + ALL child offices (recursive)
- **USER**: Can ONLY access their assigned office
- **SUPER_ADMIN**: Can access ALL offices

#### C. Updated Services

**PurchaseService.java**
```java
// New method for office-based purchase retrieval
public List<PurchaseDTO> getPurchasesForUser(Long officeId, boolean isAdmin) {
    List<Long> accessibleOfficeIds = officeHierarchyService
        .getAccessibleOfficeIds(officeId, isAdmin);
    return purchaseRepository.findByOfficeIdsAndIsActiveTrue(accessibleOfficeIds);
}
```

**DesignationService.java** - Added:
```java
// Get user's primary office
Long getPrimaryOfficeId(Long userId)

// Check if user is admin
boolean isUserAdmin(Long userId)
```

#### D. Updated DTOs

**PurchaseDTO.java**
- Added `officeId` field
- Added `officeName` field
- Used in API responses to show which office a purchase belongs to

---

### 3. **Frontend Changes**

#### A. Simplified Policies

**Location**: `frontend/src/lib/policies.ts`

**New Role Structure**:
```typescript
SUPER_ADMIN  // Full system access
ADMIN        // Office admin with purchasing power
USER         // Regular user, limited access
```

**Key Policy Functions**:
```typescript
// Check if user can access office data
canAccessOfficeData(userRole, userOfficeId, targetOfficeId, childOfficeIds)

// Check purchasing power
hasPurchasingPower(userRole)

// Office-specific permission checks
canManageOfficeItems(userRole, userOfficeId, targetOfficeId, action, childOfficeIds)
canManageOfficePurchases(userRole, userOfficeId, targetOfficeId, action, childOfficeIds)
canManageOfficeDistributions(userRole, userOfficeId, targetOfficeId, action, childOfficeIds)
```

---

## 🏢 Office Hierarchy Example

```
Vice Chancellor Office (ADMIN: admin_vc, USER: user_vc)
├── Computer Science Dept (ADMIN: admin_cse, USER: user_cse)
│   └── Can be accessed by admin_vc (parent) and admin_cse (self)
├── Software Engineering Dept (ADMIN: admin_se, USER: user_se)
│   └── Can be accessed by admin_vc (parent) and admin_se (self)
└── Physics Dept (ADMIN: admin_phy, USER: user_phy)
    └── Can be accessed by admin_vc (parent) and admin_phy (self)
```

**Access Control**:
- `admin_vc`: Can see purchases/inventory for VC Office, CSE, SE, Physics
- `user_vc`: Can ONLY see purchases/inventory for VC Office
- `admin_cse`: Can ONLY see purchases/inventory for CSE Dept
- `user_cse`: Can ONLY see purchases/inventory for CSE Dept

---

## 📊 Data Isolation

### Purchases
- Each purchase is linked to the office of the user who created it
- `purchases.office_id` = office_id from user's primary designation
- Admin sees: Own office purchases + child office purchases
- User sees: Only own office purchases

### Distributions
- Already linked to offices via `item_distributions.office_id`
- Same access rules apply

### Movements
- Track items moving between offices
- `item_movements.from_office_id` and `to_office_id`
- Visible to users involved in either source or destination office

### Office Inventory
- `office_inventory` table maintains inventory per office
- Each office tracks its own item quantities
- Separate from global item counts

---

## 🔐 Security Implementation

### Backend Controllers (To be implemented)
Controllers should:
1. Get user's office ID from their designation
2. Check if user is admin
3. Get accessible office IDs
4. Filter queries by accessible offices

**Example Pattern**:
```java
@GetMapping("/purchases")
public List<PurchaseDTO> getPurchases(@AuthenticationPrincipal User user) {
    Long officeId = designationService.getPrimaryOfficeId(user.getId());
    boolean isAdmin = designationService.isUserAdmin(user.getId());
    return purchaseService.getPurchasesForUser(officeId, isAdmin);
}
```

### Frontend Components (To be implemented)
- Filter data by user's accessible offices
- Hide actions that user cannot perform
- Use `canPerformAction()` before showing buttons/links
- Pass `childOfficeIds` from context to policy functions

---

## 🚀 Migration Path

### Existing Data
1. **Run the migration**: The new changelog will:
   - Add `office_id` column to purchases
   - Populate it from user's primary designation
   - Update role structure

2. **User Migration**: 
   - No action needed - roles automatically migrate
   - DEPARTMENT_HEAD, FACULTY_ADMIN → ROLE_ADMIN
   - FACULTY_MEMBER, STAFF, STUDENT → ROLE_USER

### New Deployments
1. Run migrations: `mvn liquibase:update`
2. Restart backend server
3. Clear frontend cache
4. Users log in with existing credentials

---

## 📝 Database Seed

Each office has two users:
- `admin_{office_code}` - ADMIN role (can purchase and manage)
- `user_{office_code}` - USER role (view and request only)

**Example**:
- CSE Department: `admin_cse` / `user_cse`
- VC Office: `admin_vc` / `user_vc`

All passwords: `password`

---

## ⚙️ Configuration

No additional configuration needed. The system:
- Uses existing database connection
- Leverages Liquibase for migrations
- Maintains backward compatibility with existing data

---

## 🎯 Next Steps

### Backend Controllers
Update controllers to use office-based filtering:
```java
// In PurchaseController, ItemController, DistributionController, etc.
- Get user's office and admin status
- Use getPurchasesForUser() instead of getAllPurchases()
- Validate office access before create/update/delete
```

### Frontend Services
```typescript
// In purchase_service.ts, distribution_service.ts, etc.
- API responses now include officeId and officeName
- Filter displayed data based on user's accessible offices
- Fetch child office IDs from user's office
```

### Frontend Components
```typescript
// In pages and components
- Show office name in purchase/distribution lists
- Add office filter dropdown
- Respect canPerformAction() for button visibility
```

---

## 🐛 Troubleshooting

### Issue: "User does not have an assigned office"
**Solution**: Ensure user has at least one designation with an office assigned in the `designations` table.

### Issue: "Cannot access purchases from other offices"
**Check**:
1. User's role (ADMIN can see child offices, USER cannot)
2. Office hierarchy (is target office a child?)
3. User's primary designation is set correctly

### Issue: Migration fails
**Solution**: 
1. Check if columns already exist
2. Verify foreign key constraints
3. Review Liquibase changelog execution order

---

## 📚 Files Modified

### Backend
- `db/changelog/db.changelog-add-office-to-transactions.xml` (NEW)
- `db/changelog/db.changelog-master.xml` (UPDATED)
- `model/Purchase.java` (UPDATED - added office field)
- `dto/PurchaseDTO.java` (UPDATED - added office fields)
- `service/OfficeHierarchyService.java` (NEW)
- `service/PurchaseService.java` (UPDATED - office-based filtering)
- `service/DesignationService.java` (UPDATED - added helper methods)
- `service/DesignationServiceImpl.java` (UPDATED)
- `repository/OfficeRepository.java` (UPDATED - added hierarchy queries)
- `repository/PurchaseRepository.java` (UPDATED - office-based queries)
- `repository/ItemDistributionRepository.java` (UPDATED)
- `repository/ItemMovementRepository.java` (UPDATED)
- `repository/DesignationRepository.java` (UPDATED)

### Frontend
- `lib/policies.ts` (REPLACED - simplified role structure)
- `lib/policies-old.ts` (BACKUP of old policies)

---

## 📖 Summary

✅ **Office-Based Inventory**: Each office maintains separate inventory  
✅ **Simplified Roles**: Just ADMIN (with purchasing power) and USER  
✅ **Hierarchical Access**: Parents can view child office data  
✅ **Transaction Tracking**: All purchases/distributions tied to offices  
✅ **Automatic Migration**: Existing roles and data migrate automatically  

The system now provides **true multi-tenant inventory management** where each office operates independently while maintaining hierarchical oversight capabilities for administrators.
