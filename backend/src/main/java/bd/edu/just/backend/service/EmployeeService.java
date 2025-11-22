package bd.edu.just.backend.service;

import bd.edu.just.backend.dto.EmployeeDTO;
import java.util.List;
import java.util.Optional;

public interface EmployeeService {
    List<EmployeeDTO> getAllEmployees();
    Optional<EmployeeDTO> getEmployeeById(Long id);
    EmployeeDTO createEmployee(EmployeeDTO employeeDTO);
    EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO);
    void deleteEmployee(Long id);
    Optional<EmployeeDTO> getEmployeeByCode(String employeeCode);
    Optional<EmployeeDTO> getEmployeeByEmail(String email);
}
