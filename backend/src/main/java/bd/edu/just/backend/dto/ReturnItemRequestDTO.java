package bd.edu.just.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnItemRequestDTO {
    
    private Long itemId;
    
    private Long fromOfficeId;  // Child office returning item
    
    private Long toOfficeId;    // Parent office receiving item
    
    private Integer quantity;
    
    private String remarks;
    
    private String returnReason;
    
    private Long initiatedByUserId;
}
