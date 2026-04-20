package com.omnishop360.backend.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.hibernate.envers.RelationTargetAuditMode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Audited
@Table(name = "sales", uniqueConstraints = {
    @UniqueConstraint(name = "uk_sale_number_tenant", columnNames = {"tenant_id", "sale_number"})
})
@Getter
@Setter
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false, updatable = false)
    private Tenant tenant;

    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false, updatable = false)
    private Shop shop;

    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "sale_number", nullable = false, length = 100)
    private String saleNumber;

    @Column(name = "sale_date", nullable = false)
    private LocalDateTime saleDate;

    @Column(name = "subtotal", nullable = false, precision = 19, scale = 4)
    private BigDecimal subtotal;

    @Column(name = "tax_amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal taxAmount;

    @Column(name = "discount_amount", precision = 19, scale = 4)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "promo_code", length = 100)
    private String promoCode;

    @Column(name = "promo_discount_amount", precision = 19, scale = 4)
    private BigDecimal promoDiscountAmount = BigDecimal.ZERO;

    @Column(name = "voucher_code", length = 100)
    private String voucherCode;

    @Column(name = "voucher_amount", precision = 19, scale = 4)
    private BigDecimal voucherAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal totalAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cash_register_session_id")
    private CashRegisterSession cashRegisterSession;

    @Column(name = "payment_method", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(name = "payment_status", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PAID;

    @Column(name = "status", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private SaleStatus status = SaleStatus.COMPLETED;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by", length = 255)
    private String createdBy;

    @Column(name = "updated_by", length = 255)
    private String updatedBy;

    @Version
    @Column(name = "version")
    private Long version;

    @NotAudited
    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<SaleItem> items = new ArrayList<>();

    @NotAudited
    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<SalePayment> payments = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = LocalDateTime.now();
        }
        if (this.saleDate == null) {
            this.saleDate = LocalDateTime.now();
        }
        if (this.discountAmount == null) {
            this.discountAmount = BigDecimal.ZERO;
        }
        if (this.promoDiscountAmount == null) {
            this.promoDiscountAmount = BigDecimal.ZERO;
        }
        if (this.voucherAmount == null) {
            this.voucherAmount = BigDecimal.ZERO;
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = PaymentStatus.PAID;
        }
        if (this.status == null) {
            this.status = SaleStatus.COMPLETED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum PaymentMethod {
        CASH, CARD, MOBILE, MIXED
    }

    public enum PaymentStatus {
        PAID, PENDING, CANCELLED
    }

    public enum SaleStatus {
        COMPLETED, CANCELLED, RETURNED
    }
}
