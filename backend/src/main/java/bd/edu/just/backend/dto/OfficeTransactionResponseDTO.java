package bd.edu.just.backend.dto;

import bd.edu.just.backend.model.TransactionType;
import bd.edu.just.backend.model.OfficeItemTransaction.TransactionStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfficeTransactionResponseDTO {
    
    private Long id;
    
    private Long itemId;
    
    private String itemName;
    
    private String itemCode;
    
    private Long fromOfficeId;
    
    private String fromOfficeName;
    
    private Long toOfficeId;
    
    private String toOfficeName;
    
    private TransactionType transactionType;
    
    private Integer quantity;
    
    private Long initiatedByUserId;
    
    private String initiatedByUserName;
    
    private Long approvedByUserId;
    
    private String approvedByUserName;
    
    private TransactionStatus status;
    
    private LocalDateTime transactionDate;
    
    private LocalDateTime approvedDate;
    
    private String remarks;
    
    private String rejectionReason;
    
    private String referenceNumber;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
