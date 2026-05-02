package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.*;
import com.omnishop360.backend.domain.repository.*;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.StockMovementRequest;
import com.omnishop360.backend.web.dto.StockResponse;
import com.omnishop360.backend.web.dto.StockSearchDto;
import jakarta.persistence.EntityNotFoundException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Variant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("StockService Tests")
class StockServiceTest {

    @Mock
    private StockRepository stockRepository;

    @Mock
    private StockMovementRepository stockMovementRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private ShopRepository shopRepository;

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private StockService stockService;

    private UUID tenantId;
    private UUID shopId;
    private UUID productId;
    private Tenant tenant;
    private Shop shop;
    private Product product;
    private ProductVariant variant;
    private Stock stock;
    private StockMovementRequest request;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        shopId = UUID.randomUUID();
        productId = UUID.randomUUID();

        tenant = new Tenant();
        tenant.setId(tenantId);
        tenant.setCompanyName("Test Company");

        shop = new Shop();
        shop.setId(shopId);
        shop.setTenant(tenant);
        shop.setName("Test Shop");

        product = new Product();
        product.setId(productId);
        product.setTenant(tenant);
        product.setName("Test Product");
        product.setSku("TEST-SKU-001");
        product.setActive(true);
        product.setDeleted(false);

        variant = new ProductVariant();
        variant.setProduct(product);

        product.setVariants(List.of(variant));



        stock = new Stock();
        stock.setId(UUID.randomUUID());
        stock.setTenant(tenant);
        stock.setShop(shop);
        stock.setProduct(product);
        stock.setQuantity(new BigDecimal("10.0"));
        stock.setReservedQuantity(BigDecimal.ZERO);
        stock.setAvailableQuantity(new BigDecimal("10.0"));
        stock.setMinStockLevel(new BigDecimal("5.0"));

        request = StockMovementRequest.builder()
                .productId(productId)
                .quantity(new BigDecimal("5.0"))
                .unitCost(new BigDecimal("25.50"))
                .notes("Test reception")
                .build();
    }

    @Test
    @DisplayName("Should add stock successfully")
    void shouldAddStockSuccessfully() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        when(stockRepository.findStockForProduct(tenantId, shopId, productId)).thenReturn(Optional.of(stock));
        when(stockRepository.save(any(Stock.class))).thenReturn(stock);
        when(stockMovementRepository.save(any(StockMovement.class))).thenReturn(new StockMovement());

        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserKeycloakId).thenReturn(Optional.of("user-id"));

            StockResponse response = stockService.addStock(request);

            assertNotNull(response);
            verify(stockRepository).save(any(Stock.class));
            verify(stockMovementRepository).save(any(StockMovement.class));
        }
    }

    @Test
    @DisplayName("Should create stock if not exists")
    void shouldCreateStockIfNotExists() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        when(stockRepository.findStockForProduct(tenantId, shopId, productId)).thenReturn(Optional.empty());
        when(stockRepository.save(any(Stock.class))).thenReturn(stock);
        when(stockMovementRepository.save(any(StockMovement.class))).thenReturn(new StockMovement());

        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserKeycloakId).thenReturn(Optional.of("user-id"));

            StockResponse response = stockService.addStock(request);

            assertNotNull(response);
            verify(stockRepository, times(2)).save(any(Stock.class));
        }
    }

    @Test
    @DisplayName("Should throw exception when user not associated with shop")
    void shouldThrowExceptionWhenUserNotAssociatedWithShop() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> stockService.addStock(request));
    }

    @Test
    @DisplayName("Should throw exception when product not found")
    void shouldThrowExceptionWhenProductNotFound() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> stockService.addStock(request));
    }

    @Test
    @DisplayName("Should remove stock successfully")
    void shouldRemoveStockSuccessfully() {
        UUID variantId = variant.getId();
        BigDecimal quantity = new BigDecimal("3.0");

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        when(stockRepository.findStockForProduct(tenantId, shopId, productId)).thenReturn(Optional.of(stock));
        when(stockRepository.save(any(Stock.class))).thenReturn(stock);
        when(stockMovementRepository.save(any(StockMovement.class))).thenReturn(new StockMovement());

        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserKeycloakId).thenReturn(Optional.of("user-id"));

            stockService.removeStock(productId, variantId, shopId, quantity);

            verify(stockRepository).save(any(Stock.class));
            verify(stockMovementRepository).save(any(StockMovement.class));
        }
    }

    @Test
    @DisplayName("Should throw exception when insufficient stock")
    void shouldThrowExceptionWhenInsufficientStock() {
        BigDecimal quantity = new BigDecimal("20.0");

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        when(stockRepository.findStockForProduct(tenantId, shopId, productId)).thenReturn(Optional.of(stock));

        assertThrows(IllegalArgumentException.class, 
                () -> stockService.removeStock(productId, null, shopId, quantity));
    }

    @Test
    @DisplayName("Should get inventory successfully")
    @SuppressWarnings({"unchecked", "rawtypes"})
    void shouldGetInventorySuccessfully() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Stock> stockPage = new PageImpl<>(List.of(stock));
        StockSearchDto searchDto = StockSearchDto.builder().build();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(stockRepository.findAll((Specification) any(Specification.class), eq(pageable))).thenReturn(stockPage);

        var response = stockService.getInventory(searchDto, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }

    @Test
    @DisplayName("Should throw exception when shop not found")
    void shouldThrowExceptionWhenShopNotFound() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> stockService.addStock(request));
    }

    @Test
    @DisplayName("Should throw exception when shop belongs to different tenant")
    void shouldThrowExceptionWhenShopBelongsToDifferentTenant() {
        UUID differentTenantId = UUID.randomUUID();
        Tenant differentTenant = new Tenant();
        differentTenant.setId(differentTenantId);
        shop.setTenant(differentTenant);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));

        assertThrows(EntityNotFoundException.class, () -> stockService.addStock(request));
    }

    @Test
    @DisplayName("Should throw exception when product belongs to different tenant")
    void shouldThrowExceptionWhenProductBelongsToDifferentTenant() {
        UUID differentTenantId = UUID.randomUUID();
        Tenant differentTenant = new Tenant();
        differentTenant.setId(differentTenantId);
        product.setTenant(differentTenant);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));

        assertThrows(EntityNotFoundException.class, () -> stockService.addStock(request));
    }

    @Test
    @DisplayName("Should add stock with variant successfully")
    void shouldAddStockWithVariantSuccessfully() {
        UUID variantId = UUID.randomUUID();
        ProductVariant variant = new ProductVariant();
        variant.setId(variantId);
        variant.setTenant(tenant);
        variant.setProduct(product);
        variant.setName("Test Variant");
        variant.setSku("TEST-VAR-001");
        variant.setActive(true);
        variant.setDeleted(false);

        StockMovementRequest requestWithVariant = StockMovementRequest.builder()
                .productId(productId)
                .variantId(variantId)
                .quantity(new BigDecimal("5.0"))
                .unitCost(new BigDecimal("25.50"))
                .notes("Test reception")
                .build();

        Stock stockWithVariant = new Stock();
        stockWithVariant.setId(UUID.randomUUID());
        stockWithVariant.setTenant(tenant);
        stockWithVariant.setShop(shop);
        stockWithVariant.setProduct(product);
        stockWithVariant.setVariant(variant);
        stockWithVariant.setQuantity(new BigDecimal("10.0"));
        stockWithVariant.setReservedQuantity(BigDecimal.ZERO);
        stockWithVariant.setAvailableQuantity(new BigDecimal("10.0"));
        stockWithVariant.setMinStockLevel(new BigDecimal("5.0"));

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        when(productVariantRepository.findByIdAndDeletedFalse(variantId)).thenReturn(Optional.of(variant));
        when(stockRepository.findStockForVariant(tenantId, shopId, productId, variantId))
                .thenReturn(Optional.of(stockWithVariant));
        when(stockRepository.save(any(Stock.class))).thenReturn(stockWithVariant);
        when(stockMovementRepository.save(any(StockMovement.class))).thenReturn(new StockMovement());

        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserKeycloakId).thenReturn(Optional.of("user-id"));

            StockResponse response = stockService.addStock(requestWithVariant);

            assertNotNull(response);
            verify(stockRepository).save(any(Stock.class));
            verify(stockMovementRepository).save(any(StockMovement.class));
        }
    }

    @Test
    @DisplayName("Should throw exception when variant not found")
    void shouldThrowExceptionWhenVariantNotFound() {
        UUID variantId = UUID.randomUUID();
        StockMovementRequest requestWithVariant = StockMovementRequest.builder()
                .productId(productId)
                .variantId(variantId)
                .quantity(new BigDecimal("5.0"))
                .build();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        when(productVariantRepository.findByIdAndDeletedFalse(variantId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> stockService.addStock(requestWithVariant));
    }

    @Test
    @DisplayName("Should throw exception when variant belongs to different tenant")
    void shouldThrowExceptionWhenVariantBelongsToDifferentTenant() {
        UUID variantId = UUID.randomUUID();
        UUID differentTenantId = UUID.randomUUID();
        Tenant differentTenant = new Tenant();
        differentTenant.setId(differentTenantId);
        ProductVariant variant = new ProductVariant();
        variant.setId(variantId);
        variant.setTenant(differentTenant);
        variant.setProduct(product);

        StockMovementRequest requestWithVariant = StockMovementRequest.builder()
                .productId(productId)
                .variantId(variantId)
                .quantity(new BigDecimal("5.0"))
                .build();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        when(productVariantRepository.findByIdAndDeletedFalse(variantId)).thenReturn(Optional.of(variant));

        assertThrows(EntityNotFoundException.class, () -> stockService.addStock(requestWithVariant));
    }

    @Test
    @DisplayName("Should throw exception when stock not found for remove")
    void shouldThrowExceptionWhenStockNotFoundForRemove() {
        BigDecimal quantity = new BigDecimal("3.0");

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        when(stockRepository.findStockForProduct(tenantId, shopId, productId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, 
                () -> stockService.removeStock(productId, null, shopId, quantity));
    }

    @Test
    @DisplayName("Should throw exception when user not associated with shop for inventory")
    void shouldThrowExceptionWhenUserNotAssociatedWithShopForInventory() {
        Pageable pageable = PageRequest.of(0, 20);
        StockSearchDto searchDto = StockSearchDto.builder().build();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> stockService.getInventory(searchDto, pageable));
    }

    @Test
    @DisplayName("Should get inventory with search filters")
    @SuppressWarnings({"unchecked", "rawtypes"})
    void shouldGetInventoryWithSearchFilters() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Stock> stockPage = new PageImpl<>(List.of(stock));
        UUID variantId = UUID.randomUUID();
        StockSearchDto searchDto = StockSearchDto.builder()
                .productId(productId)
                .variantId(variantId)
                .keyword("test")
                .lowStock(true)
                .build();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(stockRepository.findAll((Specification) any(Specification.class), eq(pageable))).thenReturn(stockPage);

        var response = stockService.getInventory(searchDto, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }
}
