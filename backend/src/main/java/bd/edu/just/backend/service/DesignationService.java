package bd.edu.just.backend.service;

import bd.edu.just.backend.model.Designation;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.model.Role;
import bd.edu.just.backend.model.User;
import bd.edu.just.backend.dto.DesignationDTO;

import java.util.List;
import java.util.Optional;

public interface DesignationService {
    Designation createDesignation(Designation designation);
    List<Designation> getAllDesignations();
    Optional<Designation> getDesignationById(Long id);
    List<Designation> getDesignationsByUser(User user);
    List<Designation> getDesignationsByOffice(Office office);
    List<Designation> getDesignationsByRole(Role role);
    List<Designation> getActiveDesignationsByUser(User user);
    Designation updateDesignation(Long id, Designation designation);
    void deleteDesignation(Long id);
    boolean hasUserPurchasingPower(User user);
    List<User> getUsersWithPurchasingPower();
    Optional<Designation> getPrimaryDesignation(User user);
    void assignPrimaryDesignation(User user, Designation designation);
    DesignationDTO convertToDTO(Designation designation);
    
    /**
     * Get primary office ID for a user
     * @param userId User ID
     * @return Office ID or null if not found
     */
    Long getPrimaryOfficeId(Long userId);
    
    /**
     * Check if user is admin (has ROLE_ADMIN)
     * @param userId User ID
     * @return true if user has admin role
     */
    boolean isUserAdmin(Long userId);
}