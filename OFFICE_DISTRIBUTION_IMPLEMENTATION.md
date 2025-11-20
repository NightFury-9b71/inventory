# Office-Based Item Distribution System

## Overview

This implementation provides a comprehensive system for managing item distributions between parent and child offices with complete transaction tracking and ownership changes.

## Key Features

✅ **Parent-to-Child Distribution**: Only parent offices can distribute items to their direct child offices
✅ **Child-to-Parent Returns**: Child offices can return unwanted items only to their direct parent office
✅ **Ownership Tracking**: Every item distribution results in ownership change
✅ **Transaction Logging**: All transactions are logged with complete audit trail
✅ **Inventory Management**: Automatic inventory updates on both source and destination offices
✅ **Validation**: Business rules enforced (parent-child relationship, sufficient stock)

## Architecture

### Backend Components

#### 1. Models

**OfficeItemTransaction** (`backend/src/main/java/bd/edu/just/backend/model/OfficeItemTransaction.java`)
- Tracks all item movements between offices
- Fields:
  - `item`: The item being transferred
  - `fromOffice`: Source office
  - `toOffice`: Destination office
  - `transactionType`: DISTRIBUTION or RETURN
  - `quantity`: Number of items transferred
  - `status`: PENDING, APPROVED, REJECTED, COMPLETED, CANCELLED
  - `referenceNumber`: Unique transaction identifier
  - `initiatedBy`: User who initiated the transaction
  - `approvedBy`: User who approved the transaction
  - `transactionDate`: When the transaction occurred
  - `remarks`: Additional notes

**TransactionType** (`backend/src/main/java/bd/edu/just/backend/model/TransactionType.java`)
- DISTRIBUTION: Parent office distributing to child office
- RETURN: Child office returning to parent office
- PURCHASE: Initial purchase/acquisition
- ADJUSTMENT: Manual inventory adjustment

#### 2. Repository

**OfficeItemTransactionRepository** (`backend/src/main/java/bd/edu/just/backend/repository/OfficeItemTransactionRepository.java`)

Key query methods:
- `findByOfficeId(Long officeId)`: Get all transactions for an office
- `findByItemIdOrderByTransactionDateDesc(Long itemId)`: Get item history
- `findPendingTransactionsByOfficeId(Long officeId)`: Get pending transactions
- `findCompletedDistributionsByFromOffice(Long officeId)`: Get distribution history
- `findCompletedReturnsByToOffice(Long officeId)`: Get return history

#### 3. Service Layer

**OfficeDistributionService** (`backend/src/main/java/bd/edu/just/backend/service/OfficeDistributionService.java`)

Core methods:
- `distributeToChildOffice(OfficeDistributionRequestDTO)`: Distribute items to child office
  - Validates parent-child relationship
  - Checks sufficient stock
  - Creates transaction record
  - Updates inventory on both offices
  
- `returnToParentOffice(ReturnItemRequestDTO)`: Return items to parent office
  - Validates child-parent relationship
  - Checks sufficient stock to return
  - Creates transaction record
  - Updates inventory on both offices

- `getOfficeTransactions(Long officeId)`: Get all transactions for an office
- `getItemTransactionHistory(Long itemId)`: Get complete item transaction history
- `getOfficeInventory(Long officeId)`: Get available inventory for an office
- `getChildOfficesForDistribution(Long parentOfficeId)`: Get eligible child offices
- `getParentOfficeForReturn(Long childOfficeId)`: Get parent office for returns

#### 4. Controller

**OfficeDistributionController** (`backend/src/main/java/bd/edu/just/backend/controller/OfficeDistributionController.java`)

REST API Endpoints:

**Distribution & Returns:**
- `POST /api/office-distributions/distribute`: Distribute items to child office
- `POST /api/office-distributions/return`: Return items to parent office

**Transaction History:**
- `GET /api/office-distributions/office/{officeId}/transactions`: All transactions for office
- `GET /api/office-distributions/office/{officeId}/distributions`: Distribution history
- `GET /api/office-distributions/office/{officeId}/returns`: Return history
- `GET /api/office-distributions/item/{itemId}/history`: Item transaction history
- `GET /api/office-distributions/reference/{referenceNumber}`: Get transaction by reference

**Office & Inventory:**
- `GET /api/office-distributions/office/{parentOfficeId}/children`: Get child offices
- `GET /api/office-distributions/office/{childOfficeId}/parent`: Get parent office
- `GET /api/office-distributions/office/{officeId}/inventory`: Get office inventory

#### 5. DTOs

**OfficeDistributionRequestDTO**
```java
{
  "itemId": 1,
  "fromOfficeId": 1,
  "toOfficeId": 2,
  "quantity": 5,
  "remarks": "Monthly distribution",
  "initiatedByUserId": 1
}
```

**ReturnItemRequestDTO**
```java
{
  "itemId": 1,
  "fromOfficeId": 2,
  "toOfficeId": 1,
  "quantity": 3,
  "remarks": "Additional notes",
  "returnReason": "No longer needed",
  "initiatedByUserId": 1
}
```

**OfficeTransactionResponseDTO**
Contains complete transaction details including item info, office names, user names, dates, etc.

### Frontend Components

#### 1. Service Layer

**office_distribution_service.ts** (`frontend/src/services/office_distribution_service.ts`)

TypeScript interfaces and API service functions:
- `distributeToChildOffice()`: Distribute items
- `returnToParentOffice()`: Return items
- `getOfficeTransactions()`: Get transactions
- `getOfficeInventory()`: Get inventory
- `getChildOfficesForDistribution()`: Get child offices
- `getParentOfficeForReturn()`: Get parent office

#### 2. Pages

**Main Transactions Page** (`frontend/src/app/office-distributions/page.tsx`)
- View all transactions (distributions and returns)
- Filter by transaction type
- Search by item, reference, or office
- Color-coded transaction types and statuses
- Navigate to distribute or return pages

**Distribute Items Page** (`frontend/src/app/office-distributions/distribute/page.tsx`)
- Select item from office inventory
- Choose child office to receive items
- Specify quantity (validated against available stock)
- Add remarks
- Automatic validation and error handling

**Return Items Page** (`frontend/src/app/office-distributions/return/page.tsx`)
- Select item to return
- Automatically identifies parent office
- Specify return quantity and reason
- Add additional remarks
- Validates availability before submission

## Business Rules

### Distribution Rules
1. **Parent-Child Validation**: Only direct parent offices can distribute to child offices
2. **Stock Validation**: Source office must have sufficient inventory
3. **Ownership Transfer**: Items are removed from parent inventory and added to child inventory
4. **Auto-Approval**: Distributions from parent to child are auto-approved (COMPLETED status)
5. **Audit Trail**: Complete transaction log with reference number

### Return Rules
1. **Child-Parent Validation**: Only direct child offices can return to parent offices
2. **Stock Validation**: Child office must have items to return
3. **Reason Required**: Return reason is mandatory
4. **Ownership Transfer**: Items are removed from child inventory and returned to parent inventory
5. **Auto-Approval**: Returns to parent are auto-approved (COMPLETED status)

### Inventory Management
- **Real-time Updates**: Inventory is updated immediately on transaction completion
- **Accurate Tracking**: Each office maintains its own inventory count
- **Prevention of Negative Stock**: Validation ensures no office goes below zero inventory

## Usage Examples

### Example 1: Distribution Flow

**Scenario**: Main Office distributes 10 laptops to Computer Science Department

1. User from Main Office logs in
2. Navigates to "Office Distributions" → "Distribute to Child Office"
3. Selects "Laptop" from inventory (shows available: 50)
4. Selects "Computer Science Department" as destination
5. Enters quantity: 10
6. Adds remarks: "New semester allocation"
7. Submits form
8. System validates:
   - Main Office is parent of CS Department ✓
   - Main Office has 50 laptops available ✓
9. Transaction created with reference: DIST-1732147890123
10. Inventory updated:
    - Main Office: 50 → 40 laptops
    - CS Department: 0 → 10 laptops
11. Success message with reference number displayed

### Example 2: Return Flow

**Scenario**: Computer Science Department returns 3 laptops to Main Office

1. User from CS Department logs in
2. Navigates to "Office Distributions" → "Return to Parent Office"
3. Selects "Laptop" from inventory (shows available: 10)
4. System automatically shows parent: "Main Office"
5. Enters quantity: 3
6. Enters return reason: "Damaged and needs repair"
7. Adds remarks: "Screen issues"
8. Submits form
9. System validates:
   - Main Office is parent of CS Department ✓
   - CS Department has 10 laptops available ✓
10. Transaction created with reference: RET-1732147901234
11. Inventory updated:
    - CS Department: 10 → 7 laptops
    - Main Office: 40 → 43 laptops
12. Success message with reference number displayed

## Database Schema

### office_item_transactions table

```sql
CREATE TABLE office_item_transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    item_id BIGINT NOT NULL,
    from_office_id BIGINT NOT NULL,
    to_office_id BIGINT NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    initiated_by_user_id BIGINT NOT NULL,
    approved_by_user_id BIGINT,
    status VARCHAR(50) NOT NULL,
    transaction_date DATETIME NOT NULL,
    approved_date DATETIME,
    remarks TEXT,
    rejection_reason TEXT,
    reference_number VARCHAR(100) UNIQUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    FOREIGN KEY (item_id) REFERENCES items(id),
    FOREIGN KEY (from_office_id) REFERENCES offices(id),
    FOREIGN KEY (to_office_id) REFERENCES offices(id),
    FOREIGN KEY (initiated_by_user_id) REFERENCES users(id),
    FOREIGN KEY (approved_by_user_id) REFERENCES users(id)
);
```

## Testing

### Backend Tests
```bash
cd backend
./mvnw test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Security Considerations

1. **Authorization**: Implement role-based access control
   - Only authorized users can distribute/return items
   - Office-level permissions for viewing transactions

2. **Validation**: All inputs are validated on both frontend and backend
   - Parent-child relationship validation
   - Stock availability validation
   - Required fields validation

3. **Audit Trail**: Complete transaction history maintained
   - Who initiated the transaction
   - When it occurred
   - What was transferred
   - Reference numbers for tracking

## Future Enhancements

1. **Approval Workflow**: Add approval process for distributions
2. **Bulk Operations**: Support distributing multiple items at once
3. **Notifications**: Email/SMS notifications for transactions
4. **Reports**: Generate distribution reports (PDF, Excel)
5. **Item Tracking**: Track individual item instances with barcodes
6. **Scheduled Distributions**: Automatic recurring distributions
7. **Return Requests**: Request approval before returning items
8. **Multi-level Cascading**: Distribute through multiple office levels

## Troubleshooting

### Common Issues

**Issue**: "Can only distribute to direct child offices"
- **Solution**: Verify the office hierarchy. Only direct parent-child relationships are allowed.

**Issue**: "Insufficient stock in parent office"
- **Solution**: Check the office inventory. Ensure sufficient items before distributing.

**Issue**: "This office has no parent office"
- **Solution**: Only child offices can return items. Root offices cannot return.

**Issue**: Transaction not appearing
- **Solution**: Refresh the page or check the specific transaction tab (All/Distributions/Returns)

## Support

For questions or issues, please:
1. Check this documentation
2. Review the API endpoint documentation
3. Check application logs for detailed error messages
4. Contact the development team

---

**Last Updated**: November 20, 2025
**Version**: 1.0.0
