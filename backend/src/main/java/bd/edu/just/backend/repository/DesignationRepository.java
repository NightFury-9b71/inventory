package bd.edu.just.backend.repository;

import bd.edu.just.backend.model.Designation;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.model.Role;
import bd.edu.just.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Long> {

    List<Designation> findByUserAndIsActive(User user, Boolean isActive);

    List<Designation> findByOfficeAndIsActive(Office office, Boolean isActive);

    List<Designation> findByRoleAndIsActive(Role role, Boolean isActive);

    Optional<Designation> findByUserAndRoleAndOfficeAndIsActive(User user, Role role, Office office, Boolean isActive);

    List<Designation> findByUserAndIsActiveAndIsPrimary(User user, Boolean isActive, Boolean isPrimary);

    @Query("SELECT d FROM Designation d JOIN FETCH d.role WHERE d.user = :user AND d.isActive = true ORDER BY d.isPrimary DESC, d.assignedAt DESC")
    List<Designation> findActiveDesignationsByUser(@Param("user") User user);

    @Query("SELECT d FROM Designation d WHERE d.office = :office AND d.isActive = true")
    List<Designation> findActiveDesignationsByOffice(@Param("office") Office office);

    @Query("SELECT d FROM Designation d WHERE d.role = :role AND d.isActive = true")
    List<Designation> findActiveDesignationsByRole(@Param("role") Role role);

    @Query("SELECT DISTINCT d.user FROM Designation d WHERE d.role.purchasingPower = true AND d.isActive = true")
    List<User> findUsersWithPurchasingPower();

    boolean existsByUserAndRoleAndOfficeAndIsActive(User user, Role role, Office office, Boolean isActive);
    
    // Query by user ID
    List<Designation> findByUserIdAndIsActive(Long userId, Boolean isActive);
    
    List<Designation> findByUserIdAndIsActiveAndIsPrimary(Long userId, Boolean isActive, Boolean isPrimary);
}