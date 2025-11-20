package bd.edu.just.backend.service;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.model.OfficeType;
import bd.edu.just.backend.dto.OfficeResponseDTO;
import bd.edu.just.backend.repository.OfficeRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.NoSuchElementException;


@Service
@Transactional
public class OfficeServiceImpl implements OfficeService {

    private final OfficeRepository officeRepository;

    @Autowired
    private UserOfficeAccessService userOfficeAccessService;

    @Autowired
    public OfficeServiceImpl(OfficeRepository officeRepository) {
        this.officeRepository = officeRepository;
    }

    @Override
    public Office createOffice(Office office) {
        if (office.getParentId() != null) {
            Office parent = officeRepository.findById(office.getParentId())
                .orElseThrow(() -> new RuntimeException("Parent office not found"));
            office.setParentOffice(parent);
        }
        return officeRepository.save(office);
    }

    @Override
    public List<Office> getAllOffices() {
        return officeRepository.findAll();
    }

    @Override
    public List<OfficeResponseDTO> getAllOfficesDto() {
        List<Long> accessibleOfficeIds = userOfficeAccessService.getCurrentUserAccessibleOfficeIds();
        
        // If no accessible offices, return empty list
        if (accessibleOfficeIds.isEmpty()) {
            return List.of();
        }
        
        // Get all offices and filter to only accessible ones
        List<Office> allOffices = officeRepository.findAll();
        List<Office> accessibleOffices = allOffices.stream()
                .filter(office -> accessibleOfficeIds.contains(office.getId()))
                .toList();
        
        // Find root offices (offices that are accessible but their parent is not accessible or null)
        List<Office> rootOffices = accessibleOffices.stream()
                .filter(office -> office.getParentOffice() == null || 
                        !accessibleOfficeIds.contains(office.getParentOffice().getId()))
                .toList();
        
        return rootOffices.stream()
                .map(this::convertToDto)
                .toList();
    }

    private OfficeResponseDTO convertToDto(Office office) {
        List<Long> accessibleOfficeIds = userOfficeAccessService.getCurrentUserAccessibleOfficeIds();
        
        OfficeResponseDTO dto = new OfficeResponseDTO(
            office.getId(),
            office.getName(),
            office.getNameBn(),
            office.getParentOffice() != null ? office.getParentOffice().getId() : null,
            office.getType(),
            office.getCode(),
            office.getDescription(),
            office.getOrderIndex(),
            office.getIsActive(),
            office.getCreatedAt(),
            office.getUpdatedAt()
        );
        
        // Convert sub-offices without circular references, but only include accessible ones
        if (office.getSubOffices() != null && !office.getSubOffices().isEmpty()) {
            List<OfficeResponseDTO> subOfficeDtos = office.getSubOffices().stream()
                    .filter(subOffice -> accessibleOfficeIds.contains(subOffice.getId()))
                    .map(this::convertToDto)
                    .toList();
            dto.setSubOffices(subOfficeDtos);
        }
        
        return dto;
    }

    @Override
    public List<Office> getAllParentOffices() {
        return officeRepository.findAll().stream()
            .filter(office -> office.getParentOffice() == null)
            .toList();
    }

    @Override
    public List<Office> getAllFacultyOffices() {
        return officeRepository.findAll().stream()
            .filter(office -> office.getType() == OfficeType.FACULTY)
            .toList();
    }

    @Override
    public List<Office> getAllDepartmentOffices() {
        return officeRepository.findAll().stream()
            .filter(office -> office.getType() == OfficeType.DEPARTMENT)
            .toList();
    }

    @Override
    public Optional<Office> getOfficeById(Long id) {
        return officeRepository.findById(id);
    }

    @Override
    public Office updateOffice(Long id, Office updatedOffice) {
        return officeRepository.findById(id).map(office -> {
            office.setName(updatedOffice.getName());
            office.setNameBn(updatedOffice.getNameBn());
            office.setType(updatedOffice.getType());
            office.setCode(updatedOffice.getCode());
            office.setDescription(updatedOffice.getDescription());
            office.setIsActive(updatedOffice.getIsActive());
            office.setOrderIndex(updatedOffice.getOrderIndex());
            if (updatedOffice.getParentId() != null) {
                Office parent = officeRepository.findById(updatedOffice.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent office not found"));
                office.setParentOffice(parent);
            } else if (updatedOffice.getParentOffice() != null) {
                office.setParentOffice(updatedOffice.getParentOffice());
            }
            return officeRepository.save(office);
        }).orElseThrow(() -> new RuntimeException("Office not found"));
    }

    @Override
    public void deleteOffice(Long id) {
        if (!officeRepository.existsById(id)) {
            throw new NoSuchElementException("Office not found with id: " + id);
        }
        officeRepository.deleteById(id);
    }
}