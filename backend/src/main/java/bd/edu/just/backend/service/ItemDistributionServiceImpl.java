package bd.edu.just.backend.service;

import bd.edu.just.backend.model.ItemDistribution;
import bd.edu.just.backend.model.Item;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.model.Employee;
import bd.edu.just.backend.model.User;
import bd.edu.just.backend.model.DistributionStatus;
import bd.edu.just.backend.model.TransferType;
import bd.edu.just.backend.model.ItemInstance;
import bd.edu.just.backend.dto.ItemDistributionDTO;
import bd.edu.just.backend.dto.ItemDistributionRequestDTO;
import bd.edu.just.backend.dto.ItemInstanceDTO;
import bd.edu.just.backend.repository.ItemDistributionRepository;
import bd.edu.just.backend.repository.ItemRepository;
import bd.edu.just.backend.repository.OfficeRepository;
import bd.edu.just.backend.repository.EmployeeRepository;
import bd.edu.just.backend.repository.UserRepository;
import bd.edu.just.backend.repository.ItemInstanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemDistributionServiceImpl implements ItemDistributionService {

    @Autowired
    private ItemDistributionRepository distributionRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private OfficeRepository officeRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OfficeInventoryService officeInventoryService;

    @Autowired
    private UserOfficeAccessService userOfficeAccessService;

    @Autowired
    private ItemInstanceRepository itemInstanceRepository;

    @Override
    public List<ItemDistributionDTO> getAllDistributions() {
        List<Long> accessibleOfficeIds = userOfficeAccessService.getCurrentUserAccessibleOfficeIds();
        
        // If no accessible offices, return empty list
        if (accessibleOfficeIds.isEmpty()) {
            return List.of();
        }
        
        // Offices should only see transfers sent TO them (not transfers they send out)
        // This way each office only sees the transfers they need to accept/confirm
        return distributionRepository.findByToOfficeIdsAndIsActiveTrue(accessibleOfficeIds).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ItemDistributionDTO getDistributionById(Long id) {
        ItemDistribution distribution = distributionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Distribution not found"));
        return convertToDTO(distribution);
    }

    @Override
    @Transactional
    public ItemDistributionDTO createDistribution(ItemDistributionRequestDTO requestDTO) {
        Item item = itemRepository.findById(requestDTO.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        // Determine toOfficeId (support both old and new format)
        Long toOfficeId = requestDTO.getToOfficeId() != null ? requestDTO.getToOfficeId() : requestDTO.getOfficeId();
        if (toOfficeId == null) {
            throw new RuntimeException("Destination office (toOfficeId) is required");
        }
        
        Office toOffice = officeRepository.findById(toOfficeId)
                .orElseThrow(() -> new RuntimeException("Destination office not found"));
        
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Determine transfer type (default to ALLOCATION if not provided)
        TransferType transferType = requestDTO.getTransferType() != null ? requestDTO.getTransferType() : TransferType.ALLOCATION;

        // Validate required fields based on transfer type
        Office fromOffice = null;
        Employee employee = null;
        
        if (transferType == TransferType.TRANSFER || transferType == TransferType.MOVEMENT || transferType == TransferType.RETURN) {
            if (requestDTO.getFromOfficeId() == null) {
                throw new RuntimeException("Source office (fromOfficeId) is required for " + transferType + " transfers");
            }
            fromOffice = officeRepository.findById(requestDTO.getFromOfficeId())
                    .orElseThrow(() -> new RuntimeException("Source office not found"));
        }
        
        if (transferType == TransferType.MOVEMENT) {
            if (requestDTO.getEmployeeId() == null) {
                throw new RuntimeException("Employee is required for MOVEMENT transfers");
            }
            employee = employeeRepository.findById(requestDTO.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Employee not found"));
        }

        // For TRANSFER type, check office inventory instead of global inventory
        if (transferType == TransferType.TRANSFER) {
            if (!officeInventoryService.hasSufficientStock(fromOffice, item, requestDTO.getQuantity())) {
                throw new RuntimeException("Insufficient stock in source office. Please check office inventory.");
            }
        } else {
            // Check if item has sufficient quantity for other transfer types
            if (item.getQuantity() < requestDTO.getQuantity()) {
                throw new RuntimeException("Insufficient item quantity. Available: " + item.getQuantity() + ", Requested: " + requestDTO.getQuantity());
            }
        }

        ItemDistribution distribution = new ItemDistribution(item, toOffice, user, requestDTO.getQuantity());
        distribution.setFromOffice(fromOffice);
        distribution.setToOffice(toOffice);
        distribution.setEmployee(employee);
        distribution.setTransferType(transferType);
        
        if (requestDTO.getDateDistributed() != null && !requestDTO.getDateDistributed().isEmpty()) {
            String dateStr = requestDTO.getDateDistributed();
            LocalDateTime dateTime;
            try {
                if (dateStr.contains("T")) {
                    dateTime = LocalDateTime.parse(dateStr);
                } else {
                    dateTime = LocalDate.parse(dateStr).atStartOfDay();
                }
                distribution.setDateDistributed(dateTime);
            } catch (Exception e) {
                throw new RuntimeException("Invalid date format: " + dateStr);
            }
        }
        distribution.setRemarks(requestDTO.getRemarks());

        ItemDistribution savedDistribution = distributionRepository.save(distribution);

        // Handle office inventory based on transfer type
        if (transferType == TransferType.TRANSFER) {
            // Transfer items between offices
            officeInventoryService.transferItems(fromOffice, toOffice, item, requestDTO.getQuantity());
        } else if (transferType == TransferType.ALLOCATION) {
            // For allocation, add to destination office inventory and reduce global stock
            item.setQuantity(item.getQuantity() - requestDTO.getQuantity());
            itemRepository.save(item);
            officeInventoryService.adjustInventory(toOffice, item, requestDTO.getQuantity());
        } else {
            // For other types (MOVEMENT, RETURN), just update global stock
            item.setQuantity(item.getQuantity() - requestDTO.getQuantity());
            itemRepository.save(item);
        }

        return convertToDTO(savedDistribution);
    }

    @Override
    @Transactional
    public ItemDistributionDTO updateDistribution(Long id, ItemDistributionRequestDTO requestDTO) {
        ItemDistribution distribution = distributionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Distribution not found"));

        DistributionStatus oldStatus = distribution.getStatus();
        DistributionStatus newStatus = requestDTO.getStatus() != null ? requestDTO.getStatus() : distribution.getStatus();

        // Restore previous quantity to item
        Item item = distribution.getItem();
        item.setQuantity(item.getQuantity() + distribution.getQuantity());

        // Update distribution fields
        if (requestDTO.getItemId() != null) {
            Item newItem = itemRepository.findById(requestDTO.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found"));
            distribution.setItem(newItem);
            item = newItem;
        }
        
        // Update office fields (support both old and new format)
        if (requestDTO.getOfficeId() != null) {
            Office office = officeRepository.findById(requestDTO.getOfficeId())
                    .orElseThrow(() -> new RuntimeException("Office not found"));
            distribution.setOffice(office);
            distribution.setToOffice(office);
        }
        if (requestDTO.getToOfficeId() != null) {
            Office toOffice = officeRepository.findById(requestDTO.getToOfficeId())
                    .orElseThrow(() -> new RuntimeException("Destination office not found"));
            distribution.setToOffice(toOffice);
            distribution.setOffice(toOffice); // Backward compatibility
        }
        if (requestDTO.getFromOfficeId() != null) {
            Office fromOffice = officeRepository.findById(requestDTO.getFromOfficeId())
                    .orElseThrow(() -> new RuntimeException("Source office not found"));
            distribution.setFromOffice(fromOffice);
        }
        if (requestDTO.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(requestDTO.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Employee not found"));
            distribution.setEmployee(employee);
        }
        if (requestDTO.getTransferType() != null) {
            distribution.setTransferType(requestDTO.getTransferType());
        }
        
        if (requestDTO.getUserId() != null) {
            User user = userRepository.findById(requestDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            distribution.setUser(user);
        }
        Integer newQuantity = requestDTO.getQuantity() != null ? requestDTO.getQuantity() : distribution.getQuantity();
        if (requestDTO.getQuantity() != null) {
            distribution.setQuantity(requestDTO.getQuantity());
        }
        if (requestDTO.getDateDistributed() != null && !requestDTO.getDateDistributed().isEmpty()) {
            String dateStr = requestDTO.getDateDistributed();
            LocalDateTime dateTime;
            try {
                if (dateStr.contains("T")) {
                    dateTime = LocalDateTime.parse(dateStr);
                } else {
                    dateTime = LocalDate.parse(dateStr).atStartOfDay();
                }
                distribution.setDateDistributed(dateTime);
            } catch (Exception e) {
                throw new RuntimeException("Invalid date format: " + dateStr);
            }
        }
        if (requestDTO.getRemarks() != null) {
            distribution.setRemarks(requestDTO.getRemarks());
        }
        if (requestDTO.getStatus() != null) {
            distribution.setStatus(requestDTO.getStatus());
        }

        // Check if item has sufficient quantity for the new quantity
        if (item.getQuantity() < newQuantity) {
            throw new RuntimeException("Insufficient item quantity");
        }

        // Deduct new quantity
        item.setQuantity(item.getQuantity() - newQuantity);
        itemRepository.save(item);

        ItemDistribution savedDistribution = distributionRepository.save(distribution);

        // Get the office for inventory adjustment (prefer toOffice, fallback to office)
        Office officeForInventory = distribution.getToOffice() != null ? distribution.getToOffice() : distribution.getOffice();
        
        // Handle office inventory based on status change
        if (oldStatus != DistributionStatus.APPROVED && newStatus == DistributionStatus.APPROVED) {
            // Status changed to APPROVED, add to office inventory
            officeInventoryService.adjustInventory(officeForInventory, item, newQuantity);
        } else if (oldStatus == DistributionStatus.APPROVED && newStatus != DistributionStatus.APPROVED) {
            // Status changed from APPROVED to something else, remove from office inventory
            officeInventoryService.adjustInventory(officeForInventory, item, -newQuantity);
        } else if (oldStatus == DistributionStatus.APPROVED && newStatus == DistributionStatus.APPROVED && !newQuantity.equals(distribution.getQuantity())) {
            // Quantity changed while still APPROVED, adjust inventory difference
            int quantityDifference = newQuantity - distribution.getQuantity();
            officeInventoryService.adjustInventory(officeForInventory, item, quantityDifference);
        }

        return convertToDTO(savedDistribution);
    }

    @Override
    @Transactional
    public void deleteDistribution(Long id) {
        ItemDistribution distribution = distributionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Distribution not found"));

        // Restore quantity to item
        Item item = distribution.getItem();
        item.setQuantity(item.getQuantity() + distribution.getQuantity());
        itemRepository.save(item);

        distributionRepository.delete(distribution);
    }

    @Override
    public List<ItemDistributionDTO> getDistributionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return distributionRepository.findByDateRange(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ItemDistributionDTO> getRecentDistributions() {
        return distributionRepository.findRecentDistributions().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ItemInstanceDTO> getItemInstancesByDistribution(Long distributionId) {
        ItemDistribution distribution = distributionRepository.findById(distributionId)
                .orElseThrow(() -> new RuntimeException("Distribution not found"));
        
        // Get item instances for this item that were distributed to the target office
        Office targetOffice = distribution.getToOffice() != null ? distribution.getToOffice() : distribution.getOffice();
        Item item = distribution.getItem();
        
        if (targetOffice == null) {
            return List.of();
        }
        
        // Get all instances distributed to this office for this item
        List<ItemInstance> instances = itemInstanceRepository.findByItemId(item.getId()).stream()
                .filter(instance -> 
                    instance.getDistributedToOffice() != null && 
                    instance.getDistributedToOffice().getId().equals(targetOffice.getId()) &&
                    instance.getStatus() == ItemInstance.ItemInstanceStatus.DISTRIBUTED
                )
                .collect(Collectors.toList());
        
        return instances.stream()
                .map(this::convertItemInstanceToDTO)
                .collect(Collectors.toList());
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

    private ItemDistributionDTO convertToDTO(ItemDistribution distribution) {
        ItemDistributionDTO dto = new ItemDistributionDTO();
        dto.setId(distribution.getId());
        dto.setItemId(distribution.getItem().getId());
        dto.setItemName(distribution.getItem().getName());
        
        // Backward compatibility: set officeId and officeName from toOffice
        if (distribution.getToOffice() != null) {
            dto.setOfficeId(distribution.getToOffice().getId());
            dto.setOfficeName(distribution.getToOffice().getName());
            dto.setToOfficeId(distribution.getToOffice().getId());
            dto.setToOfficeName(distribution.getToOffice().getName());
        } else if (distribution.getOffice() != null) {
            dto.setOfficeId(distribution.getOffice().getId());
            dto.setOfficeName(distribution.getOffice().getName());
            dto.setToOfficeId(distribution.getOffice().getId());
            dto.setToOfficeName(distribution.getOffice().getName());
        }
        
        // Set fromOffice if exists
        if (distribution.getFromOffice() != null) {
            dto.setFromOfficeId(distribution.getFromOffice().getId());
            dto.setFromOfficeName(distribution.getFromOffice().getName());
        }
        
        // Set employee if exists
        if (distribution.getEmployee() != null) {
            dto.setEmployeeId(distribution.getEmployee().getId());
            dto.setEmployeeName(distribution.getEmployee().getName());
        }
        
        dto.setUserId(distribution.getUser().getId());
        dto.setUserName(distribution.getUser().getName());
        dto.setQuantity(distribution.getQuantity());
        dto.setDateDistributed(distribution.getDateDistributed());
        dto.setRemarks(distribution.getRemarks());
        dto.setStatus(distribution.getStatus().toString());
        dto.setTransferType(distribution.getTransferType().toString());
        dto.setIsActive(distribution.getIsActive());
        dto.setCreatedAt(distribution.getCreatedAt());
        dto.setUpdatedAt(distribution.getUpdatedAt());
        
        return dto;
    }
    
    @Override
    @Transactional
    public ItemDistributionDTO acceptTransfer(Long id) {
        ItemDistribution distribution = distributionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Distribution not found"));
        
        // Verify the transfer is for an office the current user has access to
        List<Long> accessibleOfficeIds = userOfficeAccessService.getCurrentUserAccessibleOfficeIds();
        Office toOffice = distribution.getToOffice() != null ? distribution.getToOffice() : distribution.getOffice();
        
        if (toOffice == null || !accessibleOfficeIds.contains(toOffice.getId())) {
            throw new RuntimeException("You do not have permission to accept this transfer");
        }
        
        // Check if already approved
        if (distribution.getStatus() == DistributionStatus.APPROVED) {
            throw new RuntimeException("This transfer has already been accepted");
        }
        
        // Check if transfer is pending
        if (distribution.getStatus() != DistributionStatus.PENDING) {
            throw new RuntimeException("Only pending transfers can be accepted");
        }
        
        // Update status to APPROVED
        distribution.setStatus(DistributionStatus.APPROVED);
        ItemDistribution savedDistribution = distributionRepository.save(distribution);
        
        // Update office inventory - add items to the receiving office
        Item item = distribution.getItem();
        Integer quantity = distribution.getQuantity();
        
        // For TRANSFER type, items were already moved during creation, just update inventory
        // For other types, add to office inventory
        if (distribution.getTransferType() != TransferType.TRANSFER) {
            officeInventoryService.adjustInventory(toOffice, item, quantity);
        }
        
        return convertToDTO(savedDistribution);
    }
}
