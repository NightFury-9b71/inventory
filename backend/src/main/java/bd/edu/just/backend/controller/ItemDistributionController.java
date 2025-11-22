package bd.edu.just.backend.controller;

import bd.edu.just.backend.dto.ItemDistributionDTO;
import bd.edu.just.backend.dto.ItemDistributionRequestDTO;
import bd.edu.just.backend.dto.ItemInstanceDTO;
import bd.edu.just.backend.service.ItemDistributionService;
import bd.edu.just.backend.model.DistributionStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/distributions")
// @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ItemDistributionController {

    @Autowired
    private ItemDistributionService distributionService;

    @GetMapping
    public ResponseEntity<List<ItemDistributionDTO>> getAllDistributions() {
        List<ItemDistributionDTO> distributions = distributionService.getAllDistributions();
        return ResponseEntity.ok(distributions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDistributionDTO> getDistributionById(@PathVariable Long id) {
        ItemDistributionDTO distribution = distributionService.getDistributionById(id);
        return ResponseEntity.ok(distribution);
    }

    @PostMapping
    public ResponseEntity<ItemDistributionDTO> createDistribution(@RequestBody ItemDistributionRequestDTO requestDTO) {
        ItemDistributionDTO createdDistribution = distributionService.createDistribution(requestDTO);
        return ResponseEntity.ok(createdDistribution);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemDistributionDTO> updateDistribution(@PathVariable Long id, @RequestBody ItemDistributionRequestDTO requestDTO) {
        ItemDistributionDTO updatedDistribution = distributionService.updateDistribution(id, requestDTO);
        return ResponseEntity.ok(updatedDistribution);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDistribution(@PathVariable Long id) {
        distributionService.deleteDistribution(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ItemDistributionDTO>> getDistributionsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
        LocalDateTime end = LocalDate.parse(endDate).atTime(23, 59, 59);
        List<ItemDistributionDTO> distributions = distributionService.getDistributionsByDateRange(start, end);
        return ResponseEntity.ok(distributions);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ItemDistributionDTO>> getRecentDistributions() {
        List<ItemDistributionDTO> distributions = distributionService.getRecentDistributions();
        return ResponseEntity.ok(distributions);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ItemDistributionDTO> approveDistribution(@PathVariable Long id) {
        ItemDistributionRequestDTO requestDTO = new ItemDistributionRequestDTO();
        requestDTO.setStatus(DistributionStatus.APPROVED);
        ItemDistributionDTO updatedDistribution = distributionService.updateDistribution(id, requestDTO);
        return ResponseEntity.ok(updatedDistribution);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ItemDistributionDTO> rejectDistribution(@PathVariable Long id) {
        ItemDistributionRequestDTO requestDTO = new ItemDistributionRequestDTO();
        requestDTO.setStatus(DistributionStatus.REJECTED);
        ItemDistributionDTO updatedDistribution = distributionService.updateDistribution(id, requestDTO);
        return ResponseEntity.ok(updatedDistribution);
    }
    
    @PutMapping("/{id}/accept")
    public ResponseEntity<ItemDistributionDTO> acceptTransfer(@PathVariable Long id) {
        ItemDistributionDTO updatedDistribution = distributionService.acceptTransfer(id);
        return ResponseEntity.ok(updatedDistribution);
    }

    @GetMapping("/{id}/barcodes")
    public ResponseEntity<List<ItemInstanceDTO>> getDistributionBarcodes(@PathVariable Long id) {
        try {
            List<ItemInstanceDTO> barcodes = distributionService.getItemInstancesByDistribution(id);
            return ResponseEntity.ok(barcodes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
