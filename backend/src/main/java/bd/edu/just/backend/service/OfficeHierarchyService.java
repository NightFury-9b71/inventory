package bd.edu.just.backend.service;

import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.repository.OfficeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Service to handle office hierarchy and access control
 * Provides methods to get accessible offices based on user's office and role
 */
@Service
public class OfficeHierarchyService {

    @Autowired
    private OfficeRepository officeRepository;

    /**
     * Get list of office IDs that a user can access
     * ADMIN: Can access their office and all child offices
     * USER: Can only access their own office
     * 
     * @param officeId User's office ID
     * @param isAdmin Whether the user is an admin
     * @return List of accessible office IDs
     */
    public List<Long> getAccessibleOfficeIds(Long officeId, boolean isAdmin) {
        List<Long> accessibleOfficeIds = new ArrayList<>();
        
        if (officeId == null) {
            return accessibleOfficeIds;
        }
        
        // Always include the user's own office
        accessibleOfficeIds.add(officeId);
        
        // If admin, include all child offices
        if (isAdmin) {
            List<Long> childOfficeIds = officeRepository.findAllChildOfficeIds(officeId);
            accessibleOfficeIds.addAll(childOfficeIds);
        }
        
        return accessibleOfficeIds;
    }

    /**
     * Check if a user can access a specific office's data
     * 
     * @param userOfficeId User's office ID
     * @param targetOfficeId Target office ID to access
     * @param isAdmin Whether the user is an admin
     * @return true if access is allowed
     */
    public boolean canAccessOffice(Long userOfficeId, Long targetOfficeId, boolean isAdmin) {
        if (userOfficeId == null || targetOfficeId == null) {
            return false;
        }
        
        // User can always access their own office
        if (userOfficeId.equals(targetOfficeId)) {
            return true;
        }
        
        // Admin can access child offices
        if (isAdmin) {
            List<Long> childOfficeIds = officeRepository.findAllChildOfficeIds(userOfficeId);
            return childOfficeIds.contains(targetOfficeId);
        }
        
        return false;
    }

    /**
     * Get all child offices for a given office
     * 
     * @param officeId Parent office ID
     * @return List of child offices
     */
    public List<Office> getChildOffices(Long officeId) {
        return officeRepository.findActiveChildOffices(officeId);
    }

    /**
     * Get all descendant office IDs (including nested children)
     * 
     * @param officeId Parent office ID
     * @return List of all descendant office IDs
     */
    public List<Long> getAllDescendantOfficeIds(Long officeId) {
        return officeRepository.findAllChildOfficeIds(officeId);
    }

    /**
     * Get all office IDs (for SUPER_ADMIN access)
     * 
     * @return List of all office IDs
     */
    public List<Long> getAllOfficeIds() {
        return officeRepository.findAll().stream()
                .map(Office::getId)
                .toList();
    }
}
