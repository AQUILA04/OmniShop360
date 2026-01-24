package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.*;
import com.omnishop360.backend.domain.repository.*;
import com.omnishop360.backend.domain.repository.specification.SaleSpecification;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.CheckoutRequest;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.SaleResponse;
import com.omnishop360.backend.web.dto.SaleSearchDto;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CustomerRepository customerRepository;
    private final ShopRepository shopRepository;
    private final TenantRepository tenantRepository;
    private final StockService stockService;
    private final UserContextService userContextService;

    @Transactional
    public SaleResponse checkout(CheckoutRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = userContextService.getCurrentUserShopId()
                .orElseThrow(() -> new IllegalArgumentException("User must be associated with a shop to process sales"));

        log.info("Processing checkout for tenant: {}, shop: {} with {} items", tenantId, shopId, request.items().size());

        Tenant tenant = tenantRepository.findByIdAndDeletedFalse(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));

        Shop shop = shopRepository.findByIdAndDeletedFalse(shopId)
                .orElseThrow(() -> new EntityNotFoundException("Shop not found with id: " + shopId));

        if (!shop.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException("Shop not found with id: " + shopId);
        }

        Customer customer = null;
        if (request.customerId() != null) {
            log.debug("Looking for customer: {} in tenant: {}", request.customerId(), tenantId);
            customer = customerRepository.findByIdAndTenantIdAndDeletedFalse(request.customerId(), tenantId)
                    .orElse(null);
            if (customer == null) {
                log.warn("Customer not found: id={}, tenantId={}. Proceeding with anonymous sale.", request.customerId(), tenantId);
            } else {
                log.debug("Customer found: {} for tenant: {}", customer.getId(), tenantId);
            }
        }

        String saleNumber = generateSaleNumber(tenantId);

        Sale sale = new Sale();
        sale.setTenant(tenant);
        sale.setShop(shop);
        sale.setCustomer(customer);
        sale.setSaleNumber(saleNumber);
        sale.setSaleDate(LocalDateTime.now());
        sale.setPaymentMethod(request.paymentMethod());
        sale.setPaymentStatus(Sale.PaymentStatus.PAID);
        sale.setStatus(Sale.SaleStatus.COMPLETED);
        sale.setDiscountAmount(request.discountAmount() != null ? request.discountAmount() : BigDecimal.ZERO);
        sale.setNotes(request.notes());
        sale.setCreatedBy(SecurityUtils.getCurrentUserKeycloakId().orElse("system"));

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal taxAmount = BigDecimal.ZERO;

        for (CheckoutRequest.CheckoutItem itemRequest : request.items()) {
            Product product = productRepository.findByIdAndDeletedFalse(itemRequest.productId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + itemRequest.productId()));

            if (!product.getTenant().getId().equals(tenantId)) {
                throw new EntityNotFoundException("Product not found with id: " + itemRequest.productId());
            }

            if (!product.getActive()) {
                throw new IllegalArgumentException("Product is not active: " + product.getId());
            }

            ProductVariant variant = null;
            BigDecimal unitPrice = product.getSellingPrice();
            BigDecimal unitCost = product.getCostPrice();
            BigDecimal taxRate = product.getTaxRate();

            if (itemRequest.variantId() != null) {
                variant = productVariantRepository.findByIdAndDeletedFalse(itemRequest.variantId())
                        .orElseThrow(() -> new EntityNotFoundException("Product variant not found with id: " + itemRequest.variantId()));
                if (!variant.getProduct().getId().equals(product.getId())) {
                    throw new EntityNotFoundException("Product variant not found with id: " + itemRequest.variantId());
                }
                if (variant.getSellingPrice() != null) {
                    unitPrice = variant.getSellingPrice();
                }
                if (variant.getCostPrice() != null) {
                    unitCost = variant.getCostPrice();
                }
            }

            SaleItem saleItem = new SaleItem();
            saleItem.setTenant(tenant);
            saleItem.setSale(sale);
            saleItem.setProduct(product);
            saleItem.setVariant(variant);
            saleItem.setQuantity(itemRequest.quantity());
            saleItem.setUnitPrice(unitPrice);
            saleItem.setUnitCost(unitCost);
            saleItem.setTaxRate(taxRate);
            saleItem.setDiscountAmount(BigDecimal.ZERO);

            BigDecimal itemSubtotal = unitPrice.multiply(itemRequest.quantity());
            BigDecimal itemTaxAmount = itemSubtotal.multiply(taxRate).divide(BigDecimal.valueOf(100));
            BigDecimal itemTotal = itemSubtotal.add(itemTaxAmount);

            saleItem.setSubtotal(itemSubtotal);
            saleItem.setTaxAmount(itemTaxAmount);
            saleItem.setTotalAmount(itemTotal);

            sale.getItems().add(saleItem);
            subtotal = subtotal.add(itemSubtotal);
            taxAmount = taxAmount.add(itemTaxAmount);

            stockService.removeStock(product.getId(), variant != null ? variant.getId() : null, shopId, itemRequest.quantity());
        }

        BigDecimal totalAmount = subtotal.add(taxAmount).subtract(sale.getDiscountAmount());

        sale.setSubtotal(subtotal);
        sale.setTaxAmount(taxAmount);
        sale.setTotalAmount(totalAmount);

        sale = saleRepository.save(sale);

        log.info("Sale completed successfully: saleId={}, saleNumber={}, totalAmount={}", 
                sale.getId(), sale.getSaleNumber(), sale.getTotalAmount());

        return SaleResponse.from(sale);
    }

    @Transactional(readOnly = true)
    public PageResponse<SaleResponse> getSales(SaleSearchDto searchDto, Pageable pageable) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = userContextService.getCurrentUserShopId()
                .orElseThrow(() -> new IllegalArgumentException("User must be associated with a shop to view sales"));

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

        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new EntityNotFoundException("Sale not found with id: " + saleId));

        if (!sale.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException("Sale not found with id: " + saleId);
        }

        return SaleResponse.from(sale);
    }

    private String generateSaleNumber(UUID tenantId) {
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String timestamp = String.valueOf(System.currentTimeMillis()).substring(7);
        return "SALE-" + datePrefix + "-" + timestamp;
    }
}
