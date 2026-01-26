package com.omnishop360.backend.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "customers")
@Getter
@Setter
public class Customer extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false, updatable = false)
    private Tenant tenant;

    @Column(name = "first_name", length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "loyalty_points")
    private Integer loyaltyPoints = 0;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @PrePersist
    protected void onCreate() {
        super.onCreate();
        if (this.active == null) {
            this.active = true;
        }
        if (this.loyaltyPoints == null) {
            this.loyaltyPoints = 0;
        }
    }
}
