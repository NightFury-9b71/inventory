package bd.edu.just.backend.repository;

import bd.edu.just.backend.model.ItemInstance;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemInstanceRepository extends JpaRepository<ItemInstance, Long> {

    Optional<ItemInstance> findByBarcode(String barcode);

    List<ItemInstance> findByItemId(Long itemId);

    List<ItemInstance> findByPurchaseId(Long purchaseId);

    @Query("SELECT ii FROM ItemInstance ii WHERE ii.item.id = :itemId AND ii.status = 'IN_STOCK'")
    List<ItemInstance> findAvailableByItemId(@Param("itemId") Long itemId);

    @Query("SELECT ii FROM ItemInstance ii WHERE ii.distributedToOffice.id = :officeId")
    List<ItemInstance> findByOfficeId(@Param("officeId") Long officeId);

    List<ItemInstance> findByOwner(User owner);

    List<ItemInstance> findByOwnerAndStatus(User owner, ItemInstance.ItemInstanceStatus status);

    List<ItemInstance> findByDistributedToOffice(Office office);

    boolean existsByBarcode(String barcode);
    
    long countByBarcodeStartingWith(String barcodePrefix);
}
