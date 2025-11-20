package bd.edu.just.backend.controller;

import bd.edu.just.backend.dto.OfficeInventoryDTO;
import bd.edu.just.backend.model.Item;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.model.OfficeInventory;
import bd.edu.just.backend.service.OfficeInventoryService;
import bd.edu.just.backend.service.OfficeService;
import bd.edu.just.backend.service.UserOfficeAccessService;
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

    @Autowired
    public OfficeInventoryController(OfficeInventoryService officeInventoryService,
                                   UserOfficeAccessService userOfficeAccessService,
                                   OfficeService officeService) {
        this.officeInventoryService = officeInventoryService;
        this.userOfficeAccessService = userOfficeAccessService;
        this.officeService = officeService;
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