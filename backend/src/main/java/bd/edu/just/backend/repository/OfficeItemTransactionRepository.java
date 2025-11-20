package bd.edu.just.backend.repository;

import bd.edu.just.backend.model.OfficeItemTransaction;
import bd.edu.just.backend.model.TransactionType;
import bd.edu.just.backend.model.OfficeItemTransaction.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfficeItemTransactionRepository extends JpaRepository<OfficeItemTransaction, Long> {
    
    // Find by reference number
    Optional<OfficeItemTransaction> findByReferenceNumber(String referenceNumber);
    
    // Find all transactions for a specific office (sent or received)
    @Query("SELECT t FROM OfficeItemTransaction t WHERE t.fromOffice.id = :officeId OR t.toOffice.id = :officeId ORDER BY t.transactionDate DESC")
    List<OfficeItemTransaction> findByOfficeId(@Param("officeId") Long officeId);
    
    // Find transactions where office is sender
    List<OfficeItemTransaction> findByFromOfficeIdOrderByTransactionDateDesc(Long fromOfficeId);
    
    // Find transactions where office is receiver
    List<OfficeItemTransaction> findByToOfficeIdOrderByTransactionDateDesc(Long toOfficeId);
    
    // Find transactions by type
    List<OfficeItemTransaction> findByTransactionTypeOrderByTransactionDateDesc(TransactionType transactionType);
    
    // Find transactions by status
    List<OfficeItemTransaction> findByStatusOrderByTransactionDateDesc(TransactionStatus status);
    
    // Find transactions for specific item
    List<OfficeItemTransaction> findByItemIdOrderByTransactionDateDesc(Long itemId);
    
    // Find pending transactions for a specific office
    @Query("SELECT t FROM OfficeItemTransaction t WHERE (t.fromOffice.id = :officeId OR t.toOffice.id = :officeId) AND t.status = 'PENDING' ORDER BY t.transactionDate DESC")
    List<OfficeItemTransaction> findPendingTransactionsByOfficeId(@Param("officeId") Long officeId);
    
    // Find transactions between two offices
    @Query("SELECT t FROM OfficeItemTransaction t WHERE t.fromOffice.id = :fromOfficeId AND t.toOffice.id = :toOfficeId ORDER BY t.transactionDate DESC")
    List<OfficeItemTransaction> findByFromOfficeIdAndToOfficeId(@Param("fromOfficeId") Long fromOfficeId, @Param("toOfficeId") Long toOfficeId);
    
    // Find transactions within a date range
    @Query("SELECT t FROM OfficeItemTransaction t WHERE t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
    List<OfficeItemTransaction> findByTransactionDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Get transaction history for an item at a specific office
    @Query("SELECT t FROM OfficeItemTransaction t WHERE t.item.id = :itemId AND (t.fromOffice.id = :officeId OR t.toOffice.id = :officeId) ORDER BY t.transactionDate DESC")
    List<OfficeItemTransaction> findItemHistoryAtOffice(@Param("itemId") Long itemId, @Param("officeId") Long officeId);
    
    // Get all completed distributions from parent to children
    @Query("SELECT t FROM OfficeItemTransaction t WHERE t.fromOffice.id = :officeId AND t.transactionType = 'DISTRIBUTION' AND t.status = 'COMPLETED' ORDER BY t.transactionDate DESC")
    List<OfficeItemTransaction> findCompletedDistributionsByFromOffice(@Param("officeId") Long officeId);
    
    // Get all returns to parent office
    @Query("SELECT t FROM OfficeItemTransaction t WHERE t.toOffice.id = :officeId AND t.transactionType = 'RETURN' AND t.status = 'COMPLETED' ORDER BY t.transactionDate DESC")
    List<OfficeItemTransaction> findCompletedReturnsByToOffice(@Param("officeId") Long officeId);
}
