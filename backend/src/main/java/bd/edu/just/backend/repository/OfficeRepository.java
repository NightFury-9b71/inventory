package bd.edu.just.backend.repository;
import bd.edu.just.backend.model.Office;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface OfficeRepository extends JpaRepository<Office, Long> {
    
    Optional<Office> findByCode(String code);
    
    List<Office> findByParentOfficeId(Long parentOfficeId);
    
    List<Office> findByIsActiveTrue();
    
    @Query("SELECT o FROM Office o WHERE o.parentOffice.id = :parentId AND o.isActive = true")
    List<Office> findActiveChildOffices(@Param("parentId") Long parentId);
    
    // Recursive query to get all child offices (including nested children)
    @Query(value = "WITH RECURSIVE office_tree AS (" +
           "  SELECT id, name, parent_id FROM offices WHERE id = :officeId " +
           "  UNION ALL " +
           "  SELECT o.id, o.name, o.parent_id FROM offices o " +
           "  INNER JOIN office_tree ot ON o.parent_id = ot.id " +
           ") SELECT id FROM office_tree", nativeQuery = true)
    List<Long> findAllChildOfficeIds(@Param("officeId") Long officeId);
}