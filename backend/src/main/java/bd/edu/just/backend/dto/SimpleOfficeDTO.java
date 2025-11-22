package bd.edu.just.backend.dto;

import bd.edu.just.backend.model.OfficeType;

/**
 * Simple Office DTO without nested structures
 * Used for dropdowns and forms to avoid circular reference issues
 */
public class SimpleOfficeDTO {
    private Long id;
    private String name;
    private String code;
    private OfficeType type;
    private Long parentId;
    private Boolean isActive;

    public SimpleOfficeDTO() {}

    public SimpleOfficeDTO(Long id, String name, String code, OfficeType type, Long parentId, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.type = type;
        this.parentId = parentId;
        this.isActive = isActive;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public OfficeType getType() {
        return type;
    }

    public void setType(OfficeType type) {
        this.type = type;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
