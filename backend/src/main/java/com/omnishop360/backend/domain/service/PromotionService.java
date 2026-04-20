package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.PromotionCode;
import com.omnishop360.backend.domain.entity.Shop;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.repository.PromotionCodeRepository;
import com.omnishop360.backend.domain.repository.ShopRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.CreatePromotionCodeRequest;
import com.omnishop360.backend.web.dto.PromotionCodeResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionCodeRepository promotionCodeRepository;
    private final TenantRepository tenantRepository;
    private final ShopRepository shopRepository;
    private final UserContextService userContextService;

    @Transactional(readOnly = true)
    public PromotionCode getValidPromotion(UUID tenantId, String promoCode) {
        UUID shopId = userContextService.getCurrentUserShopId().orElse(null);
        PromotionCode promotion = resolvePromotionByContext(tenantId, promoCode, shopId);
        if (!Boolean.TRUE.equals(promotion.getActive())) {
            throw new IllegalArgumentException("Promotion code is not active: " + promoCode);
        }
        LocalDateTime now = LocalDateTime.now();
        if (promotion.getStartsAt() != null && now.isBefore(promotion.getStartsAt())) {
            throw new IllegalArgumentException("Promotion code is not active yet: " + promoCode);
        }
        if (promotion.getEndsAt() != null && now.isAfter(promotion.getEndsAt())) {
            throw new IllegalArgumentException("Promotion code has expired: " + promoCode);
        }
        return promotion;
    }

    @Transactional
    public PromotionCodeResponse createPromotionCode(CreatePromotionCodeRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        Tenant tenant = tenantRepository.findByIdAndDeletedFalse(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));
        UUID currentUserShopId = userContextService.getCurrentUserShopId().orElse(null);
        Shop scopeShop = resolveScopeShop(tenantId, currentUserShopId, request.shopId());

        validatePromotionDateRange(request.startsAt(), request.endsAt());

        String code = request.code() != null && !request.code().isBlank()
                ? request.code().trim().toUpperCase()
                : generateCode();
        if (promotionCodeRepository.findByTenantAndCode(tenantId, code).isPresent()) {
            throw new IllegalArgumentException("Promotion code already exists: " + code);
        }

        PromotionCode promotionCode = new PromotionCode();
        promotionCode.setTenant(tenant);
        promotionCode.setShop(scopeShop);
        promotionCode.setCode(code);
        promotionCode.setDiscountType(request.discountType());
        promotionCode.setDiscountValue(request.discountValue());
        promotionCode.setMaxDiscountAmount(request.maxDiscountAmount());
        promotionCode.setStartsAt(request.startsAt());
        promotionCode.setEndsAt(request.endsAt());
        promotionCode.setAllowWithPriceLevel(Boolean.TRUE.equals(request.allowWithPriceLevel()));
        promotionCode.setActive(request.active() == null || request.active());
        promotionCode = promotionCodeRepository.save(promotionCode);
        return PromotionCodeResponse.from(promotionCode);
    }

    public BigDecimal computePromotionDiscount(PromotionCode promotionCode, BigDecimal subtotal) {
        BigDecimal discount = switch (promotionCode.getDiscountType()) {
            case FIXED -> promotionCode.getDiscountValue();
            case PERCENT -> subtotal.multiply(promotionCode.getDiscountValue()).divide(BigDecimal.valueOf(100));
        };
        if (promotionCode.getMaxDiscountAmount() != null && discount.compareTo(promotionCode.getMaxDiscountAmount()) > 0) {
            discount = promotionCode.getMaxDiscountAmount();
        }
        if (discount.compareTo(BigDecimal.ZERO) < 0) {
            return BigDecimal.ZERO;
        }
        if (discount.compareTo(subtotal) > 0) {
            return subtotal;
        }
        return discount;
    }

    private PromotionCode resolvePromotionByContext(UUID tenantId, String promoCode, UUID shopId) {
        PromotionCode promotion;
        if (shopId != null) {
            promotion = promotionCodeRepository.findByTenantCodeAndShop(tenantId, promoCode, shopId)
                    .or(() -> promotionCodeRepository.findGlobalByTenantAndCode(tenantId, promoCode))
                    .orElseThrow(() -> new EntityNotFoundException("Promotion code not found: " + promoCode));
        } else {
            promotion = promotionCodeRepository.findByTenantAndCode(tenantId, promoCode)
                    .orElseThrow(() -> new EntityNotFoundException("Promotion code not found: " + promoCode));
        }
        return promotion;
    }

    private Shop resolveScopeShop(UUID tenantId, UUID currentUserShopId, UUID requestedShopId) {
        if (SecurityUtils.isShopAdmin()) {
            if (currentUserShopId == null) {
                throw new IllegalArgumentException("Shop admin must be associated with a shop");
            }
            if (requestedShopId != null && !requestedShopId.equals(currentUserShopId)) {
                throw new IllegalArgumentException("Shop admin can only create promotions for their own shop");
            }
            return shopRepository.findByIdAndDeletedFalse(currentUserShopId)
                    .orElseThrow(() -> new EntityNotFoundException("Shop not found with id: " + currentUserShopId));
        }
        if (requestedShopId == null) {
            return null;
        }
        Shop shop = shopRepository.findByIdAndDeletedFalse(requestedShopId)
                .orElseThrow(() -> new EntityNotFoundException("Shop not found with id: " + requestedShopId));
        if (!shop.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException("Shop not found with id: " + requestedShopId);
        }
        return shop;
    }

    private void validatePromotionDateRange(LocalDateTime startsAt, LocalDateTime endsAt) {
        if (startsAt != null && endsAt != null && endsAt.isBefore(startsAt)) {
            throw new IllegalArgumentException("Promotion end date must be after start date");
        }
    }

    private String generateCode() {
        return "PROMO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
