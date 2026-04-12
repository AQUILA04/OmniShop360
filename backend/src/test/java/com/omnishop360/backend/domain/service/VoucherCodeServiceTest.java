package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.*;
import com.omnishop360.backend.domain.repository.VoucherCodeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VoucherCodeServiceTest {

    @Mock
    private VoucherCodeRepository voucherCodeRepository;

    @InjectMocks
    private VoucherCodeService service;

    @Test
    void shouldIssueVoucher() {
        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        Shop shop = new Shop();
        shop.setId(UUID.randomUUID());
        shop.setTenant(tenant);
        when(voucherCodeRepository.save(any(VoucherCode.class))).thenAnswer(i -> i.getArgument(0));

        VoucherCode issued = service.issueVoucher(tenant, shop, null, null, new BigDecimal("500"));
        assertNotNull(issued.getCode());
        assertEquals(0, issued.getOriginalAmount().compareTo(new BigDecimal("500")));
    }

    @Test
    void shouldRedeemVoucher() {
        UUID tenantId = UUID.randomUUID();
        Sale sale = new Sale();
        sale.setSubtotal(new BigDecimal("400"));
        VoucherCode voucherCode = new VoucherCode();
        voucherCode.setCode("VCH-123");
        voucherCode.setStatus(VoucherCode.Status.ACTIVE);
        voucherCode.setRemainingAmount(new BigDecimal("300"));

        when(voucherCodeRepository.findByTenantAndCode(tenantId, "VCH-123")).thenReturn(Optional.of(voucherCode));
        when(voucherCodeRepository.save(any(VoucherCode.class))).thenAnswer(i -> i.getArgument(0));

        BigDecimal applied = service.redeemVoucher(tenantId, "VCH-123", sale);
        assertEquals(0, applied.compareTo(new BigDecimal("300")));
    }
}
