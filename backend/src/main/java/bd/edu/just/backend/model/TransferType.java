package bd.edu.just.backend.model;

public enum TransferType {
    ALLOCATION,  // Assign to office from central inventory
    TRANSFER,    // Move between offices
    MOVEMENT,    // Employee transfer with item
    RETURN       // Return to office
}
