package bd.edu.just.backend.service;

import bd.edu.just.backend.dto.*;
import bd.edu.just.backend.model.*;
import bd.edu.just.backend.model.OfficeItemTransaction.TransactionStatus;
import bd.edu.just.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OfficeDistributionService {

    @Autowired
    private OfficeItemTransactionRepository transactionRepository;

    @Autowired
    private OfficeRepository officeRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OfficeInventoryService officeInventoryService;

    /**
     * Distribute items from parent office to child office
     */
    public OfficeTransactionResponseDTO distributeToChildOffice(OfficeDistributionRequestDTO request) {
        // Validate offices exist
        Office fromOffice = officeRepository.findById(request.getFromOfficeId())
                .orElseThrow(() -> new RuntimeException("Source office not found"));
        
        Office toOffice = officeRepository.findById(request.getToOfficeId())
                .orElseThrow(() -> new RuntimeException("Destination office not found"));

        // Validate parent-child relationship
        if (!isParentOffice(fromOffice, toOffice)) {
            throw new RuntimeException("Can only distribute to direct child offices. Office " + 
                    fromOffice.getName() + " is not the parent of " + toOffice.getName());
        }

        // Validate item exists
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Validate sufficient stock
        if (!officeInventoryService.hasSufficientStock(fromOffice, item, request.getQuantity())) {
            throw new RuntimeException("Insufficient stock in parent office");
        }

        // Validate user exists
        User initiatedBy = userRepository.findById(request.getInitiatedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create transaction record
        OfficeItemTransaction transaction = OfficeItemTransaction.builder()
                .item(item)
                .fromOffice(fromOffice)
                .toOffice(toOffice)
                .transactionType(TransactionType.DISTRIBUTION)
                .quantity(request.getQuantity())
                .initiatedBy(initiatedBy)
                .status(TransactionStatus.COMPLETED)  // Auto-approve distribution from parent
                .transactionDate(LocalDateTime.now())
                .approvedDate(LocalDateTime.now())
                .approvedBy(initiatedBy)
                .remarks(request.getRemarks())
                .build();

        transaction = transactionRepository.save(transaction);

        // Update inventory
        officeInventoryService.transferItems(fromOffice, toOffice, item, request.getQuantity());

        return mapToResponseDTO(transaction);
    }

    /**
     * Return items from child office to parent office
     */
    public OfficeTransactionResponseDTO returnToParentOffice(ReturnItemRequestDTO request) {
        // Validate offices exist
        Office fromOffice = officeRepository.findById(request.getFromOfficeId())
                .orElseThrow(() -> new RuntimeException("Source office not found"));
        
        Office toOffice = officeRepository.findById(request.getToOfficeId())
                .orElseThrow(() -> new RuntimeException("Destination office not found"));

        // Validate child-parent relationship (reverse of distribution)
        if (!isParentOffice(toOffice, fromOffice)) {
            throw new RuntimeException("Can only return to direct parent office. Office " + 
                    toOffice.getName() + " is not the parent of " + fromOffice.getName());
        }

        // Validate item exists
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Validate sufficient stock to return
        if (!officeInventoryService.hasSufficientStock(fromOffice, item, request.getQuantity())) {
            throw new RuntimeException("Insufficient stock in child office to return");
        }

        // Validate user exists
        User initiatedBy = userRepository.findById(request.getInitiatedByUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create transaction record
        OfficeItemTransaction transaction = OfficeItemTransaction.builder()
                .item(item)
                .fromOffice(fromOffice)
                .toOffice(toOffice)
                .transactionType(TransactionType.RETURN)
                .quantity(request.getQuantity())
                .initiatedBy(initiatedBy)
                .status(TransactionStatus.COMPLETED)  // Auto-approve returns to parent
                .transactionDate(LocalDateTime.now())
                .approvedDate(LocalDateTime.now())
                .approvedBy(initiatedBy)
                .remarks(request.getRemarks() + " | Reason: " + request.getReturnReason())
                .build();

        transaction = transactionRepository.save(transaction);

        // Update inventory (transfer back to parent)
        officeInventoryService.transferItems(fromOffice, toOffice, item, request.getQuantity());

        return mapToResponseDTO(transaction);
    }

    /**
     * Get all transactions for a specific office
     */
    public List<OfficeTransactionResponseDTO> getOfficeTransactions(Long officeId) {
        List<OfficeItemTransaction> transactions = transactionRepository.findByOfficeId(officeId);
        return transactions.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get transaction history for a specific item
     */
    public List<OfficeTransactionResponseDTO> getItemTransactionHistory(Long itemId) {
        List<OfficeItemTransaction> transactions = transactionRepository.findByItemIdOrderByTransactionDateDesc(itemId);
        return transactions.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get pending transactions for an office
     */
    public List<OfficeTransactionResponseDTO> getPendingTransactions(Long officeId) {
        List<OfficeItemTransaction> transactions = transactionRepository.findPendingTransactionsByOfficeId(officeId);
        return transactions.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all child offices that can receive distributions
     */
    public List<Office> getChildOfficesForDistribution(Long parentOfficeId) {
        return officeRepository.findActiveChildOffices(parentOfficeId);
    }

    /**
     * Get parent office for returns
     */
    public Office getParentOfficeForReturn(Long childOfficeId) {
        Office childOffice = officeRepository.findById(childOfficeId)
                .orElseThrow(() -> new RuntimeException("Office not found"));
        
        if (childOffice.getParentOffice() == null) {
            throw new RuntimeException("This office has no parent office to return items to");
        }
        
        return childOffice.getParentOffice();
    }

    /**
     * Get available inventory for an office
     */
    public List<OfficeInventoryDTO> getOfficeInventory(Long officeId) {
        Office office = officeRepository.findById(officeId)
                .orElseThrow(() -> new RuntimeException("Office not found"));
        
        List<OfficeInventory> inventories = officeInventoryService.getAvailableItemsByOffice(office);
        
        return inventories.stream()
                .map(inv -> OfficeInventoryDTO.builder()
                        .officeId(inv.getOffice().getId())
                        .officeName(inv.getOffice().getName())
                        .itemId(inv.getItem().getId())
                        .itemName(inv.getItem().getName())
                        .itemCode(inv.getItem().getCode())
                        .quantity(inv.getQuantity())
                        .unitName(inv.getItem().getUnit() != null ? inv.getItem().getUnit().getName() : "N/A")
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Get transaction by reference number
     */
    public OfficeTransactionResponseDTO getTransactionByReference(String referenceNumber) {
        OfficeItemTransaction transaction = transactionRepository.findByReferenceNumber(referenceNumber)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return mapToResponseDTO(transaction);
    }

    /**
     * Get all distributions made by an office
     */
    public List<OfficeTransactionResponseDTO> getDistributionHistory(Long officeId) {
        List<OfficeItemTransaction> transactions = 
                transactionRepository.findCompletedDistributionsByFromOffice(officeId);
        return transactions.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all returns received by an office
     */
    public List<OfficeTransactionResponseDTO> getReturnHistory(Long officeId) {
        List<OfficeItemTransaction> transactions = 
                transactionRepository.findCompletedReturnsByToOffice(officeId);
        return transactions.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Helper methods

    /**
     * Check if office1 is the parent of office2
     */
    private boolean isParentOffice(Office parent, Office child) {
        if (child.getParentOffice() == null) {
            return false;
        }
        return child.getParentOffice().getId().equals(parent.getId());
    }

    /**
     * Map transaction entity to response DTO
     */
    private OfficeTransactionResponseDTO mapToResponseDTO(OfficeItemTransaction transaction) {
        return OfficeTransactionResponseDTO.builder()
                .id(transaction.getId())
                .itemId(transaction.getItem().getId())
                .itemName(transaction.getItem().getName())
                .itemCode(transaction.getItem().getCode())
                .fromOfficeId(transaction.getFromOffice().getId())
                .fromOfficeName(transaction.getFromOffice().getName())
                .toOfficeId(transaction.getToOffice().getId())
                .toOfficeName(transaction.getToOffice().getName())
                .transactionType(transaction.getTransactionType())
                .quantity(transaction.getQuantity())
                .initiatedByUserId(transaction.getInitiatedBy().getId())
                .initiatedByUserName(transaction.getInitiatedBy().getUsername())
                .approvedByUserId(transaction.getApprovedBy() != null ? transaction.getApprovedBy().getId() : null)
                .approvedByUserName(transaction.getApprovedBy() != null ? transaction.getApprovedBy().getUsername() : null)
                .status(transaction.getStatus())
                .transactionDate(transaction.getTransactionDate())
                .approvedDate(transaction.getApprovedDate())
                .remarks(transaction.getRemarks())
                .rejectionReason(transaction.getRejectionReason())
                .referenceNumber(transaction.getReferenceNumber())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
}
