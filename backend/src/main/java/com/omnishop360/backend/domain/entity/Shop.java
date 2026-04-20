package com.omnishop360.backend.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "shops")
@Getter
@Setter
public class Shop extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false, updatable = false)
    private Tenant tenant;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "address", nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "allow_sale_without_stock", nullable = false)
    private Boolean allowSaleWithoutStock = false;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (this.active == null) {
            this.active = true;
        }
        if (this.allowSaleWithoutStock == null) {
            this.allowSaleWithoutStock = false;
        }
    }
}

