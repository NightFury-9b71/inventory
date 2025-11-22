package bd.edu.just.backend.service;

import bd.edu.just.backend.dto.ItemDistributionDTO;
import bd.edu.just.backend.dto.ItemDistributionRequestDTO;
import bd.edu.just.backend.dto.ItemInstanceDTO;
import java.time.LocalDateTime;
import java.util.List;

public interface ItemDistributionService {

    List<ItemDistributionDTO> getAllDistributions();

    ItemDistributionDTO getDistributionById(Long id);

    ItemDistributionDTO createDistribution(ItemDistributionRequestDTO requestDTO);

    ItemDistributionDTO updateDistribution(Long id, ItemDistributionRequestDTO requestDTO);

    void deleteDistribution(Long id);

    List<ItemDistributionDTO> getDistributionsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<ItemDistributionDTO> getRecentDistributions();

    List<ItemInstanceDTO> getItemInstancesByDistribution(Long distributionId);
}