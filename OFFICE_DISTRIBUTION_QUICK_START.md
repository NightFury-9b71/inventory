# Office Distribution System - Quick Start Guide

## 🚀 Quick Access

### Backend API Base URL
```
http://localhost:8080/api/office-distributions
```

### Frontend Pages
- **Main Dashboard**: `/office-distributions`
- **Distribute Items**: `/office-distributions/distribute`
- **Return Items**: `/office-distributions/return`

## 📋 Common Operations

### 1. Distribute Items to Child Office

**Steps:**
1. Navigate to `/office-distributions/distribute`
2. Select item from your office inventory
3. Select child office
4. Enter quantity
5. Add remarks (optional)
6. Click "Distribute Items"

**API:**
```bash
POST /api/office-distributions/distribute
Content-Type: application/json

{
  "itemId": 1,
  "fromOfficeId": 1,
  "toOfficeId": 2,
  "quantity": 5,
  "remarks": "Monthly distribution",
  "initiatedByUserId": 1
}
```

### 2. Return Items to Parent Office

**Steps:**
1. Navigate to `/office-distributions/return`
2. Select item from your office inventory
3. Parent office is automatically selected
4. Enter quantity
5. Enter return reason (required)
6. Add additional remarks (optional)
7. Click "Return Items"

**API:**
```bash
POST /api/office-distributions/return
Content-Type: application/json

{
  "itemId": 1,
  "fromOfficeId": 2,
  "toOfficeId": 1,
  "quantity": 3,
  "returnReason": "No longer needed",
  "remarks": "In good condition",
  "initiatedByUserId": 1
}
```

### 3. View Transaction History

**Steps:**
1. Navigate to `/office-distributions`
2. Use the dropdown to filter:
   - All Transactions
   - Distributions (sent to child offices)
   - Returns (received from child offices)
3. Use search box to find specific transactions

**API:**
```bash
# All transactions for an office
GET /api/office-distributions/office/{officeId}/transactions

# Only distributions
GET /api/office-distributions/office/{officeId}/distributions

# Only returns
GET /api/office-distributions/office/{officeId}/returns
```

### 4. Check Office Inventory

**API:**
```bash
GET /api/office-distributions/office/{officeId}/inventory
```

**Response:**
```json
[
  {
    "officeId": 1,
    "officeName": "Main Office",
    "itemId": 1,
    "itemName": "Laptop",
    "itemCode": "LAP-001",
    "quantity": 50,
    "unitName": "pieces"
  }
]
```

### 5. Get Child Offices

**API:**
```bash
GET /api/office-distributions/office/{parentOfficeId}/children
```

### 6. Get Parent Office

**API:**
```bash
GET /api/office-distributions/office/{childOfficeId}/parent
```

### 7. Track Transaction by Reference

**API:**
```bash
GET /api/office-distributions/reference/{referenceNumber}
```

**Example:**
```bash
GET /api/office-distributions/reference/DIST-1732147890123
```

## 🔍 Understanding Transaction Types

### Distribution (Parent → Child)
- **Icon**: ⬇️ Blue badge
- **Status**: Auto-approved (COMPLETED)
- **Direction**: From parent office to child office
- **Reference**: Starts with "DIST-"

### Return (Child → Parent)
- **Icon**: ⬆️ Orange badge
- **Status**: Auto-approved (COMPLETED)
- **Direction**: From child office to parent office
- **Reference**: Starts with "RET-"

## 📊 Transaction Statuses

- **COMPLETED** ✅: Transaction successfully completed
- **PENDING** ⏳: Awaiting approval (future feature)
- **APPROVED** ✓: Approved but not yet completed (future feature)
- **REJECTED** ❌: Transaction rejected
- **CANCELLED** ⊘: Transaction cancelled

## ⚠️ Important Rules

### ✅ Allowed Operations
- Parent office can distribute to **direct child offices only**
- Child office can return to **direct parent office only**
- Must have sufficient inventory to distribute/return
- All transactions are logged with audit trail

### ❌ Not Allowed
- Distributing to non-child offices (siblings, grandchildren, etc.)
- Returning to non-parent offices
- Negative inventory (system prevents this)
- Distributing more than available quantity

## 🎯 User Roles & Permissions

Recommended role-based access:
- **Office Manager**: Can distribute and return items
- **Department Admin**: Can view transaction history
- **Super Admin**: Full access to all operations

## 💡 Tips & Best Practices

1. **Always check inventory first** before attempting to distribute
2. **Use descriptive remarks** for better tracking
3. **Include return reasons** for audit purposes
4. **Save reference numbers** for future tracking
5. **Regularly review transactions** to maintain accurate records

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Can only distribute to direct child offices" | Verify office hierarchy - only direct parent-child relationships work |
| "Insufficient stock" | Check office inventory before distributing |
| "This office has no parent office" | Root offices cannot return items |
| Items not showing in inventory | Ensure items were properly added to office inventory |
| Transaction not appearing | Refresh page or check correct transaction type tab |

## 📞 Support

For technical support:
1. Check the detailed documentation: `OFFICE_DISTRIBUTION_IMPLEMENTATION.md`
2. Review API responses for error messages
3. Check browser console for frontend errors
4. Review backend logs for detailed error information

---

**Version**: 1.0.0
**Last Updated**: November 20, 2025
