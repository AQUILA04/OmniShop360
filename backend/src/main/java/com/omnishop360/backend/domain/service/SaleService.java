package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.*;
import com.omnishop360.backend.domain.repository.*;
import com.omnishop360.backend.domain.repository.specification.SaleSpecification;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.CheckoutRequest;
import com.omnishop360.backend.web.dto.CreatePromotionCodeRequest;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.PromotionCodeResponse;
import com.omnishop360.backend.web.dto.ReceiptFormat;
import com.omnishop360.backend.web.dto.ReceiptResponse;
import com.omnishop360.backend.web.dto.SaleResponse;
import com.omnishop360.backend.web.dto.SaleSearchDto;
import com.omnishop360.backend.web.dto.PromotionValidationResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SaleService {

    private static final String SHOP_REQUIRED_MESSAGE = "User must be associated with a shop to view sales";

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CustomerRepository customerRepository;
    private final ShopRepository shopRepository;
    private final TenantRepository tenantRepository;
    private final SalePaymentRepository salePaymentRepository;
    private final StockService stockService;
    private final CashRegisterSessionService cashRegisterSessionService;
    private final CustomerService customerService;
    private final PromotionService promotionService;
    private final VoucherCodeService voucherCodeService;
    private final UserContextService userContextService;

    @Transactional
    public SaleResponse checkout(CheckoutRequest request) {
        CheckoutContext context = resolveCheckoutContext();
        Sale sale = initializeSale(request, context);
        Totals totals = addItemsAndUpdateStock(request, sale, context);
        applyPromotionIfAny(request, context.tenantId(), sale, totals.subtotal());
        applySaleTotals(sale, totals);
        sale = saleRepository.save(sale);
        applyVoucherIfAny(request, context.tenantId(), sale);
        applyPayments(request, context.tenant(), sale);
        sale = saleRepository.save(sale);
        log.info("Sale completed successfully: saleId={}, saleNumber={}, totalAmount={}", sale.getId(), sale.getSaleNumber(), sale.getTotalAmount());
        return SaleResponse.from(sale);
    }

    private CheckoutContext resolveCheckoutContext() {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = userContextService.getCurrentUserShopId()
                .orElseThrow(() -> new IllegalArgumentException("User must be associated with a shop to process sales"));
        Tenant tenant = tenantRepository.findByIdAndDeletedFalse(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));
        Shop shop = shopRepository.findByIdAndDeletedFalse(shopId)
                .orElseThrow(() -> new EntityNotFoundException("Shop not found with id: " + shopId));
        if (!shop.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException("Shop not found with id: " + shopId);
        }
        CashRegisterSession session = cashRegisterSessionService.getOpenSessionOrThrow(tenantId, shopId);
        return new CheckoutContext(tenantId, shopId, tenant, shop, session);
    }

    private Sale initializeSale(CheckoutRequest request, CheckoutContext context) {
        Customer customer = resolveCustomer(request.customerId(), context.tenantId());
        Sale sale = new Sale();
        sale.setTenant(context.tenant());
        sale.setShop(context.shop());
        sale.setCustomer(customer);
        sale.setCashRegisterSession(context.session());
        sale.setSaleNumber(generateSaleNumber());
        sale.setSaleDate(LocalDateTime.now());
        sale.setPaymentMethod(resolveRequestedPaymentMethod(request));
        sale.setPaymentStatus(Sale.PaymentStatus.PAID);
        sale.setStatus(Sale.SaleStatus.COMPLETED);
        sale.setDiscountAmount(request.discountAmount() != null ? request.discountAmount() : BigDecimal.ZERO);
        sale.setPromoDiscountAmount(BigDecimal.ZERO);
        sale.setVoucherAmount(BigDecimal.ZERO);
        sale.setNotes(request.notes());
        sale.setCreatedBy(SecurityUtils.getCurrentUserKeycloakId().orElse("system"));
        return sale;
    }

    private Sale.PaymentMethod resolveRequestedPaymentMethod(CheckoutRequest request) {
        if (request.paymentMethod() != null) {
            return request.paymentMethod();
        }
        if (request.payments() == null || request.payments().isEmpty()) {
            throw new IllegalArgumentException("Either paymentMethod or payments must be provided");
        }
        if (request.payments().size() > 1) {
            return Sale.PaymentMethod.MIXED;
        }
        return switch (request.payments().get(0).method()) {
            case CARD -> Sale.PaymentMethod.CARD;
            case MOBILE -> Sale.PaymentMethod.MOBILE;
            default -> Sale.PaymentMethod.CASH;
        };
    }

    private Customer resolveCustomer(UUID customerId, UUID tenantId) {
        if (customerId == null) {
            return customerService.getOrCreateWalkInCustomer(tenantId);
        }
        return customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId).orElse(null);
    }

    private Totals addItemsAndUpdateStock(CheckoutRequest request, Sale sale, CheckoutContext context) {
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxAmount = BigDecimal.ZERO;
        for (CheckoutRequest.CheckoutItem itemRequest : request.items()) {
            Product product = loadProduct(context.tenantId(), itemRequest.productId());
            ProductVariant variant = loadVariant(product, itemRequest.variantId());
            SaleItem saleItem = buildSaleItem(itemRequest, sale, context.tenant(), product, variant);
            sale.getItems().add(saleItem);
            subtotal = subtotal.add(saleItem.getSubtotal());
            taxAmount = taxAmount.add(saleItem.getTaxAmount());
            stockService.removeStock(product.getId(), variant != null ? variant.getId() : null, context.shopId(), itemRequest.quantity(), Boolean.TRUE.equals(context.shop().getAllowSaleWithoutStock()));
        }
        return new Totals(subtotal, taxAmount);
    }

    private Product loadProduct(UUID tenantId, UUID productId) {
        Product product = productRepository.findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));
        if (!product.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException("Product not found with id: " + productId);
        }
        if (!Boolean.TRUE.equals(product.getActive())) {
            throw new IllegalArgumentException("Product is not active: " + product.getId());
        }
        return product;
    }

    private ProductVariant loadVariant(Product product, UUID variantId) {
        if (variantId == null) {
            return null;
        }
        ProductVariant variant = productVariantRepository.findByIdAndDeletedFalse(variantId)
                .orElseThrow(() -> new EntityNotFoundException("Product variant not found with id: " + variantId));
        if (!variant.getProduct().getId().equals(product.getId())) {
            throw new EntityNotFoundException("Product variant not found with id: " + variantId);
        }
        if (!Boolean.TRUE.equals(variant.getActive())) {
            throw new IllegalArgumentException("Product variant is not active: " + variant.getId());
        }
        return variant;
    }

    private SaleItem buildSaleItem(CheckoutRequest.CheckoutItem itemRequest, Sale sale, Tenant tenant, Product product, ProductVariant variant) {
        BigDecimal unitPrice = getUnitPrice(product, itemRequest.priceLevel());
        BigDecimal unitCost = product.getCostPrice();
        if (variant != null) {
            if (variant.getSellingPrice() != null) {
                unitPrice = variant.getSellingPrice();
            }
            if (variant.getCostPrice() != null) {
                unitCost = variant.getCostPrice();
            }
        }
        BigDecimal itemSubtotal = unitPrice.multiply(itemRequest.quantity());
        BigDecimal itemTaxAmount = itemSubtotal.multiply(product.getTaxRate()).divide(BigDecimal.valueOf(100));
        SaleItem saleItem = new SaleItem();
        saleItem.setTenant(tenant);
        saleItem.setSale(sale);
        saleItem.setProduct(product);
        saleItem.setVariant(variant);
        saleItem.setQuantity(itemRequest.quantity());
        saleItem.setUnitPrice(unitPrice);
        saleItem.setUnitCost(unitCost);
        saleItem.setTaxRate(product.getTaxRate());
        saleItem.setDiscountAmount(BigDecimal.ZERO);
        saleItem.setSubtotal(itemSubtotal);
        saleItem.setTaxAmount(itemTaxAmount);
        saleItem.setTotalAmount(itemSubtotal.add(itemTaxAmount));
        return saleItem;
    }

    private void applyPromotionIfAny(CheckoutRequest request, UUID tenantId, Sale sale, BigDecimal subtotal) {
        if (request.promoCode() == null || request.promoCode().isBlank()) {
            return;
        }
        PromotionCode promotionCode = promotionService.getValidPromotion(tenantId, request.promoCode().trim());
        if (!Boolean.TRUE.equals(promotionCode.getAllowWithPriceLevel()) && hasPriceLevel(request.items())) {
            throw new IllegalArgumentException("Promotion code cannot be used with selected price level");
        }
        BigDecimal promoDiscount = promotionService.computePromotionDiscount(promotionCode, subtotal);
        sale.setPromoCode(promotionCode.getCode());
        sale.setPromoDiscountAmount(promoDiscount);
    }

    private void applySaleTotals(Sale sale, Totals totals) {
        BigDecimal intermediateTotal = totals.subtotal().add(totals.taxAmount())
                .subtract(sale.getDiscountAmount())
                .subtract(sale.getPromoDiscountAmount());
        if (intermediateTotal.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Total amount cannot be negative");
        }
        sale.setSubtotal(totals.subtotal());
        sale.setTaxAmount(totals.taxAmount());
        sale.setTotalAmount(intermediateTotal);
    }

    private void applyVoucherIfAny(CheckoutRequest request, UUID tenantId, Sale sale) {
        if (request.voucherCode() != null && !request.voucherCode().isBlank()) {
            BigDecimal voucherAmount = voucherCodeService.redeemVoucher(tenantId, request.voucherCode().trim(), sale);
            sale.setVoucherCode(request.voucherCode().trim());
            sale.setVoucherAmount(voucherAmount);
        }
        BigDecimal finalTotal = sale.getTotalAmount().subtract(sale.getVoucherAmount());
        if (finalTotal.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Final total amount cannot be negative");
        }
        sale.setTotalAmount(finalTotal);
    }

    private void applyPayments(CheckoutRequest request, Tenant tenant, Sale sale) {
        List<SalePayment> payments = buildPayments(request, sale, sale.getTotalAmount());
        BigDecimal paidTotal = payments.stream().map(SalePayment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        if (paidTotal.setScale(2, RoundingMode.HALF_UP).compareTo(sale.getTotalAmount().setScale(2, RoundingMode.HALF_UP)) < 0) {
            throw new IllegalArgumentException("Sum of payments must be greater than or equal to final total amount " + sale.getTotalAmount());
        }
        payments.forEach(payment -> payment.setTenant(tenant));
        sale.getPayments().addAll(payments);
        sale.setPaymentMethod(resolvePaymentMethod(request, payments));
        salePaymentRepository.saveAll(payments);
    }

    @Transactional(readOnly = true)
    public PageResponse<SaleResponse> getSales(SaleSearchDto searchDto, Pageable pageable) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = userContextService.getCurrentUserShopId()
                .orElseThrow(() -> new IllegalArgumentException(SHOP_REQUIRED_MESSAGE));

        log.debug("Fetching sales for tenant: {}, shop: {}", tenantId, shopId);

        SaleSearchDto dtoWithShop = SaleSearchDto.builder()
                .shopId(shopId)
                .customerId(searchDto != null ? searchDto.customerId() : null)
                .keyword(searchDto != null ? searchDto.keyword() : null)
                .paymentMethod(searchDto != null ? searchDto.paymentMethod() : null)
                .paymentStatus(searchDto != null ? searchDto.paymentStatus() : null)
                .status(searchDto != null ? searchDto.status() : null)
                .fromDate(searchDto != null ? searchDto.fromDate() : null)
                .toDate(searchDto != null ? searchDto.toDate() : null)
                .build();

        Specification<Sale> spec = SaleSpecification.from(dtoWithShop)
                .and((root, query, cb) -> cb.equal(root.get("tenant").get("id"), tenantId));

        Page<Sale> sales = saleRepository.findAll(spec, pageable);
        Page<SaleResponse> responsePage = sales.map(SaleResponse::from);
        return PageResponse.from(responsePage);
    }

    @Transactional(readOnly = true)
    public SaleResponse getSaleById(UUID saleId) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = userContextService.getCurrentUserShopId()
                .orElseThrow(() -> new IllegalArgumentException(SHOP_REQUIRED_MESSAGE));
        return SaleResponse.from(findSaleForCurrentContext(saleId, tenantId, shopId));
    }

    @Transactional(readOnly = true)
    public ReceiptResponse getReceipt(UUID saleId, ReceiptFormat format) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = userContextService.getCurrentUserShopId()
                .orElseThrow(() -> new IllegalArgumentException(SHOP_REQUIRED_MESSAGE));
        SaleResponse sale = SaleResponse.from(findSaleForCurrentContext(saleId, tenantId, shopId));
        return ReceiptResponse.builder()
                .format(format)
                .sale(sale)
                .build();
    }

    @Transactional(readOnly = true)
    public PromotionValidationResponse validatePromotion(String code, BigDecimal subtotal) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        PromotionCode promotionCode = promotionService.getValidPromotion(tenantId, code);
        BigDecimal discount = promotionService.computePromotionDiscount(promotionCode, subtotal);
        return PromotionValidationResponse.builder()
                .code(promotionCode.getCode())
                .discountAmount(discount)
                .build();
    }

    @Transactional
    public PromotionCodeResponse createPromotionCode(CreatePromotionCodeRequest request) {
        return promotionService.createPromotionCode(request);
    }

    private List<SalePayment> buildPayments(CheckoutRequest request, Sale sale, BigDecimal totalAmount) {
        List<SalePayment> payments = new ArrayList<>();
        if (request.payments() != null && !request.payments().isEmpty()) {
            for (CheckoutRequest.PaymentItem paymentItem : request.payments()) {
                SalePayment payment = new SalePayment();
                payment.setSale(sale);
                payment.setMethod(SalePayment.Method.valueOf(paymentItem.method().name()));
                payment.setAmount(paymentItem.amount());
                payment.setReference(paymentItem.reference());
                payments.add(payment);
            }
            return payments;
        }

        Sale.PaymentMethod fallbackMethod = request.paymentMethod();
        if (fallbackMethod == null) {
            throw new IllegalArgumentException("Either paymentMethod or payments must be provided");
        }
        SalePayment payment = new SalePayment();
        payment.setSale(sale);
        payment.setMethod(switch (fallbackMethod) {
            case CARD -> SalePayment.Method.CARD;
            case MOBILE -> SalePayment.Method.MOBILE;
            default -> SalePayment.Method.CASH;
        });
        payment.setAmount(totalAmount);
        payments.add(payment);
        return payments;
    }

    private Sale.PaymentMethod resolvePaymentMethod(CheckoutRequest request, List<SalePayment> payments) {
        if (payments.size() == 1) {
            return switch (payments.get(0).getMethod()) {
                case CARD -> Sale.PaymentMethod.CARD;
                case MOBILE -> Sale.PaymentMethod.MOBILE;
                default -> Sale.PaymentMethod.CASH;
            };
        }
        if (request.paymentMethod() != null && request.paymentMethod() != Sale.PaymentMethod.MIXED) {
            return request.paymentMethod();
        }
        return Sale.PaymentMethod.MIXED;
    }

    private boolean hasPriceLevel(List<CheckoutRequest.CheckoutItem> items) {
        return items.stream().anyMatch(item -> item.priceLevel() != null && item.priceLevel() != CheckoutRequest.PriceLevel.BASE);
    }

    private BigDecimal getUnitPrice(Product product, CheckoutRequest.PriceLevel level) {
        if (level == null || level == CheckoutRequest.PriceLevel.BASE) {
            return product.getSellingPrice();
        }
        return switch (level) {
            case LEVEL_1 -> product.getPriceLevel1() != null ? product.getPriceLevel1() : product.getSellingPrice();
            case LEVEL_2 -> product.getPriceLevel2() != null ? product.getPriceLevel2() : product.getSellingPrice();
            case LEVEL_3 -> product.getPriceLevel3() != null ? product.getPriceLevel3() : product.getSellingPrice();
            case BASE -> product.getSellingPrice();
        };
    }

    private Sale findSaleForCurrentContext(UUID saleId, UUID tenantId, UUID shopId) {
        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new EntityNotFoundException("Sale not found with id: " + saleId));
        if (!sale.getTenant().getId().equals(tenantId) || !sale.getShop().getId().equals(shopId)) {
            throw new EntityNotFoundException("Sale not found with id: " + saleId);
        }
        return sale;
    }

    private String generateSaleNumber() {
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(7);
        return "SALE-" + datePrefix + "-" + timestamp;
    }

    private record CheckoutContext(
            UUID tenantId,
            UUID shopId,
            Tenant tenant,
            Shop shop,
            CashRegisterSession session
    ) {
    }

    private record Totals(BigDecimal subtotal, BigDecimal taxAmount) {
    }
}
