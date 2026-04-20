package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.*;
import com.omnishop360.backend.domain.repository.*;
import com.omnishop360.backend.domain.repository.specification.StockSpecification;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.StockMovementRequest;
import com.omnishop360.backend.web.dto.StockResponse;
import com.omnishop360.backend.web.dto.StockSearchDto;
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
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockService {

    private final StockRepository stockRepository;
    private final StockMovementRepository stockMovementRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ShopRepository shopRepository;
    private final TenantRepository tenantRepository;
    private final UserContextService userContextService;

    @Transactional
    public StockResponse addStock(StockMovementRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = userContextService.getCurrentUserShopId()
                .orElseThrow(() -> new IllegalArgumentException("User must be associated with a shop to manage stock"));

        log.info("Adding stock: productId={}, variantId={}, quantity={} for shop={}", 
                request.productId(), request.variantId(), request.quantity(), shopId);

        Tenant tenant = tenantRepository.findByIdAndDeletedFalse(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));

        Shop shop = shopRepository.findByIdAndDeletedFalse(shopId)
                .orElseThrow(() -> new EntityNotFoundException("Shop not found with id: " + shopId));

        if (!shop.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException("Shop not found with id: " + shopId);
        }

        Product product = productRepository.findByIdAndDeletedFalse(request.productId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + request.productId()));

        if (!product.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException("Product not found with id: " + request.productId());
        }

        ProductVariant variant = null;
        if (request.variantId() != null) {
            variant = productVariantRepository.findByIdAndDeletedFalse(request.variantId())
                    .orElseThrow(() -> new EntityNotFoundException("Product variant not found with id: " + request.variantId()));
            if (!variant.getTenant().getId().equals(tenantId) || !variant.getProduct().getId().equals(product.getId())) {
                throw new EntityNotFoundException("Product variant not found with id: " + request.variantId());
            }
        }

        Stock stock = findOrCreateStock(tenant, shop, product, variant);
        stock.setQuantity(stock.getQuantity().add(request.quantity()));
        stock.setLastRestockDate(LocalDateTime.now());
        stock = stockRepository.save(stock);

        StockMovement movement = new StockMovement();
        movement.setTenant(tenant);
        movement.setShop(shop);
        movement.setProduct(product);
        movement.setVariant(variant);
        movement.setMovementType(StockMovement.MovementType.RECEIPT);
        movement.setQuantity(request.quantity());
        movement.setUnitCost(request.unitCost());
        movement.setNotes(request.notes());
        movement.setCreatedBy(SecurityUtils.getCurrentUserKeycloakId().orElse("system"));
        stockMovementRepository.save(movement);

        log.info("Stock added successfully: stockId={}, newQuantity={}", stock.getId(), stock.getQuantity());
        return StockResponse.from(stock);
    }

    @Transactional
    public void removeStock(UUID productId, UUID variantId, UUID shopId, BigDecimal quantity) {
        doRemoveStock(productId, variantId, shopId, quantity, false);
    }

    @Transactional
    public void removeStock(UUID productId, UUID variantId, UUID shopId, BigDecimal quantity, boolean allowSaleWithoutStock) {
        doRemoveStock(productId, variantId, shopId, quantity, allowSaleWithoutStock);
    }

    private void doRemoveStock(UUID productId, UUID variantId, UUID shopId, BigDecimal quantity, boolean allowSaleWithoutStock) {
        UUID tenantId = userContextService.getCurrentUserTenantId();

        log.info("Removing stock: productId={}, variantId={}, quantity={} for shop={}", 
                productId, variantId, quantity, shopId);

        Tenant tenant = tenantRepository.findByIdAndDeletedFalse(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));

        Shop shop = shopRepository.findByIdAndDeletedFalse(shopId)
                .orElseThrow(() -> new EntityNotFoundException("Shop not found with id: " + shopId));

        Product product = productRepository.findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

        ProductVariant variant = null;
        if (variantId != null) {
            variant = productVariantRepository.findByIdAndDeletedFalse(variantId)
                    .orElseThrow(() -> new EntityNotFoundException("Product variant not found with id: " + variantId));
        }

        Stock stock = findStock(tenantId, shopId, productId, variantId).orElse(null);

        if (stock == null) {
            if (!allowSaleWithoutStock) {
                throw new EntityNotFoundException("Stock not found for product: " + productId);
            }
            stock = findOrCreateStock(tenant, shop, product, variant);
        }

        if (!allowSaleWithoutStock && stock.getAvailableQuantity().compareTo(quantity) < 0) {
            throw new IllegalArgumentException("Insufficient stock. Available: " + stock.getAvailableQuantity() + ", Requested: " + quantity);
        }

        stock.setQuantity(stock.getQuantity().subtract(quantity));
        stockRepository.save(stock);

        StockMovement movement = new StockMovement();
        movement.setTenant(tenant);
        movement.setShop(shop);
        movement.setProduct(product);
        movement.setVariant(variant);
        movement.setMovementType(StockMovement.MovementType.SALE);
        movement.setQuantity(quantity.negate());
        movement.setCreatedBy(SecurityUtils.getCurrentUserKeycloakId().orElse("system"));
        stockMovementRepository.save(movement);

        log.info("Stock removed successfully: stockId={}, newQuantity={}", stock.getId(), stock.getQuantity());
    }

    @Transactional(readOnly = true)
    public PageResponse<StockResponse> getInventory(StockSearchDto searchDto, Pageable pageable) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = userContextService.getCurrentUserShopId()
                .orElseThrow(() -> new IllegalArgumentException("User must be associated with a shop to view inventory"));

        log.debug("Fetching inventory for tenant: {}, shop: {}", tenantId, shopId);

        StockSearchDto dtoWithShop = StockSearchDto.builder()
                .shopId(shopId)
                .productId(searchDto != null ? searchDto.productId() : null)
                .variantId(searchDto != null ? searchDto.variantId() : null)
                .keyword(searchDto != null ? searchDto.keyword() : null)
                .productCode(searchDto != null ? searchDto.productCode() : null)
                .productName(searchDto != null ? searchDto.productName() : null)
                .categoryId(searchDto != null ? searchDto.categoryId() : null)
                .lowStock(searchDto != null ? searchDto.lowStock() : null)
                .build();

        Specification<Stock> spec = StockSpecification.from(dtoWithShop)
                .and((root, query, cb) -> cb.equal(root.get("tenant").get("id"), tenantId));

        Page<Stock> stocks = stockRepository.findAll(spec, pageable);
        Page<StockResponse> responsePage = stocks.map(StockResponse::from);
        return PageResponse.from(responsePage);
    }

    private Stock findOrCreateStock(Tenant tenant, Shop shop, Product product, ProductVariant variant) {
        Optional<Stock> stockOpt = findStock(tenant.getId(), shop.getId(), product.getId(), 
                variant != null ? variant.getId() : null);

        if (stockOpt.isPresent()) {
            return stockOpt.get();
        }

        Stock stock = new Stock();
        stock.setTenant(tenant);
        stock.setShop(shop);
        stock.setProduct(product);
        stock.setVariant(variant);
        stock.setQuantity(BigDecimal.ZERO);
        stock.setReservedQuantity(BigDecimal.ZERO);
        stock.setMinStockLevel(BigDecimal.ZERO);
        return stockRepository.save(stock);
    }

    private Optional<Stock> findStock(UUID tenantId, UUID shopId, UUID productId, UUID variantId) {
        if (variantId != null) {
            return stockRepository.findStockForVariant(tenantId, shopId, productId, variantId);
        } else {
            return stockRepository.findStockForProduct(tenantId, shopId, productId);
        }
    }
}
