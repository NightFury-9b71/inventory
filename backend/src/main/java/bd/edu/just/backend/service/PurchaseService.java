package bd.edu.just.backend.service;

import bd.edu.just.backend.dto.PurchaseDTO;
import bd.edu.just.backend.dto.PurchaseItemDTO;
import bd.edu.just.backend.dto.ItemInstanceDTO;
import bd.edu.just.backend.model.Purchase;
import bd.edu.just.backend.model.PurchaseItem;
import bd.edu.just.backend.model.ItemInstance;
import bd.edu.just.backend.model.Item;
import bd.edu.just.backend.model.User;
import bd.edu.just.backend.repository.PurchaseRepository;
import bd.edu.just.backend.repository.PurchaseItemRepository;
import bd.edu.just.backend.repository.ItemInstanceRepository;
import bd.edu.just.backend.repository.ItemRepository;
import bd.edu.just.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private PurchaseItemRepository purchaseItemRepository;

    @Autowired
    private ItemInstanceRepository itemInstanceRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemService itemService;

    @Autowired
    private DesignationService designationService;

    @Autowired
    private BarcodeGenerationService barcodeGenerationService;

    public List<PurchaseDTO> getAllPurchases() {
        return purchaseRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PurchaseDTO getPurchaseById(Long id) {
        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found with id: " + id));
        return convertToDTO(purchase);
    }

    @Transactional
    public PurchaseDTO createPurchase(PurchaseDTO purchaseDTO) {
        User user = userRepository.findById(purchaseDTO.getPurchasedById())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create the main Purchase entity
        Purchase purchase = new Purchase();
        purchase.setVendorName(purchaseDTO.getVendorName());
        purchase.setVendorContact(purchaseDTO.getVendorContact());
        purchase.setPurchaseDate(purchaseDTO.getPurchaseDate() != null ? 
                purchaseDTO.getPurchaseDate() : LocalDate.now());
        purchase.setInvoiceNumber(purchaseDTO.getInvoiceNumber());
        purchase.setRemarks(purchaseDTO.getRemarks());
        purchase.setPurchasedBy(user);
        purchase.setIsActive(true);

        // Save the purchase first to get the ID
        Purchase savedPurchase = purchaseRepository.save(purchase);

        // Process each item in the purchase
        for (PurchaseItemDTO itemDTO : purchaseDTO.getItems()) {
            Item item = itemRepository.findById(itemDTO.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found with id: " + itemDTO.getItemId()));

            // Create PurchaseItem
            PurchaseItem purchaseItem = new PurchaseItem();
            purchaseItem.setPurchase(savedPurchase);
            purchaseItem.setItem(item);
            purchaseItem.setQuantity(itemDTO.getQuantity());
            purchaseItem.setUnitPrice(itemDTO.getUnitPrice());
            purchaseItem.setTotalPrice(itemDTO.getQuantity() * itemDTO.getUnitPrice());

            purchaseItemRepository.save(purchaseItem);

            savedPurchase.addPurchaseItem(purchaseItem);

            // Generate barcodes and create ItemInstance for each quantity
            for (int i = 0; i < itemDTO.getQuantity(); i++) {
                String barcode = barcodeGenerationService.generateBarcode(item.getCode());

                ItemInstance itemInstance = new ItemInstance();
                itemInstance.setItem(item);
                itemInstance.setPurchase(savedPurchase);
                itemInstance.setBarcode(barcode);
                itemInstance.setUnitPrice(itemDTO.getUnitPrice());
                itemInstance.setStatus(ItemInstance.ItemInstanceStatus.IN_STOCK);

                // Set owner if user has purchasing power
                if (designationService.hasUserPurchasingPower(user)) {
                    itemInstance.setOwner(user);
                }

                itemInstanceRepository.save(itemInstance);
            }

            // Update item stock
            itemService.updateStock(item.getId(), itemDTO.getQuantity());
        }

        // Calculate and set total price
        double totalPrice = purchaseDTO.getItems().stream()
            .mapToDouble(item -> item.getQuantity() * item.getUnitPrice())
            .sum();
        savedPurchase.setTotalPrice(totalPrice);
        savedPurchase = purchaseRepository.save(savedPurchase);

        // Reload the purchase with all relationships
        savedPurchase = purchaseRepository.findById(savedPurchase.getId())
                .orElseThrow(() -> new RuntimeException("Failed to reload purchase"));

        return convertToDTO(savedPurchase);
    }

    @Transactional
    public PurchaseDTO updatePurchase(Long id, PurchaseDTO purchaseDTO) {
        Purchase existingPurchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found with id: " + id));

        User user = userRepository.findById(purchaseDTO.getPurchasedById())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Reverse previous stock updates
        for (PurchaseItem pi : existingPurchase.getPurchaseItems()) {
            itemService.updateStock(pi.getItem().getId(), -pi.getQuantity());
        }

        // Clear old purchase items and item instances
        existingPurchase.getPurchaseItems().clear();

        // Update purchase fields
        existingPurchase.setVendorName(purchaseDTO.getVendorName());
        existingPurchase.setVendorContact(purchaseDTO.getVendorContact());
        existingPurchase.setPurchaseDate(purchaseDTO.getPurchaseDate());
        existingPurchase.setInvoiceNumber(purchaseDTO.getInvoiceNumber());
        existingPurchase.setRemarks(purchaseDTO.getRemarks());
        existingPurchase.setPurchasedBy(user);

        // Add new items
        for (PurchaseItemDTO itemDTO : purchaseDTO.getItems()) {
            Item item = itemRepository.findById(itemDTO.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found with id: " + itemDTO.getItemId()));

            PurchaseItem purchaseItem = new PurchaseItem();
            purchaseItem.setPurchase(existingPurchase);
            purchaseItem.setItem(item);
            purchaseItem.setQuantity(itemDTO.getQuantity());
            purchaseItem.setUnitPrice(itemDTO.getUnitPrice());
            purchaseItem.setTotalPrice(itemDTO.getQuantity() * itemDTO.getUnitPrice());

            existingPurchase.addPurchaseItem(purchaseItem);

            // Generate barcodes for new items
            for (int i = 0; i < itemDTO.getQuantity(); i++) {
                String barcode = barcodeGenerationService.generateBarcode(item.getCode());

                ItemInstance itemInstance = new ItemInstance();
                itemInstance.setItem(item);
                itemInstance.setPurchase(existingPurchase);
                itemInstance.setBarcode(barcode);
                itemInstance.setUnitPrice(itemDTO.getUnitPrice());
                itemInstance.setStatus(ItemInstance.ItemInstanceStatus.IN_STOCK);

                // Set owner if user has purchasing power
                if (designationService.hasUserPurchasingPower(user)) {
                    itemInstance.setOwner(user);
                }

                itemInstanceRepository.save(itemInstance);
            }

            // Update item stock with new quantity
            itemService.updateStock(item.getId(), itemDTO.getQuantity());
        }

        // Calculate and set total price
        double totalPrice = purchaseDTO.getItems().stream()
            .mapToDouble(item -> item.getQuantity() * item.getUnitPrice())
            .sum();
        existingPurchase.setTotalPrice(totalPrice);

        Purchase updatedPurchase = purchaseRepository.save(existingPurchase);

        return convertToDTO(updatedPurchase);
    }

    public List<PurchaseDTO> getPurchasesByDateRange(LocalDate startDate, LocalDate endDate) {
        return purchaseRepository.findByDateRange(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PurchaseDTO> getRecentPurchases() {
        return purchaseRepository.findRecentPurchases().stream()
                .limit(10)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePurchase(Long id) {
        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found with id: " + id));
        
        // Soft delete by setting isActive to false
        purchase.setIsActive(false);
        purchaseRepository.save(purchase);
        
        // Optionally, you could also reverse the stock updates
        for (PurchaseItem pi : purchase.getPurchaseItems()) {
            itemService.updateStock(pi.getItem().getId(), -pi.getQuantity());
        }
    }

    public List<ItemInstanceDTO> getItemInstancesByPurchase(Long purchaseId) {
        List<ItemInstance> instances = itemInstanceRepository.findByPurchaseId(purchaseId);
        return instances.stream()
                .map(this::convertItemInstanceToDTO)
                .collect(Collectors.toList());
    }

    public ItemInstanceDTO getItemInstanceByBarcode(String barcode) {
        Optional<ItemInstance> instance = itemInstanceRepository.findByBarcode(barcode);
        if (instance.isPresent()) {
            return convertItemInstanceToDTO(instance.get());
        } else {
            throw new RuntimeException("Item instance not found for barcode: " + barcode);
        }
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
            if (instance.getPurchase().getPurchasedBy() != null) {
                dto.setPurchasedByName(instance.getPurchase().getPurchasedBy().getName());
            }
        }
        
        return dto;
    }

    private PurchaseDTO convertToDTO(Purchase purchase) {
        PurchaseDTO dto = new PurchaseDTO();
        dto.setId(purchase.getId());
        
        // Convert purchase items
        List<PurchaseItemDTO> itemDTOs = new ArrayList<>();
        for (PurchaseItem pi : purchase.getPurchaseItems()) {
            PurchaseItemDTO itemDTO = new PurchaseItemDTO();
            itemDTO.setId(pi.getId());
            itemDTO.setItemId(pi.getItem().getId());
            itemDTO.setItemName(pi.getItem().getName());
            itemDTO.setItemCode(pi.getItem().getCode());
            itemDTO.setQuantity(pi.getQuantity());
            itemDTO.setUnitPrice(pi.getUnitPrice());
            itemDTO.setTotalPrice(pi.getTotalPrice());
            itemDTOs.add(itemDTO);
        }
        dto.setItems(itemDTOs);
        
        dto.setTotalPrice(purchase.getTotalPrice());
        dto.setVendorName(purchase.getVendorName());
        dto.setVendorContact(purchase.getVendorContact());
        dto.setPurchaseDate(purchase.getPurchaseDate());
        dto.setInvoiceNumber(purchase.getInvoiceNumber());
        dto.setRemarks(purchase.getRemarks());
        dto.setPurchasedById(purchase.getPurchasedBy().getId());
        dto.setPurchasedByName(purchase.getPurchasedBy().getUsername());
        dto.setIsActive(purchase.getIsActive());
        return dto;
    }
}
