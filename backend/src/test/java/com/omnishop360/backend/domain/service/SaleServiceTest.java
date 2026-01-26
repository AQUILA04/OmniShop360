package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.*;
import com.omnishop360.backend.domain.repository.*;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.CheckoutRequest;
import com.omnishop360.backend.web.dto.SaleResponse;
import com.omnishop360.backend.web.dto.SaleSearchDto;
import jakarta.persistence.EntityNotFoundException;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("SaleService Tests")
class SaleServiceTest {

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private SaleItemRepository saleItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ShopRepository shopRepository;

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private StockService stockService;

    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private SaleService saleService;

    private UUID tenantId;
    private UUID shopId;
    private UUID productId;
    private Tenant tenant;
    private Shop shop;
    private Product product;
    private Sale sale;
    private CheckoutRequest checkoutRequest;

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
        product.setSellingPrice(new BigDecimal("50.00"));
        product.setCostPrice(new BigDecimal("25.00"));
        product.setTaxRate(new BigDecimal("20.00"));
        product.setActive(true);
        product.setDeleted(false);

        sale = new Sale();
        sale.setId(UUID.randomUUID());
        sale.setTenant(tenant);
        sale.setShop(shop);
        sale.setSaleNumber("SALE-20250124-123456");
        sale.setSubtotal(new BigDecimal("100.00"));
        sale.setTaxAmount(new BigDecimal("20.00"));
        sale.setTotalAmount(new BigDecimal("120.00"));
        sale.setPaymentMethod(Sale.PaymentMethod.CASH);
        sale.setPaymentStatus(Sale.PaymentStatus.PAID);
        sale.setStatus(Sale.SaleStatus.COMPLETED);
        sale.setItems(new ArrayList<>());

        CheckoutRequest.CheckoutItem item = CheckoutRequest.CheckoutItem.builder()
                .productId(productId)
                .quantity(new BigDecimal("2.0"))
                .build();

        checkoutRequest = CheckoutRequest.builder()
                .items(List.of(item))
                .paymentMethod(Sale.PaymentMethod.CASH)
                .discountAmount(BigDecimal.ZERO)
                .build();
    }

    @Test
    @DisplayName("Should checkout successfully")
    void shouldCheckoutSuccessfully() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        doNothing().when(stockService).removeStock(any(), any(), any(), any());
        
        when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> {
            Sale savedSale = invocation.getArgument(0);
            if (savedSale.getId() == null) {
                savedSale.setId(UUID.randomUUID());
            }
            return savedSale;
        });

        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserKeycloakId).thenReturn(Optional.of("user-id"));

            SaleResponse response = saleService.checkout(checkoutRequest);

            assertNotNull(response);
            assertNotNull(response.id());
            assertNotNull(response.saleNumber());
            assertEquals(shopId, response.shopId());
            assertEquals(shop.getName(), response.shopName());
            assertEquals(Sale.PaymentMethod.CASH, response.paymentMethod());
            assertEquals(Sale.PaymentStatus.PAID, response.paymentStatus());
            assertEquals(Sale.SaleStatus.COMPLETED, response.status());
            assertNotNull(response.items());
            assertEquals(1, response.items().size());
            verify(saleRepository).save(any(Sale.class));
            verify(stockService).removeStock(eq(productId), isNull(), eq(shopId), eq(new BigDecimal("2.0")));
        }
    }

    @Test
    @DisplayName("Should throw exception when user not associated with shop")
    void shouldThrowExceptionWhenUserNotAssociatedWithShop() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> saleService.checkout(checkoutRequest));
    }

    @Test
    @DisplayName("Should throw exception when product not found")
    void shouldThrowExceptionWhenProductNotFound() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> saleService.checkout(checkoutRequest));
    }

    @Test
    @DisplayName("Should throw exception when product is not active")
    void shouldThrowExceptionWhenProductIsNotActive() {
        product.setActive(false);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));

        assertThrows(IllegalArgumentException.class, () -> saleService.checkout(checkoutRequest));
    }

    @Test
    @DisplayName("Should get sales successfully")
    @SuppressWarnings("unchecked")
    void shouldGetSalesSuccessfully() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Sale> salePage = new PageImpl<>(List.of(sale));
        SaleSearchDto searchDto = SaleSearchDto.builder().build();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(saleRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(salePage);

        var response = saleService.getSales(searchDto, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }

    @Test
    @DisplayName("Should get sale by id successfully")
    void shouldGetSaleByIdSuccessfully() {
        UUID saleId = sale.getId();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(saleRepository.findById(saleId)).thenReturn(Optional.of(sale));

        SaleResponse response = saleService.getSaleById(saleId);

        assertNotNull(response);
        assertEquals(sale.getSaleNumber(), response.saleNumber());
    }

    @Test
    @DisplayName("Should throw exception when sale not found")
    void shouldThrowExceptionWhenSaleNotFound() {
        UUID saleId = UUID.randomUUID();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(saleRepository.findById(saleId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> saleService.getSaleById(saleId));
    }

    @Test
    @DisplayName("Should checkout with customer successfully")
    void shouldCheckoutWithCustomerSuccessfully() {
        UUID customerId = UUID.randomUUID();
        Customer customer = new Customer();
        customer.setId(customerId);
        customer.setTenant(tenant);
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setEmail("john.doe@test.com");
        customer.setActive(true);
        customer.setDeleted(false);

        CheckoutRequest requestWithCustomer = CheckoutRequest.builder()
                .items(checkoutRequest.items())
                .customerId(customerId)
                .paymentMethod(Sale.PaymentMethod.CASH)
                .discountAmount(BigDecimal.ZERO)
                .build();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        when(customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId))
                .thenReturn(Optional.of(customer));
        doNothing().when(stockService).removeStock(any(), any(), any(), any());
        
        when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> {
            Sale savedSale = invocation.getArgument(0);
            if (savedSale.getId() == null) {
                savedSale.setId(UUID.randomUUID());
            }
            return savedSale;
        });

        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserKeycloakId).thenReturn(Optional.of("user-id"));

            SaleResponse response = saleService.checkout(requestWithCustomer);

            assertNotNull(response);
            assertEquals(customerId, response.customerId());
            verify(saleRepository).save(any(Sale.class));
        }
    }

    @Test
    @DisplayName("Should checkout with variant successfully")
    void shouldCheckoutWithVariantSuccessfully() {
        UUID variantId = UUID.randomUUID();
        ProductVariant variant = new ProductVariant();
        variant.setId(variantId);
        variant.setTenant(tenant);
        variant.setProduct(product);
        variant.setName("Test Variant");
        variant.setSku("TEST-VAR-001");
        variant.setSellingPrice(new BigDecimal("60.00"));
        variant.setActive(true);
        variant.setDeleted(false);

        CheckoutRequest.CheckoutItem itemWithVariant = CheckoutRequest.CheckoutItem.builder()
                .productId(productId)
                .variantId(variantId)
                .quantity(new BigDecimal("2.0"))
                .build();

        CheckoutRequest requestWithVariant = CheckoutRequest.builder()
                .items(List.of(itemWithVariant))
                .paymentMethod(Sale.PaymentMethod.CASH)
                .discountAmount(BigDecimal.ZERO)
                .build();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        when(productVariantRepository.findByIdAndDeletedFalse(variantId)).thenReturn(Optional.of(variant));
        doNothing().when(stockService).removeStock(any(), any(), any(), any());
        
        when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> {
            Sale savedSale = invocation.getArgument(0);
            if (savedSale.getId() == null) {
                savedSale.setId(UUID.randomUUID());
            }
            return savedSale;
        });

        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserKeycloakId).thenReturn(Optional.of("user-id"));

            SaleResponse response = saleService.checkout(requestWithVariant);

            assertNotNull(response);
            verify(stockService).removeStock(eq(productId), eq(variantId), eq(shopId), eq(new BigDecimal("2.0")));
        }
    }

    @Test
    @DisplayName("Should throw exception when variant not found")
    void shouldThrowExceptionWhenVariantNotFound() {
        UUID variantId = UUID.randomUUID();
        CheckoutRequest.CheckoutItem itemWithVariant = CheckoutRequest.CheckoutItem.builder()
                .productId(productId)
                .variantId(variantId)
                .quantity(new BigDecimal("2.0"))
                .build();

        CheckoutRequest requestWithVariant = CheckoutRequest.builder()
                .items(List.of(itemWithVariant))
                .paymentMethod(Sale.PaymentMethod.CASH)
                .build();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        when(productVariantRepository.findByIdAndDeletedFalse(variantId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> saleService.checkout(requestWithVariant));
    }

    @Test
    @DisplayName("Should throw exception when variant is not active")
    void shouldThrowExceptionWhenVariantIsNotActive() {
        UUID variantId = UUID.randomUUID();
        ProductVariant variant = new ProductVariant();
        variant.setId(variantId);
        variant.setTenant(tenant);
        variant.setProduct(product);
        variant.setActive(false);

        CheckoutRequest.CheckoutItem itemWithVariant = CheckoutRequest.CheckoutItem.builder()
                .productId(productId)
                .variantId(variantId)
                .quantity(new BigDecimal("2.0"))
                .build();

        CheckoutRequest requestWithVariant = CheckoutRequest.builder()
                .items(List.of(itemWithVariant))
                .paymentMethod(Sale.PaymentMethod.CASH)
                .build();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));
        when(productVariantRepository.findByIdAndDeletedFalse(variantId)).thenReturn(Optional.of(variant));

        assertThrows(IllegalArgumentException.class, () -> saleService.checkout(requestWithVariant));
    }

    @Test
    @DisplayName("Should get sales with search filters")
    @SuppressWarnings("unchecked")
    void shouldGetSalesWithSearchFilters() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Sale> salePage = new PageImpl<>(List.of(sale));
        UUID customerId = UUID.randomUUID();
        SaleSearchDto searchDto = SaleSearchDto.builder()
                .customerId(customerId)
                .keyword("test")
                .paymentMethod(Sale.PaymentMethod.CASH)
                .paymentStatus(Sale.PaymentStatus.PAID)
                .status(Sale.SaleStatus.COMPLETED)
                .fromDate(java.time.LocalDate.now().minusDays(7))
                .toDate(java.time.LocalDate.now())
                .build();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(saleRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(salePage);

        var response = saleService.getSales(searchDto, pageable);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }

    @Test
    @DisplayName("Should throw exception when user not associated with shop for getSales")
    void shouldThrowExceptionWhenUserNotAssociatedWithShopForGetSales() {
        Pageable pageable = PageRequest.of(0, 20);
        SaleSearchDto searchDto = SaleSearchDto.builder().build();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> saleService.getSales(searchDto, pageable));
    }
}
