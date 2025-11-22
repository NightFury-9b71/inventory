package bd.edu.just.backend.controller;

import bd.edu.just.backend.dto.*;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.service.OfficeDistributionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/office-distributions")
public class OfficeDistributionController {

    @Autowired
    private OfficeDistributionService distributionService;

    /**
     * Distribute items from parent office to child office
     */
    @PostMapping("/distribute")
    public ResponseEntity<?> distributeToChild(@RequestBody OfficeDistributionRequestDTO request) {
        try {
            OfficeTransactionResponseDTO response = distributionService.distributeToChildOffice(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Return items from child office to parent office
     */
    @PostMapping("/return")
    public ResponseEntity<?> returnToParent(@RequestBody ReturnItemRequestDTO request) {
        try {
            OfficeTransactionResponseDTO response = distributionService.returnToParentOffice(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get all transactions for a specific office
     */
    @GetMapping("/office/{officeId}/transactions")
    public ResponseEntity<List<OfficeTransactionResponseDTO>> getOfficeTransactions(
            @PathVariable Long officeId) {
        try {
            List<OfficeTransactionResponseDTO> transactions = distributionService.getOfficeTransactions(officeId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get transaction history for a specific item
     */
    @GetMapping("/item/{itemId}/history")
    public ResponseEntity<List<OfficeTransactionResponseDTO>> getItemTransactionHistory(
            @PathVariable Long itemId) {
        try {
            List<OfficeTransactionResponseDTO> transactions = distributionService.getItemTransactionHistory(itemId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get pending transactions for an office
     */
    @GetMapping("/office/{officeId}/pending")
    public ResponseEntity<List<OfficeTransactionResponseDTO>> getPendingTransactions(
            @PathVariable Long officeId) {
        try {
            List<OfficeTransactionResponseDTO> transactions = distributionService.getPendingTransactions(officeId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get child offices available for distribution
     */
    @GetMapping("/office/{parentOfficeId}/children")
    public ResponseEntity<List<Office>> getChildOffices(@PathVariable Long parentOfficeId) {
        try {
            List<Office> children = distributionService.getChildOfficesForDistribution(parentOfficeId);
            return ResponseEntity.ok(children);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get parent office for returns
     */
    @GetMapping("/office/{childOfficeId}/parent")
    public ResponseEntity<?> getParentOffice(@PathVariable Long childOfficeId) {
        try {
            Office parent = distributionService.getParentOfficeForReturn(childOfficeId);
            return ResponseEntity.ok(parent);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Get available inventory for an office
     */
    @GetMapping("/office/{officeId}/inventory")
    public ResponseEntity<List<OfficeInventoryDTO>> getOfficeInventory(@PathVariable Long officeId) {
        try {
            List<OfficeInventoryDTO> inventory = distributionService.getOfficeInventory(officeId);
            return ResponseEntity.ok(inventory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get transaction by reference number
     */
    @GetMapping("/reference/{referenceNumber}")
    public ResponseEntity<?> getTransactionByReference(@PathVariable String referenceNumber) {
        try {
            OfficeTransactionResponseDTO transaction = distributionService.getTransactionByReference(referenceNumber);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Get distribution history (items sent to child offices)
     */
    @GetMapping("/office/{officeId}/distributions")
    public ResponseEntity<List<OfficeTransactionResponseDTO>> getDistributionHistory(
            @PathVariable Long officeId) {
        try {
            List<OfficeTransactionResponseDTO> distributions = distributionService.getDistributionHistory(officeId);
            return ResponseEntity.ok(distributions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get return history (items received back from child offices)
     */
    @GetMapping("/office/{officeId}/returns")
    public ResponseEntity<List<OfficeTransactionResponseDTO>> getReturnHistory(
            @PathVariable Long officeId) {
        try {
            List<OfficeTransactionResponseDTO> returns = distributionService.getReturnHistory(officeId);
            return ResponseEntity.ok(returns);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
