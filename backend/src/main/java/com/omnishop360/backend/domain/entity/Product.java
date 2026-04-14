package com.omnishop360.backend.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.hibernate.envers.RelationTargetAuditMode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Audited
@Table(name = "products")
@Getter
@Setter
public class Product extends BaseEntity {

    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false, updatable = false)
    private Tenant tenant;

    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "sku", nullable = false, length = 100)
    private String sku;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "barcode", length = 100)
    private String barcode;

    @Column(name = "unit", nullable = false, length = 50)
    private String unit = "UNIT";

    @Column(name = "cost_price", nullable = false, precision = 19, scale = 4)
    private BigDecimal costPrice = BigDecimal.ZERO;

    @Column(name = "selling_price", nullable = false, precision = 19, scale = 4)
    private BigDecimal sellingPrice;

    @Column(name = "tax_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal taxRate = BigDecimal.ZERO;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @NotAudited
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (this.active == null) {
            this.active = true;
        }
        if (this.costPrice == null) {
            this.costPrice = BigDecimal.ZERO;
        }
        if (this.taxRate == null) {
            this.taxRate = BigDecimal.ZERO;
        }
        if (this.unit == null) {
            this.unit = "UNIT";
        }
    }
}

