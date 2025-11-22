package bd.edu.just.backend.controller;

import bd.edu.just.backend.dto.OfficeInventoryDTO;
import bd.edu.just.backend.dto.ItemInstanceDTO;
import bd.edu.just.backend.model.Item;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.model.OfficeInventory;
import bd.edu.just.backend.model.ItemInstance;
import bd.edu.just.backend.service.OfficeInventoryService;
import bd.edu.just.backend.service.OfficeService;
import bd.edu.just.backend.service.UserOfficeAccessService;
import bd.edu.just.backend.repository.ItemInstanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/office-inventory")
public class OfficeInventoryController {

    private final OfficeInventoryService officeInventoryService;
    private final UserOfficeAccessService userOfficeAccessService;
    private final OfficeService officeService;
    private final ItemInstanceRepository itemInstanceRepository;

    @Autowired
    public OfficeInventoryController(OfficeInventoryService officeInventoryService,
                                   UserOfficeAccessService userOfficeAccessService,
                                   OfficeService officeService,
                                   ItemInstanceRepository itemInstanceRepository) {
        this.officeInventoryService = officeInventoryService;
        this.userOfficeAccessService = userOfficeAccessService;
        this.officeService = officeService;
        this.itemInstanceRepository = itemInstanceRepository;
    }

    @GetMapping("/my-office")
    public ResponseEntity<List<OfficeInventoryDTO>> getMyOfficeInventory() {
        List<Long> accessibleOfficeIds = userOfficeAccessService.getCurrentUserAccessibleOfficeIds();

        if (accessibleOfficeIds.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<OfficeInventory> inventoryList = officeInventoryService.getAllInventoryWithStock()
                .stream()
                .filter(inv -> accessibleOfficeIds.contains(inv.getOffice().getId()))
                .collect(Collectors.toList());

        List<OfficeInventoryDTO> dtoList = inventoryList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/office/{officeId}")
    public ResponseEntity<List<OfficeInventoryDTO>> getInventoryByOffice(@PathVariable Long officeId) {
        // Check if user can access this office
        if (!userOfficeAccessService.canAccessOffice(officeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Office> officeOpt = officeService.getOfficeById(officeId);
        if (!officeOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<OfficeInventory> inventory = officeInventoryService.getInventoryByOffice(officeOpt.get());
        List<OfficeInventoryDTO> dtoList = inventory.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<OfficeInventoryDTO>> getInventoryByItem(@PathVariable Long itemId) {
        List<Long> accessibleOfficeIds = userOfficeAccessService.getCurrentUserAccessibleOfficeIds();

        if (accessibleOfficeIds.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        Item item = new Item();
        item.setId(itemId);

        List<OfficeInventory> inventory = officeInventoryService.getInventoryByItem(item)
                .stream()
                .filter(inv -> accessibleOfficeIds.contains(inv.getOffice().getId()))
                .collect(Collectors.toList());

        List<OfficeInventoryDTO> dtoList = inventory.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/office/{officeId}/available")
    public ResponseEntity<List<OfficeInventoryDTO>> getAvailableItemsByOffice(@PathVariable Long officeId) {
        // Check if user can access this office
        if (!userOfficeAccessService.canAccessOffice(officeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Office> officeOpt = officeService.getOfficeById(officeId);
        if (!officeOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<OfficeInventory> inventory = officeInventoryService.getAvailableItemsByOffice(officeOpt.get());
        List<OfficeInventoryDTO> dtoList = inventory.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/item/{itemId}/total-quantity")
    public ResponseEntity<Long> getTotalQuantityByItem(@PathVariable Long itemId) {
        List<Long> accessibleOfficeIds = userOfficeAccessService.getCurrentUserAccessibleOfficeIds();

        if (accessibleOfficeIds.isEmpty()) {
            return ResponseEntity.ok(0L);
        }

        Item item = new Item();
        item.setId(itemId);

        // Get total quantity only from accessible offices
        Long totalQuantity = officeInventoryService.getInventoryByItem(item)
                .stream()
                .filter(inv -> accessibleOfficeIds.contains(inv.getOffice().getId()))
                .mapToLong(OfficeInventory::getQuantity)
                .sum();

        return ResponseEntity.ok(totalQuantity);
    }

    @PostMapping("/adjust")
    public ResponseEntity<Void> adjustInventory(
            @RequestParam Long officeId,
            @RequestParam Long itemId,
            @RequestParam Integer quantityChange) {

        // Check if user can access this office
        if (!userOfficeAccessService.canAccessOffice(officeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Optional<Office> officeOpt = officeService.getOfficeById(officeId);
            if (!officeOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Item item = new Item();
            item.setId(itemId);

            officeInventoryService.adjustInventory(officeOpt.get(), item, quantityChange);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<Void> transferItems(
            @RequestParam Long fromOfficeId,
            @RequestParam Long toOfficeId,
            @RequestParam Long itemId,
            @RequestParam Integer quantity) {

        // Check if user can access both offices
        if (!userOfficeAccessService.canAccessOffice(fromOfficeId) ||
            !userOfficeAccessService.canAccessOffice(toOfficeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Optional<Office> fromOfficeOpt = officeService.getOfficeById(fromOfficeId);
            Optional<Office> toOfficeOpt = officeService.getOfficeById(toOfficeId);

            if (!fromOfficeOpt.isPresent() || !toOfficeOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Item item = new Item();
            item.setId(itemId);

            officeInventoryService.transferItems(fromOfficeOpt.get(), toOfficeOpt.get(), item, quantity);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/check-stock")
    public ResponseEntity<Boolean> hasSufficientStock(
            @RequestParam Long officeId,
            @RequestParam Long itemId,
            @RequestParam Integer requiredQuantity) {

        // Check if user can access this office
        if (!userOfficeAccessService.canAccessOffice(officeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Office> officeOpt = officeService.getOfficeById(officeId);
        if (!officeOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Item item = new Item();
        item.setId(itemId);

        boolean hasStock = officeInventoryService.hasSufficientStock(officeOpt.get(), item, requiredQuantity);
        return ResponseEntity.ok(hasStock);
    }

    @GetMapping("/office/{officeId}/item-instances")
    public ResponseEntity<List<ItemInstanceDTO>> getOfficeItemInstances(@PathVariable Long officeId) {
        // Check if user can access this office
        if (!userOfficeAccessService.canAccessOffice(officeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Office> officeOpt = officeService.getOfficeById(officeId);
        if (!officeOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        List<ItemInstance> instances = itemInstanceRepository.findByOfficeId(officeId);
        List<ItemInstanceDTO> dtoList = instances.stream()
                .map(this::convertItemInstanceToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/my-office/item-instances")
    public ResponseEntity<List<ItemInstanceDTO>> getMyOfficeItemInstances() {
        List<Long> accessibleOfficeIds = userOfficeAccessService.getCurrentUserAccessibleOfficeIds();

        if (accessibleOfficeIds.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<ItemInstance> instances = accessibleOfficeIds.stream()
                .flatMap(officeId -> itemInstanceRepository.findByOfficeId(officeId).stream())
                .collect(Collectors.toList());

        List<ItemInstanceDTO> dtoList = instances.stream()
                .map(this::convertItemInstanceToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    private ItemInstanceDTO convertItemInstanceToDTO(ItemInstance instance) {
        ItemInstanceDTO dto = new ItemInstanceDTO();
        dto.setId(instance.getId());
        dto.setItemId(instance.getItem().getId());
        dto.setItemName(instance.getItem().getName());
        dto.setItemCode(instance.getItem().getCode());
        dto.setItemDescription(instance.getItem().getDescription());
        dto.setCategoryName(instance.getItem().getCategory() != null ? 
            instance.getItem().getCategory().getName() : null);
        dto.setPurchaseId(instance.getPurchase().getId());
        dto.setBarcode(instance.getBarcode());
        dto.setUnitPrice(instance.getUnitPrice());
        dto.setStatus(instance.getStatus().name());
        dto.setRemarks(instance.getRemarks());
        dto.setCreatedAt(instance.getCreatedAt());
        dto.setUpdatedAt(instance.getUpdatedAt());
        
        // Distribution info
        if (instance.getDistributedToOffice() != null) {
            dto.setDistributedToOfficeId(instance.getDistributedToOffice().getId());
            dto.setDistributedToOfficeName(instance.getDistributedToOffice().getName());
        }
        dto.setDistributedAt(instance.getDistributedAt());

        // Owner info
        if (instance.getOwner() != null) {
            dto.setOwnerId(instance.getOwner().getId());
            dto.setOwnerName(instance.getOwner().getName());
        }
        
        // Purchase details
        if (instance.getPurchase() != null) {
            dto.setVendorName(instance.getPurchase().getVendorName());
            dto.setVendorContact(instance.getPurchase().getVendorContact());
            dto.setPurchaseDate(instance.getPurchase().getPurchaseDate());
            dto.setInvoiceNumber(instance.getPurchase().getInvoiceNumber());
            dto.setPurchasedByName(instance.getPurchase().getPurchasedBy() != null ? 
                instance.getPurchase().getPurchasedBy().getName() : null);
        }
        
        return dto;
    }

    private OfficeInventoryDTO convertToDTO(OfficeInventory inventory) {
        return OfficeInventoryDTO.builder()
                .officeId(inventory.getOffice().getId())
                .officeName(inventory.getOffice().getName())
                .itemId(inventory.getItem().getId())
                .itemName(inventory.getItem().getName())
                .itemCode(inventory.getItem().getCode())
                .quantity(inventory.getQuantity())
                .unitName(inventory.getItem().getUnit() != null ? inventory.getItem().getUnit().getName() : null)
                .build();
    }
}