package bd.edu.just.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import bd.edu.just.backend.model.Purchase;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    
    List<Purchase> findByIsActiveTrue();
    
    @Query("SELECT p FROM Purchase p WHERE p.purchaseDate BETWEEN :startDate AND :endDate AND p.isActive = true")
    List<Purchase> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT p FROM Purchase p WHERE p.vendorName = :vendorName AND p.isActive = true")
    List<Purchase> findByVendor(@Param("vendorName") String vendorName);
    
    @Query("SELECT SUM(p.totalPrice) FROM Purchase p WHERE p.isActive = true")
    Double getTotalPurchaseValue();
    
    @Query("SELECT SUM(pi.quantity) FROM PurchaseItem pi WHERE pi.item.id = :itemId AND pi.purchase.isActive = true")
    Long getTotalQuantityPurchasedForItem(@Param("itemId") Long itemId);
    
    @Query("SELECT p FROM Purchase p WHERE p.isActive = true ORDER BY p.purchaseDate DESC")
    List<Purchase> findRecentPurchases();
    
    @Query("SELECT DISTINCT p FROM Purchase p JOIN p.purchaseItems pi WHERE pi.item.id = :itemId AND p.isActive = true")
    List<Purchase> findByItemId(@Param("itemId") Long itemId);
    
    // Office-based queries
    List<Purchase> findByOfficeIdAndIsActiveTrue(Long officeId);
    
    @Query("SELECT p FROM Purchase p WHERE p.office.id IN :officeIds AND p.isActive = true ORDER BY p.purchaseDate DESC")
    List<Purchase> findByOfficeIdsAndIsActiveTrue(@Param("officeIds") List<Long> officeIds);
    
    @Query("SELECT p FROM Purchase p WHERE p.office.id = :officeId AND p.purchaseDate BETWEEN :startDate AND :endDate AND p.isActive = true")
    List<Purchase> findByOfficeIdAndDateRange(@Param("officeId") Long officeId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(p.totalPrice) FROM Purchase p WHERE p.office.id = :officeId AND p.isActive = true")
    Double getTotalPurchaseValueByOffice(@Param("officeId") Long officeId);
}
