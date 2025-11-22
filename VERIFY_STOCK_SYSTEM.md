# Stock System Verification Guide

## Quick Verification Steps

Follow these steps to verify your stock management system is working correctly.

---

## 1. Check Database Connection

First, verify your backend is connected to the database:

```bash
# Check backend logs
cd /home/nextspring/Desktop/inventory/backend
./mvnw spring-boot:run

# Look for successful startup messages:
# ✓ Started BackendApplication
# ✓ Liquibase Update Successful
```

---

## 2. Verify Database Tables

Connect to your MySQL database and verify the key tables exist:

```sql
-- Check if office_inventory table exists
SHOW TABLES LIKE 'office_inventory';

-- Check office_inventory structure
DESCRIBE office_inventory;

-- Check if there's any data
SELECT COUNT(*) as total_inventory_records FROM office_inventory;

-- View sample inventory data
SELECT 
    oi.id,
    o.name as office_name,
    i.name as item_name,
    i.code as item_code,
    oi.quantity,
    oi.last_updated
FROM office_inventory oi
JOIN office o ON oi.office_id = o.id
JOIN item i ON oi.item_id = i.id
WHERE oi.quantity > 0
ORDER BY oi.last_updated DESC
LIMIT 10;
```

---

## 3. Check Purchases Data

Verify purchases are creating inventory:

```sql
-- Count total purchases
SELECT COUNT(*) as total_purchases FROM purchase WHERE is_active = TRUE;

-- View recent purchases with office info
SELECT 
    p.id,
    p.vendor_name,
    o.name as office_name,
    p.purchase_date,
    p.total_price,
    u.name as purchased_by
FROM purchase p
JOIN office o ON p.office_id = o.id
JOIN user u ON p.purchased_by_id = u.id
WHERE p.is_active = TRUE
ORDER BY p.purchase_date DESC
LIMIT 10;

-- Check purchase items
SELECT 
    pi.id,
    i.name as item_name,
    i.code as item_code,
    pi.quantity,
    pi.unit_price,
    pi.total_price
FROM purchase_item pi
JOIN item i ON pi.item_id = i.id
JOIN purchase p ON pi.purchase_id = p.id
WHERE p.is_active = TRUE
ORDER BY pi.id DESC
LIMIT 10;
```

---

## 4. Check Distributions Data

Verify distributions are recorded:

```sql
-- Count total distributions
SELECT COUNT(*) as total_distributions FROM item_distribution WHERE is_active = TRUE;

-- View recent distributions
SELECT 
    id.id,
    i.name as item_name,
    fo.name as from_office,
    too.name as to_office,
    id.quantity,
    id.transfer_type,
    id.status,
    id.date_distributed
FROM item_distribution id
JOIN item i ON id.item_id = i.id
LEFT JOIN office fo ON id.from_office_id = fo.id
LEFT JOIN office too ON id.to_office_id = too.id
WHERE id.is_active = TRUE
ORDER BY id.date_distributed DESC
LIMIT 10;

-- Check distribution types
SELECT 
    transfer_type,
    COUNT(*) as count,
    SUM(quantity) as total_quantity
FROM item_distribution
WHERE is_active = TRUE
GROUP BY transfer_type;
```

---

## 5. Verify Office Inventory Matches Purchases

This query shows if purchases are properly adding to office inventory:

```sql
-- Compare purchase totals vs office inventory
SELECT 
    o.id as office_id,
    o.name as office_name,
    i.id as item_id,
    i.name as item_name,
    COALESCE(SUM(pi.quantity), 0) as purchased_qty,
    COALESCE(oi.quantity, 0) as inventory_qty,
    CASE 
        WHEN COALESCE(oi.quantity, 0) < COALESCE(SUM(pi.quantity), 0) THEN 'Some items distributed/transferred'
        WHEN COALESCE(oi.quantity, 0) = COALESCE(SUM(pi.quantity), 0) THEN 'Matches'
        WHEN COALESCE(oi.quantity, 0) > COALESCE(SUM(pi.quantity), 0) THEN 'Received items from other offices'
        ELSE 'No purchases yet'
    END as status
FROM office o
CROSS JOIN item i
LEFT JOIN purchase p ON p.office_id = o.id AND p.is_active = TRUE
LEFT JOIN purchase_item pi ON pi.purchase_id = p.id AND pi.item_id = i.id
LEFT JOIN office_inventory oi ON oi.office_id = o.id AND oi.item_id = i.id
WHERE o.is_active = TRUE AND i.is_active = TRUE
GROUP BY o.id, o.name, i.id, i.name, oi.quantity
HAVING purchased_qty > 0 OR inventory_qty > 0
ORDER BY o.name, i.name;
```

---

## 6. Test API Endpoints

Use curl or the browser to test the API endpoints:

### Get My Office Inventory
```bash
# First, get your authentication token by logging in
# Then use it to call the API

curl -X GET 'http://localhost:8080/api/office-inventory/my-office' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json'
```

### Get All Purchases
```bash
curl -X GET 'http://localhost:8080/api/purchases' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json'
```

### Get All Distributions
```bash
curl -X GET 'http://localhost:8080/api/distributions' \
  -H 'Authorization: Bearer YOUR_TOKEN_HERE' \
  -H 'Content-Type: application/json'
```

---

## 7. Frontend Verification

### Test Purchase Flow
1. Open http://localhost:3000
2. Login with valid credentials
3. Go to **Purchases** page
4. Click **"Add Purchase"**
5. Fill in the form:
   - Vendor: "Test Vendor"
   - Item: Select any item
   - Quantity: 10
   - Unit Price: 100
6. Submit
7. Verify:
   - Purchase appears in list
   - Total price calculated correctly (10 × 100 = 1000)

### Test Inventory Page
1. Go to **Inventory** page
2. Verify:
   - You see items from your office
   - Quantities match your purchases
   - Office name is displayed
   - Stock status badges show correctly:
     - Green: In Stock (qty > 10)
     - Orange: Low Stock (1-10)
     - Red: Out of Stock (0)

### Test Distribution Flow
1. Go to **Distributions** page
2. Click **"New Transfer"**
3. Verify:
   - "Transferring From" shows your office
   - Item dropdown shows items from YOUR office inventory (not all items)
   - Destination office dropdown shows other offices (not your own)
4. Fill in the form:
   - Item: Select from your inventory
   - To Office: Select another office
   - Quantity: Enter a valid amount (≤ available)
   - Date: Today's date
5. Submit
6. Verify:
   - Transfer appears in distributions list
   - Go back to Inventory page
   - Your office's quantity should have decreased

---

## 8. Common Scenarios to Test

### Scenario 1: New Office with No Inventory
**Expected Behavior:**
- Inventory page shows "No inventory items found"
- Distributions page can't create transfers (no items to transfer)
- Need to create purchases first

### Scenario 2: Transfer More Than Available
**Expected Behavior:**
- Form validation prevents submission
- Error message: "Quantity exceeds available inventory"
- Transfer button is disabled

### Scenario 3: Transfer to Same Office
**Expected Behavior:**
- Your office is excluded from destination dropdown
- If somehow selected, validation should prevent it
- Error: "Cannot transfer to your own office"

### Scenario 4: Admin Viewing Child Office Inventory
**Expected Behavior:**
- Admin sees inventory from their office + all child offices
- Each row shows which office the inventory belongs to
- Can filter/search across all accessible offices

---

## 9. Debug Checklist

If things aren't working, check:

### Backend Issues
- [ ] Backend is running (`./mvnw spring-boot:run`)
- [ ] No errors in backend console
- [ ] Database connection successful
- [ ] Liquibase migrations ran successfully
- [ ] All tables created correctly

### Frontend Issues
- [ ] Frontend is running (`npm run dev`)
- [ ] No console errors in browser (F12 → Console)
- [ ] User is logged in with valid session
- [ ] User has an assigned office (check user profile)
- [ ] Network tab shows successful API calls (200 OK)

### Data Issues
- [ ] Purchases exist in database
- [ ] Office inventory table has records
- [ ] User's office has inventory items
- [ ] Office IDs match between tables

### Permission Issues
- [ ] User has correct role (USER or ADMIN)
- [ ] User is assigned to an office
- [ ] User's office exists and is active
- [ ] Policies allow user to access the pages

---

## 10. SQL Queries for Troubleshooting

### Find offices without inventory
```sql
SELECT o.id, o.name, o.code
FROM office o
LEFT JOIN office_inventory oi ON oi.office_id = o.id
WHERE o.is_active = TRUE
GROUP BY o.id, o.name, o.code
HAVING COUNT(oi.id) = 0;
```

### Find items never purchased
```sql
SELECT i.id, i.name, i.code, i.quantity as global_stock
FROM item i
LEFT JOIN purchase_item pi ON pi.item_id = i.id
WHERE i.is_active = TRUE
GROUP BY i.id, i.name, i.code, i.quantity
HAVING COUNT(pi.id) = 0;
```

### Find mismatches between global stock and office inventory
```sql
SELECT 
    i.id,
    i.name,
    i.code,
    i.quantity as global_stock,
    COALESCE(SUM(oi.quantity), 0) as total_office_stock,
    i.quantity - COALESCE(SUM(oi.quantity), 0) as difference
FROM item i
LEFT JOIN office_inventory oi ON oi.item_id = i.id
WHERE i.is_active = TRUE
GROUP BY i.id, i.name, i.code, i.quantity
HAVING ABS(i.quantity - COALESCE(SUM(oi.quantity), 0)) > 0;
```

### Check user office assignments
```sql
SELECT 
    u.id,
    u.username,
    u.name,
    u.role,
    d.office_id,
    o.name as office_name
FROM user u
LEFT JOIN designation d ON d.user_id = u.id AND d.is_primary = TRUE
LEFT JOIN office o ON o.id = d.office_id
WHERE u.is_active = TRUE;
```

---

## Expected Results Summary

After proper setup, you should see:

1. **Purchases Page:** ✅
   - List of purchases with office names
   - Can create new purchases
   - Purchases add to office inventory automatically

2. **Inventory Page:** ✅
   - Shows items in your office
   - Correct quantities
   - Stock status indicators
   - Search and filter working

3. **Distributions Page:** ✅
   - List of all transfers
   - Can create new transfers
   - Transfers update office inventory
   - From/To offices shown correctly

4. **Database:** ✅
   - `office_inventory` has records
   - `purchase` has records
   - `item_distribution` has records
   - Data consistency maintained

---

## Need Help?

If you're still having issues after following this guide:

1. Check backend logs for errors
2. Check browser console for API errors
3. Verify database data using the SQL queries above
4. Ensure user has proper office assignment and permissions
5. Review the STOCK_MANAGEMENT_GUIDE.md for system architecture

The system is designed to work correctly if:
- Backend is running
- Database is properly set up
- User is assigned to an office
- Purchases have been created
