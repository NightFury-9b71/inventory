package bd.edu.just.backend.model;

public enum TransactionType {
    DISTRIBUTION,  // Parent office distributing to child office
    RETURN,        // Child office returning to parent office
    PURCHASE,      // Initial purchase/acquisition
    ADJUSTMENT     // Manual inventory adjustment
}
