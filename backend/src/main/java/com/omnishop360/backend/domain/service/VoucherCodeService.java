package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.*;
import com.omnishop360.backend.domain.repository.VoucherCodeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VoucherCodeService {

    private final VoucherCodeRepository voucherCodeRepository;

    @Transactional
    public VoucherCode issueVoucher(Tenant tenant, Shop shop, Customer customer, CashRegisterSession session, BigDecimal amount) {
        VoucherCode voucherCode = new VoucherCode();
        voucherCode.setTenant(tenant);
        voucherCode.setShop(shop);
        voucherCode.setCustomer(customer);
        voucherCode.setSourceSession(session);
        voucherCode.setCode(generateVoucherCode());
        voucherCode.setOriginalAmount(amount);
        voucherCode.setRemainingAmount(amount);
        voucherCode.setStatus(VoucherCode.Status.ACTIVE);
        return voucherCodeRepository.save(voucherCode);
    }

    @Transactional
    public BigDecimal redeemVoucher(UUID tenantId, String code, Sale sale) {
        VoucherCode voucher = voucherCodeRepository.findByTenantAndCode(tenantId, code)
                .orElseThrow(() -> new EntityNotFoundException("Voucher not found: " + code));
        if (voucher.getStatus() != VoucherCode.Status.ACTIVE) {
            throw new IllegalArgumentException("Voucher is not active: " + code);
        }
        if (voucher.getRemainingAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Voucher has no remaining amount: " + code);
        }
        BigDecimal appliedAmount = voucher.getRemainingAmount().min(sale.getSubtotal());
        voucher.setRemainingAmount(voucher.getRemainingAmount().subtract(appliedAmount));
        voucher.setRedeemedSale(sale);
        if (voucher.getRemainingAmount().compareTo(BigDecimal.ZERO) == 0) {
            voucher.setStatus(VoucherCode.Status.REDEEMED);
            voucher.setRedeemedAt(LocalDateTime.now());
        }
        voucherCodeRepository.save(voucher);
        return appliedAmount;
    }

    private String generateVoucherCode() {
        return "VCH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
