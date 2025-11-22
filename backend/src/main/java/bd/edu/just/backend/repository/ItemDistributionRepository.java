package bd.edu.just.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import bd.edu.just.backend.model.ItemDistribution;
import bd.edu.just.backend.model.Item;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.model.DistributionStatus;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ItemDistributionRepository extends JpaRepository<ItemDistribution, Long> {
    
    List<ItemDistribution> findByItem(Item item);
    
    List<ItemDistribution> findByOffice(Office office);
    
    List<ItemDistribution> findByStatus(DistributionStatus status);
    
    List<ItemDistribution> findByIsActiveTrue();
    
    @Query("SELECT d FROM ItemDistribution d WHERE d.dateDistributed BETWEEN :startDate AND :endDate AND d.isActive = true")
    List<ItemDistribution> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(d.quantity) FROM ItemDistribution d WHERE d.item.id = :itemId AND d.isActive = true")
    Long getTotalDistributedForItem(@Param("itemId") Long itemId);
    
    @Query("SELECT d FROM ItemDistribution d WHERE d.isActive = true ORDER BY d.dateDistributed DESC")
    List<ItemDistribution> findRecentDistributions();
    
    @Query("SELECT COUNT(d) FROM ItemDistribution d WHERE d.status = :status AND d.isActive = true")
    Long countByStatus(@Param("status") DistributionStatus status);
    
    // Office-based queries
    List<ItemDistribution> findByOfficeIdAndIsActiveTrue(Long officeId);
    
    @Query("SELECT d FROM ItemDistribution d WHERE d.office.id IN :officeIds AND d.isActive = true ORDER BY d.dateDistributed DESC")
    List<ItemDistribution> findByOfficeIdsAndIsActiveTrue(@Param("officeIds") List<Long> officeIds);
    
    // Query to find distributions where office is either sender or receiver
    @Query("SELECT d FROM ItemDistribution d WHERE (d.fromOffice.id IN :officeIds OR d.toOffice.id IN :officeIds OR d.office.id IN :officeIds) AND d.isActive = true ORDER BY d.dateDistributed DESC")
    List<ItemDistribution> findByFromOrToOfficeIdsAndIsActiveTrue(@Param("officeIds") List<Long> officeIds);
    
    @Query("SELECT d FROM ItemDistribution d WHERE d.office.id = :officeId AND d.dateDistributed BETWEEN :startDate AND :endDate AND d.isActive = true")
    List<ItemDistribution> findByOfficeIdAndDateRange(@Param("officeId") Long officeId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
