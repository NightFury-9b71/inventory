package bd.edu.just.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "item_distributions")
public class ItemDistribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne
    @JoinColumn(name = "office_id", nullable = false)
    @JsonIgnore
    private Office office; // Deprecated: kept for backward compatibility

    @ManyToOne
    @JoinColumn(name = "from_office_id")
    @JsonIgnore
    private Office fromOffice;

    @ManyToOne
    @JoinColumn(name = "to_office_id")
    @JsonIgnore
    private Office toOffice;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "date_distributed", nullable = false)
    private LocalDateTime dateDistributed;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DistributionStatus status = DistributionStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "transfer_type", nullable = false)
    private TransferType transferType = TransferType.ALLOCATION;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (dateDistributed == null) {
            dateDistributed = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public ItemDistribution() {}

    public ItemDistribution(Item item, Office office, User user, Integer quantity) {
        this.item = item;
        this.office = office;
        this.toOffice = office; // Set toOffice for backward compatibility
        this.user = user;
        this.quantity = quantity;
        this.isActive = true;
        this.status = DistributionStatus.PENDING;
        this.transferType = TransferType.ALLOCATION;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Office getOffice() {
        return office;
    }

    public void setOffice(Office office) {
        this.office = office;
    }

    public Office getFromOffice() {
        return fromOffice;
    }

    public void setFromOffice(Office fromOffice) {
        this.fromOffice = fromOffice;
    }

    public Office getToOffice() {
        return toOffice;
    }

    public void setToOffice(Office toOffice) {
        this.toOffice = toOffice;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
