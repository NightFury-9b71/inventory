package bd.edu.just.backend.dto;

import bd.edu.just.backend.model.DistributionStatus;

public class ItemDistributionRequestDTO {

    private Long itemId;
    private Long officeId;
    private Long userId;
    private Integer quantity;
    private String dateDistributed; // Changed to String
    private String remarks;
    private DistributionStatus status;

    public ItemDistributionRequestDTO() {}

    public ItemDistributionRequestDTO(Long itemId, Long officeId, Long userId, Integer quantity,
                                     String dateDistributed, String remarks, DistributionStatus status) {
        this.itemId = itemId;
        this.officeId = officeId;
        this.userId = userId;
        this.quantity = quantity;
        this.dateDistributed = dateDistributed;
        this.remarks = remarks;
        this.status = status;
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
}