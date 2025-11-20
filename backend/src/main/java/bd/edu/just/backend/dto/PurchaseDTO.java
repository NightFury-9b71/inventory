package bd.edu.just.backend.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class PurchaseDTO {
    private Long id;
    private List<PurchaseItemDTO> items = new ArrayList<>();
    private Double totalPrice;
    private String vendorName;
    private String vendorContact;
    private LocalDate purchaseDate;
    private String invoiceNumber;
    private String remarks;
    private Long purchasedById;
    private String purchasedByName;
    private Long officeId;
    private String officeName;
    private Boolean isActive;

    public PurchaseDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public List<PurchaseItemDTO> getItems() { 
        return items; 
    }
    
    public void setItems(List<PurchaseItemDTO> items) { 
        this.items = items; 
    }
    
    public Double getTotalPrice() { 
        return totalPrice; 
    }
    
    public void setTotalPrice(Double totalPrice) { 
        this.totalPrice = totalPrice; 
    }
    
    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }
    
    public String getVendorContact() { return vendorContact; }
    public void setVendorContact(String vendorContact) { this.vendorContact = vendorContact; }
    
    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }
    
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    
    public Long getPurchasedById() { return purchasedById; }
    public void setPurchasedById(Long purchasedById) { this.purchasedById = purchasedById; }
    
    public String getPurchasedByName() { return purchasedByName; }
    public void setPurchasedByName(String purchasedByName) { this.purchasedByName = purchasedByName; }
    
    public Long getOfficeId() { return officeId; }
    public void setOfficeId(Long officeId) { this.officeId = officeId; }
    
    public String getOfficeName() { return officeName; }
    public void setOfficeName(String officeName) { this.officeName = officeName; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
