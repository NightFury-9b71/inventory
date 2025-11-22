# Office Admin & Inventory Management Guide

## Overview

This inventory management system is designed with **office-based access control**. Each user is assigned to an office, and their role determines what they can access and manage.

## User Roles

### 1. **SUPER_ADMIN**
- **Access**: All offices system-wide
- **Permissions**: Full access to all features
- **Use Case**: System administrators, top management

### 2. **ADMIN** (Office Administrator)
- **Access**: Their assigned office + all child offices (hierarchical)
- **Permissions**: 
  - ✅ Create purchases for their office
  - ✅ Manage transfers between accessible offices
  - ✅ View and manage inventory for accessible offices
  - ✅ Full CRUD on items, categories, units
  - ✅ View reports and analytics for accessible offices
- **Use Case**: Department heads, office managers with purchasing authority

### 3. **USER** (Regular User)
- **Access**: ONLY their assigned office
- **Permissions**:
  - ❌ Cannot create purchases
  - ✅ Can create distributions (within their office)
  - ✅ View inventory for their office only
  - ✅ View items, categories, units (read-only)
  - ✅ View reports for their office
- **Use Case**: Regular staff members without purchasing power

## Key Features

### 📦 Purchase Management

**How it works:**
1. Only **ADMIN** and **SUPER_ADMIN** can create purchases
2. When a purchase is created:
   - Items are assigned to the **purchaser's office**
   - Inventory is automatically updated for that office
   - Global item stock is increased
   - Item instances with barcodes are generated

**Office Assignment:**
- Each purchase is linked to the office of the user who created it
- The purchase will only be visible to:
  - The user who created it
  - Other admins in the same office
  - Admins in parent offices (if hierarchical)
  - SUPER_ADMIN (all purchases)

**Example:**
```
Office Structure:
- Main Office (ID: 1)
  - CS Department (ID: 2)
    - CS Lab (ID: 3)

User: John (ADMIN, assigned to CS Department)
- Can create purchases → assigned to CS Department
- Can view purchases from CS Department and CS Lab
- Cannot view purchases from other departments
```

### 🔄 Transfer/Distribution Management

**Transfer Types:**

1. **ALLOCATION** (Initial Distribution)
   - From: Central inventory (no source office)
   - To: Specific office
   - Effect: Reduces global stock, adds to office inventory

2. **TRANSFER** (Office-to-Office)
   - From: Source office (must have sufficient stock)
   - To: Destination office
   - Effect: 
     - Reduces source office inventory
     - Increases destination office inventory
     - Global stock remains unchanged
   - **Access Control**: User must have access to BOTH offices

3. **MOVEMENT** (Employee Assignment)
   - From: Office inventory
   - To: Specific employee
   - Effect: Tracks item assignment to individuals

4. **RETURN** (Return from Employee)
   - From: Employee
   - To: Office inventory
   - Effect: Returns items back to office stock

**Important Rules:**
- Users can only create transfers within their accessible offices
- ADMIN can transfer between their office and child offices
- USER can only transfer within their own office
- Stock validation checks office-specific inventory, not just global stock

### 📊 Inventory Management

**Office Inventory System:**

Each office maintains its own inventory separate from global stock:

- **Global Stock**: Total items purchased (Item.quantity)
- **Office Inventory**: Items available in each specific office (OfficeInventory.quantity)

**How Inventory Updates:**

1. **After Purchase:**
   ```
   Purchase 10 laptops → CS Department
   - Global Stock: +10 laptops
   - CS Department Inventory: +10 laptops
   ```

2. **After Transfer:**
   ```
   Transfer 5 laptops: CS Department → CS Lab
   - Global Stock: unchanged
   - CS Department Inventory: -5 laptops
   - CS Lab Inventory: +5 laptops
   ```

3. **After Allocation:**
   ```
   Allocate 3 laptops → Faculty Office
   - Global Stock: -3 laptops
   - Faculty Office Inventory: +3 laptops
   ```

**Viewing Inventory:**
- The `/inventory` page shows inventory for ALL accessible offices
- ADMIN sees: Their office + all child offices
- USER sees: Only their office
- Each row shows: Office Name, Item, Quantity, Status

## Access Control Flow

### Purchase Creation Flow
```
1. User clicks "Add Purchase"
2. System checks: Does user have purchasing power? (ADMIN/SUPER_ADMIN)
   - NO → Button is hidden (Can component)
   - YES → Continue
3. User fills purchase form
4. Backend receives request:
   - Gets user's office from their designation
   - Creates purchase linked to that office
   - Updates office inventory
5. Purchase is saved and visible to users with access to that office
```

### Viewing Purchases Flow
```
1. User opens /purchases page
2. Frontend calls: getPurchases()
3. Backend:
   - Gets current user
   - Gets user's office ID
   - Checks user's role (ADMIN or USER)
   - Calculates accessible office IDs:
     * SUPER_ADMIN: All offices
     * ADMIN: User's office + child offices
     * USER: Only user's office
   - Filters purchases by accessible offices
4. Returns filtered list
5. Frontend displays purchases with office name column
```

### Transfer Creation Flow
```
1. User clicks "New Transfer"
2. System checks: Can user create transfers?
   - NO → Button is hidden
   - YES → Continue
3. User selects:
   - Transfer type (ALLOCATION/TRANSFER/etc.)
   - Source office (for TRANSFER type)
   - Destination office
   - Item and quantity
4. Backend validates:
   - User has access to both offices (if TRANSFER)
   - Source office has sufficient stock (if TRANSFER)
   - Item exists and has stock (if ALLOCATION)
5. Backend updates:
   - Office inventories (source -qty, destination +qty)
   - Global stock (if ALLOCATION)
6. Transfer is saved and visible to users with access to involved offices
```

## Frontend Pages

### 📋 Purchases Page (`/purchases`)
- **Displays**: Purchases for accessible offices only
- **Shows**: Office name, vendor, items, total price, date, purchased by
- **Actions**: 
  - View details
  - Edit (if user has permission and access to office)
  - Delete (if user has permission)
- **Create**: Only visible to ADMIN/SUPER_ADMIN

### 🔄 Distributions Page (`/distributions`)
- **Displays**: Transfers for accessible offices only
- **Shows**: From office, to office, item, quantity, type, status
- **Filters**: By transfer type, status
- **Actions**:
  - View details
  - Edit (if user has permission)
  - Delete (if user has permission)
- **Create**: Visible to users with create permission

### 📦 Inventory Page (`/inventory`)
- **Displays**: Real-time inventory for accessible offices
- **Shows**: Office name, item code, item name, quantity, stock status
- **Stats**: Total items, total quantity, low stock alerts, out of stock
- **Features**:
  - Search items across offices
  - Color-coded stock levels (green/orange/red)
  - Automatic stock status badges

## Backend Implementation

### Key Services

1. **UserOfficeAccessService**
   - Determines which offices a user can access
   - Returns list of accessible office IDs
   - Checks if user can access specific office

2. **OfficeInventoryService**
   - Manages office-specific inventory
   - Handles transfers between offices
   - Validates stock availability
   - Adjusts inventory quantities

3. **PurchaseService**
   - Creates purchases linked to user's office
   - Generates barcodes for items
   - Updates office inventory after purchase
   - Filters purchases by accessible offices

4. **ItemDistributionService**
   - Handles all types of transfers
   - Updates office inventories accordingly
   - Validates office access permissions
   - Filters distributions by accessible offices

### Repository Queries

Custom queries for office-based filtering:

```java
// PurchaseRepository
@Query("SELECT p FROM Purchase p WHERE p.office.id IN :officeIds AND p.isActive = true")
List<Purchase> findByOfficeIdsAndIsActiveTrue(@Param("officeIds") List<Long> officeIds);

// ItemDistributionRepository  
@Query("SELECT d FROM ItemDistribution d WHERE (d.fromOffice.id IN :officeIds OR d.toOffice.id IN :officeIds) AND d.isActive = true")
List<ItemDistribution> findByOfficeIdsAndIsActiveTrue(@Param("officeIds") List<Long> officeIds);
```

## Best Practices

### For Office Admins

1. **Purchase Items for Your Office**
   - Always verify you're purchasing for the correct office
   - Items will be automatically added to your office inventory
   - Your office name will be displayed on the purchase record

2. **Transfer Between Offices**
   - Use TRANSFER type for office-to-office movements
   - Check source office inventory before transferring
   - Ensure you have access to both source and destination offices

3. **Monitor Inventory**
   - Regularly check inventory page for stock levels
   - Watch for low stock and out-of-stock alerts
   - Plan purchases based on your office's needs

4. **Manage Child Offices**
   - As an ADMIN, you can view and manage child offices
   - Help coordinate transfers between your office and sub-offices
   - Monitor inventory across your entire department

### For Users

1. **View Only Your Office**
   - You can only see purchases and inventory for your office
   - Request purchases through your office admin
   - Use distributions to request items if needed

2. **Request Items**
   - Use the distribution system to request items
   - Provide clear remarks for transfer requests
   - Track status of your requests

## Troubleshooting

### "Insufficient stock in source office"
**Problem**: Trying to transfer more items than available in source office
**Solution**: 
- Check office inventory for current stock levels
- Reduce transfer quantity
- Request items from another office first

### "Cannot see purchase/transfer"
**Problem**: Purchase or transfer not visible in list
**Solution**:
- Verify the record belongs to your office or child offices
- Check if you have USER role (limited to own office only)
- Contact your office admin or SUPER_ADMIN

### "Cannot create purchase"
**Problem**: Add Purchase button not visible
**Solution**:
- You need ADMIN or SUPER_ADMIN role to create purchases
- Contact your office administrator to create purchases
- Request role change from system administrator if needed

### "Cannot transfer between offices"
**Problem**: Cannot select certain offices in transfer form
**Solution**:
- You can only transfer to/from accessible offices
- ADMIN: Your office + child offices only
- USER: Only your own office
- Contact SUPER_ADMIN for transfers outside your hierarchy

## Database Schema

### Key Tables

**Purchase**
- `id`: Purchase ID
- `office_id`: **Office that made the purchase**
- `purchased_by_id`: User who created purchase
- `vendor_name`: Supplier name
- `total_price`: Total cost
- `is_active`: Soft delete flag

**ItemDistribution**
- `id`: Distribution ID
- `from_office_id`: Source office (nullable for ALLOCATION)
- `to_office_id`: Destination office
- `item_id`: Item being transferred
- `quantity`: Amount transferred
- `transfer_type`: ALLOCATION, TRANSFER, MOVEMENT, RETURN
- `status`: PENDING, APPROVED, COMPLETED, CANCELLED

**OfficeInventory**
- `office_id`: Office
- `item_id`: Item
- `quantity`: **Available quantity in this office**

**Office**
- `id`: Office ID
- `name`: Office name
- `parent_office_id`: Parent office (for hierarchy)

## Summary

✅ **Purchases** are office-specific → assigned to purchaser's office → inventory updated for that office

✅ **Transfers** move items between offices → source office loses stock, destination gains stock

✅ **Inventory** is office-specific → each office tracks its own stock levels

✅ **Access Control** is role-based and office-based → ADMIN sees hierarchy, USER sees only their office

✅ **Stock Management** is automatic → purchases and transfers update inventory in real-time

This system ensures that each office admin can independently manage their office's inventory while maintaining visibility and control over their department's resources.
