package bd.edu.just.backend.service;

import bd.edu.just.backend.model.ItemDistribution;
import bd.edu.just.backend.model.Item;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.model.User;
import bd.edu.just.backend.model.DistributionStatus;
import bd.edu.just.backend.dto.ItemDistributionDTO;
import bd.edu.just.backend.dto.ItemDistributionRequestDTO;
import bd.edu.just.backend.repository.ItemDistributionRepository;
import bd.edu.just.backend.repository.ItemRepository;
import bd.edu.just.backend.repository.OfficeRepository;
import bd.edu.just.backend.repository.UserRepository;
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
    private UserRepository userRepository;

    @Autowired
    private OfficeInventoryService officeInventoryService;

    @Autowired
    private UserOfficeAccessService userOfficeAccessService;

    @Override
    public List<ItemDistributionDTO> getAllDistributions() {
        List<Long> accessibleOfficeIds = userOfficeAccessService.getCurrentUserAccessibleOfficeIds();
        
        // If no accessible offices, return empty list
        if (accessibleOfficeIds.isEmpty()) {
            return List.of();
        }
        
        return distributionRepository.findByOfficeIdsAndIsActiveTrue(accessibleOfficeIds).stream()
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
        Office office = officeRepository.findById(requestDTO.getOfficeId())
                .orElseThrow(() -> new RuntimeException("Office not found"));
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if item has sufficient quantity
        if (item.getQuantity() < requestDTO.getQuantity()) {
            throw new RuntimeException("Insufficient item quantity");
        }

        ItemDistribution distribution = new ItemDistribution(item, office, user, requestDTO.getQuantity());
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

        // Update item quantity
        item.setQuantity(item.getQuantity() - requestDTO.getQuantity());
        itemRepository.save(item);

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

        // Update distribution
        if (requestDTO.getItemId() != null) {
            Item newItem = itemRepository.findById(requestDTO.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found"));
            distribution.setItem(newItem);
            item = newItem;
        }
        if (requestDTO.getOfficeId() != null) {
            Office office = officeRepository.findById(requestDTO.getOfficeId())
                    .orElseThrow(() -> new RuntimeException("Office not found"));
            distribution.setOffice(office);
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

        // Handle office inventory based on status change
        if (oldStatus != DistributionStatus.APPROVED && newStatus == DistributionStatus.APPROVED) {
            // Status changed to APPROVED, add to office inventory
            officeInventoryService.adjustInventory(distribution.getOffice(), item, newQuantity);
        } else if (oldStatus == DistributionStatus.APPROVED && newStatus != DistributionStatus.APPROVED) {
            // Status changed from APPROVED to something else, remove from office inventory
            officeInventoryService.adjustInventory(distribution.getOffice(), item, -newQuantity);
        } else if (oldStatus == DistributionStatus.APPROVED && newStatus == DistributionStatus.APPROVED && !newQuantity.equals(distribution.getQuantity())) {
            // Quantity changed while still APPROVED, adjust inventory difference
            int quantityDifference = newQuantity - distribution.getQuantity();
            officeInventoryService.adjustInventory(distribution.getOffice(), item, quantityDifference);
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

    private ItemDistributionDTO convertToDTO(ItemDistribution distribution) {
        return new ItemDistributionDTO(
                distribution.getId(),
                distribution.getItem().getId(),
                distribution.getItem().getName(),
                distribution.getOffice().getId(),
                distribution.getOffice().getName(),
                distribution.getUser().getId(),
                distribution.getUser().getName(),
                distribution.getQuantity(),
                distribution.getDateDistributed(),
                distribution.getRemarks(),
                distribution.getStatus().toString(),
                distribution.getIsActive(),
                distribution.getCreatedAt(),
                distribution.getUpdatedAt()
        );
    }
}