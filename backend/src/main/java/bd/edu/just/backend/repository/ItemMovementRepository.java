package bd.edu.just.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import bd.edu.just.backend.model.ItemMovement;
import bd.edu.just.backend.model.Item;
import bd.edu.just.backend.model.Office;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ItemMovementRepository extends JpaRepository<ItemMovement, Long> {
    
    List<ItemMovement> findByItem(Item item);
    
    List<ItemMovement> findByFromOfficeId(Office office);
    
    List<ItemMovement> findByToOfficeId(Office office);
    
    List<ItemMovement> findByIsActiveTrue();
    
    @Query("SELECT m FROM ItemMovement m WHERE m.dateMoved BETWEEN :startDate AND :endDate AND m.isActive = true")
    List<ItemMovement> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT m FROM ItemMovement m WHERE m.isActive = true ORDER BY m.dateMoved DESC")
    List<ItemMovement> findRecentMovements();
    
    // Office-based queries
    @Query("SELECT m FROM ItemMovement m WHERE (m.fromOfficeId.id = :officeId OR m.toOfficeId.id = :officeId) AND m.isActive = true ORDER BY m.dateMoved DESC")
    List<ItemMovement> findByOfficeId(@Param("officeId") Long officeId);
    
    @Query("SELECT m FROM ItemMovement m WHERE (m.fromOfficeId.id IN :officeIds OR m.toOfficeId.id IN :officeIds) AND m.isActive = true ORDER BY m.dateMoved DESC")
    List<ItemMovement> findByOfficeIds(@Param("officeIds") List<Long> officeIds);
}
