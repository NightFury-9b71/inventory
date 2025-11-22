package bd.edu.just.backend.dto;

import java.time.LocalDateTime;

public class ItemDistributionDTO {

    private Long id;
    private Long itemId;
    private String itemName;
    private Long officeId; // Deprecated: kept for backward compatibility
    private String officeName; // Deprecated
    private Long fromOfficeId;
    private String fromOfficeName;
    private Long toOfficeId;
    private String toOfficeName;
    private Long employeeId;
    private String employeeName;
    private Long userId;
    private String userName;
    private Integer quantity;
    private LocalDateTime dateDistributed;
    private String remarks;
    private String status;
    private String transferType;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ItemDistributionDTO() {}

    public ItemDistributionDTO(Long id, Long itemId, String itemName, Long officeId, String officeName,
                              Long userId, String userName, Integer quantity, LocalDateTime dateDistributed,
                              String remarks, String status, Boolean isActive, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.itemId = itemId;
        this.itemName = itemName;
        this.officeId = officeId;
        this.officeName = officeName;
        this.toOfficeId = officeId; // Backward compatibility
        this.toOfficeName = officeName;
        this.userId = userId;
        this.userName = userName;
        this.quantity = quantity;
        this.dateDistributed = dateDistributed;
        this.remarks = remarks;
        this.status = status;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.transferType = "ALLOCATION";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }

    public String getOfficeName() {
        return officeName;
    }

    public void setOfficeName(String officeName) {
        this.officeName = officeName;
    }

    public Long getFromOfficeId() {
        return fromOfficeId;
    }

    public void setFromOfficeId(Long fromOfficeId) {
        this.fromOfficeId = fromOfficeId;
    }

    public String getFromOfficeName() {
        return fromOfficeName;
    }

    public void setFromOfficeName(String fromOfficeName) {
        this.fromOfficeName = fromOfficeName;
    }

    public Long getToOfficeId() {
        return toOfficeId;
    }

    public void setToOfficeId(Long toOfficeId) {
        this.toOfficeId = toOfficeId;
    }

    public String getToOfficeName() {
        return toOfficeName;
    }

    public void setToOfficeName(String toOfficeName) {
        this.toOfficeName = toOfficeName;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getDateDistributed() {
        return dateDistributed;
    }

    public void setDateDistributed(LocalDateTime dateDistributed) {
        this.dateDistributed = dateDistributed;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTransferType() {
        return transferType;
    }

    public void setTransferType(String transferType) {
        this.transferType = transferType;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}