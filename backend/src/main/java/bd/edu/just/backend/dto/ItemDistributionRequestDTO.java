package bd.edu.just.backend.dto;

import bd.edu.just.backend.model.DistributionStatus;
import bd.edu.just.backend.model.TransferType;

public class ItemDistributionRequestDTO {

    private Long itemId;
    private Long officeId; // Deprecated: kept for backward compatibility
    private Long fromOfficeId;
    private Long toOfficeId;
    private Long employeeId;
    private Long userId;
    private Integer quantity;
    private String dateDistributed; // Changed to String
    private String remarks;
    private DistributionStatus status;
    private TransferType transferType;

    public ItemDistributionRequestDTO() {}

    public ItemDistributionRequestDTO(Long itemId, Long officeId, Long userId, Integer quantity,
                                     String dateDistributed, String remarks, DistributionStatus status) {
        this.itemId = itemId;
        this.officeId = officeId;
        this.toOfficeId = officeId; // Backward compatibility
        this.userId = userId;
        this.quantity = quantity;
        this.dateDistributed = dateDistributed;
        this.remarks = remarks;
        this.status = status;
        this.transferType = TransferType.ALLOCATION;
    }

    // Getters and Setters
    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
        // Also set toOfficeId for backward compatibility
        if (this.toOfficeId == null) {
            this.toOfficeId = officeId;
        }
    }

    public Long getFromOfficeId() {
        return fromOfficeId;
    }

    public void setFromOfficeId(Long fromOfficeId) {
        this.fromOfficeId = fromOfficeId;
    }

    public Long getToOfficeId() {
        return toOfficeId;
    }

    public void setToOfficeId(Long toOfficeId) {
        this.toOfficeId = toOfficeId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getDateDistributed() {
        return dateDistributed;
    }

    public void setDateDistributed(String dateDistributed) {
        this.dateDistributed = dateDistributed;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public DistributionStatus getStatus() {
        return status;
    }

    public void setStatus(DistributionStatus status) {
        this.status = status;
    }

    public TransferType getTransferType() {
        return transferType;
    }

    public void setTransferType(TransferType transferType) {
        this.transferType = transferType;
    }
}