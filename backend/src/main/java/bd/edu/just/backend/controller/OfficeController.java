package bd.edu.just.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import bd.edu.just.backend.service.OfficeService;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.dto.OfficeResponseDTO;
import bd.edu.just.backend.dto.SimpleOfficeDTO;
import java.util.List;

@RestController
@RequestMapping("/api/offices")
public class OfficeController {
    
    private final OfficeService officeService;

    @Autowired
    public OfficeController(OfficeService officeService) {
        this.officeService = officeService;
    }

    @PostMapping
    public ResponseEntity<Office> createOffice(@RequestBody Office office) {
        Office createdOffice = officeService.createOffice(office);
        return ResponseEntity.ok(createdOffice);
    }

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OfficeResponseDTO>> getAllOffices() {
        List<OfficeResponseDTO> offices = officeService.getAllOfficesDto();
        return ResponseEntity.ok(offices);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SimpleOfficeDTO>> getAllOfficesUnfiltered() {
        List<Office> offices = officeService.getAllOffices();
        // Convert to simple DTOs without nested structure to avoid circular references
        List<SimpleOfficeDTO> officeDTOs = offices.stream()
                .map(office -> new SimpleOfficeDTO(
                    office.getId(),
                    office.getName(),
                    office.getCode(),
                    office.getType(),
                    office.getParentOffice() != null ? office.getParentOffice().getId() : null,
                    office.getIsActive()
                ))
                .toList();
        return ResponseEntity.ok(officeDTOs);
    }

    @GetMapping("/parent")
    // @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Office>> getAllParentOffices() {
        List<Office> parentOffices = officeService.getAllParentOffices();
        return ResponseEntity.ok(parentOffices);
    }

    @GetMapping("/faculties")
    public ResponseEntity<List<Office>> getAllFacultyOffices() {
        List<Office> facultyOffices = officeService.getAllFacultyOffices();
        return ResponseEntity.ok(facultyOffices);
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Office>> getAllDepartmentOffices() {
        List<Office> departmentOffices = officeService.getAllDepartmentOffices();
        return ResponseEntity.ok(departmentOffices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Office> getOfficeById(@PathVariable Long id) {
        Office office = officeService.getOfficeById(id)
            .orElseThrow(() -> new RuntimeException("Office not found with id: " + id));
        return ResponseEntity.ok(office);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Office> updateOffice(@PathVariable Long id, @RequestBody Office updatedOffice) {
        Office office = officeService.updateOffice(id, updatedOffice);
        return ResponseEntity.ok(office);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffice(@PathVariable Long id) {
        officeService.deleteOffice(id);
        return ResponseEntity.noContent().build();
    }
}