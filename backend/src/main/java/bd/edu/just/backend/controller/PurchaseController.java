package bd.edu.just.backend.controller;

import bd.edu.just.backend.dto.PurchaseDTO;
import bd.edu.just.backend.dto.ItemInstanceDTO;
import bd.edu.just.backend.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/purchases")
// @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PurchaseController {

    @Autowired
    private PurchaseService purchaseService;

    @GetMapping
    public ResponseEntity<List<PurchaseDTO>> getAllPurchases() {
        return ResponseEntity.ok(purchaseService.getAllPurchases());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseDTO> getPurchaseById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(purchaseService.getPurchaseById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<List<PurchaseDTO>> getRecentPurchases() {
        return ResponseEntity.ok(purchaseService.getRecentPurchases());
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<PurchaseDTO>> getPurchasesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(purchaseService.getPurchasesByDateRange(startDate, endDate));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROCUREMENT_MANAGER', 'DEPARTMENT_HEAD')")
    public ResponseEntity<?> createPurchase(@RequestBody PurchaseDTO purchaseDTO) {
        try {
            // Validation
            if (purchaseDTO.getItems() == null || purchaseDTO.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body("At least one item is required");
            }
            
            if (purchaseDTO.getVendorName() == null || purchaseDTO.getVendorName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Vendor name is required");
            }
            
            if (purchaseDTO.getPurchasedById() == null) {
                return ResponseEntity.badRequest().body("Purchased by user ID is required");
            }
            
            // Validate each item
            for (int i = 0; i < purchaseDTO.getItems().size(); i++) {
                var item = purchaseDTO.getItems().get(i);
                if (item.getItemId() == null) {
                    return ResponseEntity.badRequest().body("Item " + (i + 1) + ": Item ID is required");
                }
                if (item.getQuantity() == null || item.getQuantity() <= 0) {
                    return ResponseEntity.badRequest().body("Item " + (i + 1) + ": Quantity must be greater than 0");
                }
                if (item.getUnitPrice() == null || item.getUnitPrice() < 0) {
                    return ResponseEntity.badRequest().body("Item " + (i + 1) + ": Unit price must be 0 or greater");
                }
            }
            
            PurchaseDTO created = purchaseService.createPurchase(purchaseDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating purchase: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROCUREMENT_MANAGER', 'DEPARTMENT_HEAD')")
    public ResponseEntity<PurchaseDTO> updatePurchase(@PathVariable Long id, @RequestBody PurchaseDTO purchaseDTO) {
        try {
            PurchaseDTO updated = purchaseService.updatePurchase(id, purchaseDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PROCUREMENT_MANAGER')")
    public ResponseEntity<Void> deletePurchase(@PathVariable Long id) {
        try {
            purchaseService.deletePurchase(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/barcodes")
    public ResponseEntity<List<ItemInstanceDTO>> getPurchaseBarcodes(@PathVariable Long id) {
        try {
            List<ItemInstanceDTO> barcodes = purchaseService.getItemInstancesByPurchase(id);
            return ResponseEntity.ok(barcodes);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<ItemInstanceDTO> getItemInstanceByBarcode(@PathVariable String barcode) {
        try {
            ItemInstanceDTO itemInstance = purchaseService.getItemInstanceByBarcode(barcode);
            return ResponseEntity.ok(itemInstance);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
