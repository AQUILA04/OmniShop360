package com.omnishop360.backend.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tenants")
@Getter
@Setter
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false, length = 255)
    private String companyName;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "email", nullable = false, length = 255)
    private String contactEmail;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "pricing_policy", nullable = false, length = 50)
    private String pricingPolicy = "GLOBAL_ENFORCED";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50, insertable = false, updatable = false)
    private TenantStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Version
    @Column(name = "version")
    private Long version;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @OneToMany(mappedBy = "tenant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<User> admins = new ArrayList<>();

    @PostLoad
    private void mapActiveToStatus() {
        if (this.status == null && this.active != null) {
            this.status = this.active ? TenantStatus.ACTIVE : TenantStatus.SUSPENDED;
        }
        if (this.deleted != null && this.deleted) {
            this.status = TenantStatus.DELETED;
        }
    }

    @PrePersist
    protected void onCreate() {
        if (this.deleted == null) {
            this.deleted = false;
        }
        if (this.status == null) {
            this.status = TenantStatus.ACTIVE;
        }
        if (this.active == null) {
            this.active = this.status == TenantStatus.ACTIVE;
        }
        if (this.deleted != null && this.deleted) {
            this.status = TenantStatus.DELETED;
        }
    }

    @PreUpdate
    private void mapStatusToActive() {
        if (this.status == null) {
            this.status = TenantStatus.ACTIVE;
        }
        if (this.active == null) {
            this.active = this.status == TenantStatus.ACTIVE;
        }
        if (this.deleted != null && this.deleted) {
            this.status = TenantStatus.DELETED;
        }
    }
}

