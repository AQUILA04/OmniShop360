package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.PromotionCode;
import com.omnishop360.backend.domain.entity.Shop;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.repository.PromotionCodeRepository;
import com.omnishop360.backend.domain.repository.ShopRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.web.dto.CreatePromotionCodeRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PromotionServiceTest {

    @Mock
    private PromotionCodeRepository promotionCodeRepository;
    @Mock
    private TenantRepository tenantRepository;
    @Mock
    private ShopRepository shopRepository;
    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private PromotionService service;

    @Test
    void shouldValidatePromotionAndComputeDiscount() {
        UUID tenantId = UUID.randomUUID();
        UUID shopId = UUID.randomUUID();
        PromotionCode code = new PromotionCode();
        code.setCode("PROMO10");
        code.setActive(true);
        code.setDiscountType(PromotionCode.DiscountType.PERCENT);
        code.setDiscountValue(new BigDecimal("10"));

        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(promotionCodeRepository.findByTenantCodeAndShop(tenantId, "PROMO10", shopId)).thenReturn(Optional.of(code));
        PromotionCode valid = service.getValidPromotion(tenantId, "PROMO10");
        assertNotNull(valid);
        assertEquals("PROMO10", valid.getCode());
        assertEquals(0, service.computePromotionDiscount(valid, new BigDecimal("100.00")).compareTo(new BigDecimal("10.00")));
    }

    @Test
    void shouldCreateGlobalPromotionForTenantAdmin() {
        UUID tenantId = UUID.randomUUID();
        Tenant tenant = new Tenant();
        tenant.setId(tenantId);
        CreatePromotionCodeRequest request = new CreatePromotionCodeRequest(
                "PROMO1000",
                PromotionCode.DiscountType.FIXED,
                new BigDecimal("1000"),
                new BigDecimal("1000"),
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(5),
                false,
                true,
                null
        );

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.empty());
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(promotionCodeRepository.findByTenantAndCode(tenantId, "PROMO1000")).thenReturn(Optional.empty());
        when(promotionCodeRepository.save(any(PromotionCode.class))).thenAnswer(i -> i.getArgument(0));

        var response = service.createPromotionCode(request);

        assertNotNull(response);
        assertEquals("PROMO1000", response.code());
    }

    @Test
    void shouldCreateShopScopedPromotionForShopAdmin() {
        UUID tenantId = UUID.randomUUID();
        UUID shopId = UUID.randomUUID();
        Tenant tenant = new Tenant();
        tenant.setId(tenantId);
        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setTenant(tenant);
        CreatePromotionCodeRequest request = new CreatePromotionCodeRequest(
                null,
                PromotionCode.DiscountType.PERCENT,
                new BigDecimal("5"),
                null,
                null,
                null,
                false,
                true,
                shopId
        );

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(promotionCodeRepository.findByTenantAndCode(any(), any())).thenReturn(Optional.empty());
        when(promotionCodeRepository.save(any(PromotionCode.class))).thenAnswer(i -> i.getArgument(0));

        var response = service.createPromotionCode(request);

        assertNotNull(response);
        assertEquals(shopId, response.shopId());
    }
}
