package bd.edu.just.backend.service;

import bd.edu.just.backend.model.User;
import bd.edu.just.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Service to determine office access for the current authenticated user
 */
@Service
public class UserOfficeAccessService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DesignationService designationService;

    @Autowired
    private OfficeHierarchyService officeHierarchyService;

    /**
     * Get the current authenticated user
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
            return userRepository.findByUsername(userDetails.getUsername()).orElse(null);
        }

        return null;
    }

    /**
     * Get the current user's ID
     */
    public Long getCurrentUserId() {
        User user = getCurrentUser();
        return user != null ? user.getId() : null;
    }

    /**
     * Get the current user's primary office ID
     */
    public Long getCurrentUserOfficeId() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return null;
        }
        return designationService.getPrimaryOfficeId(userId);
    }

    /**
     * Check if current user is an admin
     */
    public boolean isCurrentUserAdmin() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return false;
        }
        return designationService.isUserAdmin(userId);
    }

    /**
     * Get list of office IDs that the current user can access
     * ADMIN: Can access their office and all child offices
     * USER: Can only access their own office
     * SUPER_ADMIN: Can access all offices
     */
    public List<Long> getCurrentUserAccessibleOfficeIds() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return Collections.emptyList();
        }

        // Check if user is SUPER_ADMIN
        List<String> roles = getCurrentUserRoles();
        if (roles.contains("SUPER_ADMIN")) {
            // For SUPER_ADMIN, return all office IDs
            // This is a simplified approach - in production you might want to cache this
            return officeHierarchyService.getAllOfficeIds();
        }

        Long officeId = designationService.getPrimaryOfficeId(userId);
        if (officeId == null) {
            return Collections.emptyList();
        }

        boolean isAdmin = designationService.isUserAdmin(userId);
        return officeHierarchyService.getAccessibleOfficeIds(officeId, isAdmin);
    }

    /**
     * Get current user's roles
     */
    private List<String> getCurrentUserRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Collections.emptyList();
        }

        return authentication.getAuthorities().stream()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .toList();
    }

    /**
     * Check if current user can access a specific office
     */
    public boolean canAccessOffice(Long targetOfficeId) {
        List<Long> accessibleOfficeIds = getCurrentUserAccessibleOfficeIds();
        return accessibleOfficeIds.contains(targetOfficeId);
    }
}