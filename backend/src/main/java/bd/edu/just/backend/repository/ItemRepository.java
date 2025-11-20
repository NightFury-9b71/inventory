package bd.edu.just.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import bd.edu.just.backend.model.Item;
import bd.edu.just.backend.model.ItemCategory;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
    Optional<Item> findByCode(String code);
    
    List<Item> findByCategory(ItemCategory category);
    
    List<Item> findByIsActiveTrue();
    
    @Query("SELECT i FROM Item i WHERE i.isActive = true AND " +
           "(LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(i.code) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Item> searchItems(@Param("search") String search);
    
    @Query("SELECT i FROM Item i WHERE i.quantity < :threshold AND i.isActive = true")
    List<Item> findLowStockItems(@Param("threshold") Integer threshold);
    
    @Query("SELECT COUNT(i) FROM Item i WHERE i.isActive = true")
    Long countActiveItems();
    
    @Query("SELECT SUM(i.quantity) FROM Item i WHERE i.isActive = true")
    Long getTotalStock();

    @Query("SELECT DISTINCT i FROM Item i WHERE i.isActive = true AND i.id IN " +
           "(SELECT oi.item.id FROM OfficeInventory oi WHERE oi.office.id IN :officeIds AND oi.quantity > 0)")
    List<Item> findItemsByAccessibleOffices(@Param("officeIds") List<Long> officeIds);
}
