package bd.edu.just.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfficeInventoryDTO {
    
    private Long officeId;
    
    private String officeName;
    
    private Long itemId;
    
    private String itemName;
    
    private String itemCode;
    
    private Integer quantity;
    
    private String unitName;
}
