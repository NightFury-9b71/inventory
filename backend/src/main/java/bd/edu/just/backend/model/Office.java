package bd.edu.just.backend.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "offices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"subOffices", "parentOffice", "itemDistributions", "employees"})
public class Office {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "name_bn")
    private String nameBn;

    @OneToMany(mappedBy = "parentOffice", cascade = CascadeType.ALL)
    @JsonIgnore  // Prevent circular reference in JSON serialization
    private List<Office> subOffices;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    @JsonIgnore  // Prevent circular reference in JSON serialization
    private Office parentOffice;

    @Transient
    private Long parentId;

    @OneToMany(mappedBy = "office", cascade = CascadeType.ALL)
    @JsonIgnore  // Prevent loading all distributions
    private List<ItemDistribution> itemDistributions;

    @OneToMany(mappedBy = "office", cascade = CascadeType.ALL)
    @JsonIgnore  // Prevent loading all employees
    private List<Employee> employees;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private OfficeType type;

    @Column(name = "code", unique = true)
    private String code;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Builder
    public Office(String name, String nameBn, OfficeType type, String code, String description) {
        this.name = name;
        this.nameBn = nameBn;
        this.type = type;
        this.code = code;
        this.description = description;
        this.isActive = true;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
