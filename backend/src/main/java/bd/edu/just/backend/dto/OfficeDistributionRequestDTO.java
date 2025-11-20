package bd.edu.just.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfficeDistributionRequestDTO {
    
    private Long itemId;
    
    private Long fromOfficeId;
    
    private Long toOfficeId;
    
    private Integer quantity;
    
    private String remarks;
    
    private Long initiatedByUserId;
}
