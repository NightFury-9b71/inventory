package bd.edu.just.backend.service;

import bd.edu.just.backend.dto.DesignationDTO;
import bd.edu.just.backend.model.Designation;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.model.Role;
import bd.edu.just.backend.model.User;
import bd.edu.just.backend.repository.DesignationRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;

@Service
@Transactional
public class DesignationServiceImpl implements DesignationService {

    private final DesignationRepository designationRepository;

    @Autowired
    public DesignationServiceImpl(DesignationRepository designationRepository) {
        this.designationRepository = designationRepository;
    }

    @Override
    public Designation createDesignation(Designation designation) {
        // Validate that the combination doesn't already exist
        if (designationRepository.existsByUserAndRoleAndOfficeAndIsActive(
                designation.getUser(), designation.getRole(), designation.getOffice(), true)) {
            throw new RuntimeException("User already has this designation in this office");
        }

        // If this is set as primary, unset other primary designations for this user
        if (designation.getIsPrimary()) {
            List<Designation> userDesignations = designationRepository.findByUserAndIsActive(designation.getUser(), true);
            userDesignations.forEach(d -> d.setIsPrimary(false));
        }

        return designationRepository.save(designation);
    }

    @Override
    public List<Designation> getAllDesignations() {
        return designationRepository.findAll();
    }

    @Override
    public Optional<Designation> getDesignationById(Long id) {
        return designationRepository.findById(id);
    }

    @Override
    public List<Designation> getDesignationsByUser(User user) {
        return designationRepository.findByUserAndIsActive(user, true);
    }

    @Override
    public List<Designation> getDesignationsByOffice(Office office) {
        return designationRepository.findByOfficeAndIsActive(office, true);
    }

    @Override
    public List<Designation> getDesignationsByRole(Role role) {
        return designationRepository.findByRoleAndIsActive(role, true);
    }

    @Override
    public List<Designation> getActiveDesignationsByUser(User user) {
        return designationRepository.findActiveDesignationsByUser(user);
    }

    @Override
    public Designation updateDesignation(Long id, Designation designationDetails) {
        Designation designation = designationRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Designation not found"));

        // If changing to primary, unset other primary designations
        if (designationDetails.getIsPrimary() && !designation.getIsPrimary()) {
            List<Designation> userDesignations = designationRepository.findByUserAndIsActive(designation.getUser(), true);
            userDesignations.forEach(d -> d.setIsPrimary(false));
        }

        designation.setRole(designationDetails.getRole());
        designation.setOffice(designationDetails.getOffice());
        designation.setIsPrimary(designationDetails.getIsPrimary());
        designation.setIsActive(designationDetails.getIsActive());

        return designationRepository.save(designation);
    }

    @Override
    public void deleteDesignation(Long id) {
        Designation designation = designationRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Designation not found"));
        designation.setIsActive(false);
        designationRepository.save(designation);
    }

    @Override
    public boolean hasUserPurchasingPower(User user) {
        List<Designation> userDesignations = designationRepository.findActiveDesignationsByUser(user);
        return userDesignations.stream()
                .anyMatch(d -> d.getRole().getPurchasingPower());
    }

    @Override
    public List<User> getUsersWithPurchasingPower() {
        return designationRepository.findUsersWithPurchasingPower();
    }

    @Override
    public Optional<Designation> getPrimaryDesignation(User user) {
        List<Designation> primaryDesignations = designationRepository.findByUserAndIsActiveAndIsPrimary(user, true, true);
        return primaryDesignations.stream().findFirst();
    }

    @Override
    public void assignPrimaryDesignation(User user, Designation designation) {
        // Unset all primary designations for this user
        List<Designation> userDesignations = designationRepository.findByUserAndIsActive(user, true);
        userDesignations.forEach(d -> d.setIsPrimary(false));

        // Set the new primary designation
        designation.setIsPrimary(true);
        designationRepository.save(designation);
    }

    @Override
    public DesignationDTO convertToDTO(Designation designation) {
        return new DesignationDTO(
            designation.getId(),
            designation.getUser().getId(),
            designation.getUser().getName(),
            designation.getRole().getId(),
            designation.getRole().getName(),
            designation.getRole().getPurchasingPower(),
            designation.getOffice().getId(),
            designation.getOffice().getName(),
            designation.getIsPrimary(),
            designation.getIsActive(),
            designation.getAssignedAt(),
            designation.getCreatedAt(),
            designation.getUpdatedAt()
        );
    }
}