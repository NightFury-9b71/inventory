package bd.edu.just.backend.service;

import bd.edu.just.backend.dto.EmployeeDTO;
import bd.edu.just.backend.model.Employee;
import bd.edu.just.backend.model.Office;
import bd.edu.just.backend.repository.EmployeeRepository;
import bd.edu.just.backend.repository.OfficeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private OfficeRepository officeRepository;

    @Override
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<EmployeeDTO> getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
        Office office = officeRepository.findById(employeeDTO.getOfficeId())
                .orElseThrow(() -> new RuntimeException("Office not found"));

        Employee employee = new Employee();
        employee.setName(employeeDTO.getName());
        employee.setNameBn(employeeDTO.getNameBn());
        employee.setDesignation(employeeDTO.getDesignation());
        employee.setEmployeeCode(employeeDTO.getEmployeeCode());
        employee.setOffice(office);
        employee.setEmail(employeeDTO.getEmail());
        employee.setPhone(employeeDTO.getPhone());
        employee.setIsActive(employeeDTO.getIsActive() != null ? employeeDTO.getIsActive() : true);

        Employee savedEmployee = employeeRepository.save(employee);
        return convertToDTO(savedEmployee);
    }

    @Override
    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (employeeDTO.getName() != null) {
            employee.setName(employeeDTO.getName());
        }
        if (employeeDTO.getNameBn() != null) {
            employee.setNameBn(employeeDTO.getNameBn());
        }
        if (employeeDTO.getDesignation() != null) {
            employee.setDesignation(employeeDTO.getDesignation());
        }
        if (employeeDTO.getEmployeeCode() != null) {
            employee.setEmployeeCode(employeeDTO.getEmployeeCode());
        }
        if (employeeDTO.getOfficeId() != null) {
            Office office = officeRepository.findById(employeeDTO.getOfficeId())
                    .orElseThrow(() -> new RuntimeException("Office not found"));
            employee.setOffice(office);
        }
        if (employeeDTO.getEmail() != null) {
            employee.setEmail(employeeDTO.getEmail());
        }
        if (employeeDTO.getPhone() != null) {
            employee.setPhone(employeeDTO.getPhone());
        }
        if (employeeDTO.getIsActive() != null) {
            employee.setIsActive(employeeDTO.getIsActive());
        }

        Employee updatedEmployee = employeeRepository.save(employee);
        return convertToDTO(updatedEmployee);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        employeeRepository.delete(employee);
    }

    @Override
    public Optional<EmployeeDTO> getEmployeeByCode(String employeeCode) {
        Employee employee = employeeRepository.findByEmployeeCode(employeeCode);
        return Optional.ofNullable(employee).map(this::convertToDTO);
    }

    @Override
    public Optional<EmployeeDTO> getEmployeeByEmail(String email) {
        Employee employee = employeeRepository.findByEmail(email);
        return Optional.ofNullable(employee).map(this::convertToDTO);
    }

    private EmployeeDTO convertToDTO(Employee employee) {
        return new EmployeeDTO(
                employee.getId(),
                employee.getName(),
                employee.getNameBn(),
                employee.getDesignation(),
                employee.getEmployeeCode(),
                employee.getOffice().getId(),
                employee.getOffice().getName(),
                employee.getEmail(),
                employee.getPhone(),
                employee.getIsActive(),
                null,  // createdAt not exposed in model
                null   // updatedAt not exposed in model
        );
    }
}
