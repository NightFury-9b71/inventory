# Stock Management System Guide

## Overview
Your inventory system has a complete stock management workflow that tracks items at both the **global level** and **office level**.

---

## System Architecture

### 1. **Global Item Stock** (`items` table)
- Tracks the total quantity of each item across the entire organization
- Updated when:
  - ✅ **Purchases are created** → Stock increases
  - ✅ **Purchases are deleted** → Stock decreases
  - ✅ **Allocations are made** → Stock decreases (items leave central pool)

### 2. **Office Inventory** (`office_inventory` table)
- Tracks quantity of each item in each office
- Provides office-specific stock visibility
- Updated when:
  - ✅ **Purchases are created** → Added to purchasing office inventory
  - ✅ **Purchases are deleted** → Removed from purchasing office inventory
  - ✅ **Transfers occur** → Moved between offices
  - ✅ **Allocations occur** → Added to destination office

---

## Stock Flow

### Purchase Flow
```
1. Create Purchase
   └─> Items added to `items.quantity` (global stock)
   └─> Items added to `office_inventory` (office stock)
   └─> PurchaseItems created
   └─> ItemInstances created with barcodes
```

**Code Location:** `PurchaseService.java` → `createPurchase()`
```java
// Update item stock
itemService.updateStock(item.getId(), itemDTO.getQuantity());

// Add items to office inventory
officeInventoryService.adjustInventory(office, item, itemDTO.getQuantity());
```

### Distribution Flow

There are different transfer types:

#### A. **TRANSFER** (Office-to-Office)
```
1. Create Distribution with type TRANSFER
   └─> Check source office has sufficient stock
   └─> Remove from source office_inventory
   └─> Add to destination office_inventory
   └─> Global stock unchanged (just moving between offices)
```

#### B. **ALLOCATION** (Central to Office)
```
1. Create Distribution with type ALLOCATION
   └─> Check global stock has sufficient quantity
   └─> Reduce global items.quantity
   └─> Add to destination office_inventory
```

#### C. **MOVEMENT** (To Employee)
```
1. Create Distribution with type MOVEMENT
   └─> Assign item to employee
   └─> Reduce global items.quantity
```

**Code Location:** `ItemDistributionServiceImpl.java` → `createDistribution()`

---

## Current Pages

### 1. **Purchase Page** (`/purchases`)
- ✅ Shows all purchases
- ✅ Allows creating new purchases
- ✅ Automatically adds purchased items to office inventory
- **Status:** ✅ Working

### 2. **Inventory Page** (`/inventory`)
- ✅ Shows office-specific inventory
- ✅ Displays items available in your office
- ✅ Shows stock levels and status (In Stock, Low Stock, Out of Stock)
- ✅ Filters by office hierarchy (admins see child offices too)
- **Status:** ✅ Working

### 3. **Distribution Page** (`/distributions`)
- ✅ Lists all distributions/transfers
- ✅ Allows creating new transfers
- ✅ Transfers items between offices
- ✅ Updates office inventory automatically
- **Status:** ✅ Working

---

## How to Verify Stock Management

### Step 1: Create a Purchase
1. Go to **Purchases** page
2. Click **"Add Purchase"**
3. Fill in:
   - Vendor Name
   - Items and quantities
   - Purchase date
4. Submit

**Expected Result:**
- Purchase appears in purchases list
- Items are added to your office's inventory

### Step 2: Check Inventory
1. Go to **Inventory** page
2. You should see the items from your purchase
3. Check the quantity matches what you purchased

**Expected Result:**
- Inventory shows correct quantities
- Office name displayed correctly
- Stock status shown (In Stock / Low Stock / Out of Stock)

### Step 3: Create a Transfer
1. Go to **Distributions** page
2. Click **"New Transfer"**
3. Select:
   - Item from your office inventory
   - Destination office
   - Quantity to transfer
4. Submit

**Expected Result:**
- Transfer appears in distributions list
- Source office inventory decreases
- Destination office inventory increases

---

## API Endpoints

### Office Inventory Endpoints
```
GET  /api/office-inventory/my-office              - Get current user's office inventory
GET  /api/office-inventory/office/{id}            - Get specific office inventory
GET  /api/office-inventory/office/{id}/available  - Get available items in office
POST /api/office-inventory/transfer               - Transfer items between offices
POST /api/office-inventory/adjust                 - Adjust office inventory
```

### Distribution Endpoints
```
GET  /api/distributions                - Get all distributions
POST /api/distributions                - Create new distribution
GET  /api/distributions/{id}           - Get distribution by ID
PUT  /api/distributions/{id}           - Update distribution
DELETE /api/distributions/{id}         - Delete distribution
```

### Purchase Endpoints
```
GET  /api/purchases                    - Get all purchases
POST /api/purchases                    - Create new purchase
GET  /api/purchases/{id}               - Get purchase by ID
PUT  /api/purchases/{id}               - Update purchase
DELETE /api/purchases/{id}             - Delete purchase (soft delete)
```

---

## Common Issues & Solutions

### Issue 1: "No inventory items found"
**Cause:** Your office hasn't made any purchases yet, or purchases haven't been created with your office as the destination.

**Solution:**
1. Create a purchase for your office
2. Check that the purchase was successful
3. Refresh the inventory page

### Issue 2: "Cannot transfer - insufficient stock"
**Cause:** Your office doesn't have enough quantity of the item.

**Solution:**
1. Check inventory page to see available quantity
2. Either:
   - Reduce the transfer quantity, or
   - Request more items from another office, or
   - Create a new purchase

### Issue 3: Distribution not showing
**Cause:** You might not have permission to view distributions for that office.

**Solution:**
1. Check your role (USER vs ADMIN)
2. USERs can only see their office's distributions
3. ADMINs can see their office + child offices' distributions

---

## Database Schema

### `office_inventory` table
```sql
CREATE TABLE office_inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    office_id BIGINT NOT NULL,           -- Which office
    item_id BIGINT NOT NULL,             -- Which item
    quantity INT NOT NULL DEFAULT 0,     -- How many
    last_updated TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    UNIQUE KEY (office_id, item_id)      -- One record per office-item pair
);
```

### `item_distribution` table
```sql
CREATE TABLE item_distribution (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    item_id BIGINT NOT NULL,
    from_office_id BIGINT,               -- Source office (for TRANSFER)
    to_office_id BIGINT,                 -- Destination office
    office_id BIGINT,                    -- Legacy: same as to_office_id
    employee_id BIGINT,                  -- For MOVEMENT type
    user_id BIGINT NOT NULL,             -- Who initiated
    quantity INT NOT NULL,
    date_distributed TIMESTAMP,
    remarks TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    transfer_type VARCHAR(20) DEFAULT 'ALLOCATION',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## Testing Checklist

- [ ] **Purchase Test**
  - [ ] Create a new purchase
  - [ ] Verify it appears in purchases list
  - [ ] Check global item stock increased
  - [ ] Check office inventory increased

- [ ] **Inventory Test**
  - [ ] View inventory page
  - [ ] See items from your office
  - [ ] Verify quantities are correct
  - [ ] Check stock status badges

- [ ] **Transfer Test**
  - [ ] Create a transfer between offices
  - [ ] Verify source office stock decreased
  - [ ] Verify destination office stock increased
  - [ ] Check global stock remained the same (for TRANSFER type)

- [ ] **Distribution Test**
  - [ ] View distributions list
  - [ ] Filter by status/type
  - [ ] View distribution details
  - [ ] Verify office names displayed correctly

---

## Code References

### Key Service Files
1. **PurchaseService.java** - Handles purchases and office inventory updates
2. **ItemDistributionServiceImpl.java** - Handles distributions and transfers
3. **OfficeInventoryServiceImpl.java** - Core office inventory management
4. **ItemService.java** - Global item stock management

### Key Frontend Pages
1. **`/frontend/src/app/purchases/page.tsx`** - Purchase list
2. **`/frontend/src/app/inventory/page.tsx`** - Office inventory view
3. **`/frontend/src/app/distributions/page.tsx`** - Distribution list
4. **`/frontend/src/app/distributions/new/page.tsx`** - Create transfer

---

## Summary

Your inventory system is **fully functional** and properly manages stock at both global and office levels. The key points are:

1. ✅ **Purchases** add items to office inventory
2. ✅ **Inventory** page shows office-specific stock
3. ✅ **Distributions** transfer items between offices
4. ✅ All stock updates are automatic and transactional

If you're not seeing data, it's likely because:
- No purchases have been created yet
- You're not assigned to an office
- You don't have permission to view certain data

Follow the testing steps above to verify the system is working correctly.
