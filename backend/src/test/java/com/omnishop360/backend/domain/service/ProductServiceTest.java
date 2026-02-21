package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Category;
import com.omnishop360.backend.domain.entity.Product;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.repository.CategoryRepository;
import com.omnishop360.backend.domain.repository.ProductRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.web.dto.CreateProductRequest;
import com.omnishop360.backend.web.dto.ProductResponse;
import com.omnishop360.backend.web.dto.ProductVariantRequest;
import com.omnishop360.backend.web.dto.UpdateProductRequest;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService Tests")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private ProductService productService;

    private UUID tenantId;
    private Tenant tenant;
    private CreateProductRequest createProductRequest;
    private Product product;
    private Category category;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        tenant = new Tenant();
        tenant.setId(tenantId);
        tenant.setCompanyName("Test Company");

        category = new Category();
        category.setId(UUID.randomUUID());
        category.setTenant(tenant);
        category.setName("Test Category");

        createProductRequest = new CreateProductRequest();
        createProductRequest.setName("Test Product");
        createProductRequest.setSku("TEST-SKU-001");
        createProductRequest.setDescription("Test Description");
        createProductRequest.setCostPrice(new BigDecimal("10.00"));
        createProductRequest.setSellingPrice(new BigDecimal("20.00"));
        createProductRequest.setTaxRate(new BigDecimal("20.00"));
        createProductRequest.setUnit("UNIT");

        product = new Product();
        product.setId(UUID.randomUUID());
        product.setTenant(tenant);
        product.setName("Test Product");
        product.setSku("TEST-SKU-001");
        product.setDescription("Test Description");
        product.setCostPrice(new BigDecimal("10.00"));
        product.setSellingPrice(new BigDecimal("20.00"));
        product.setTaxRate(new BigDecimal("20.00"));
        product.setUnit("UNIT");
        product.setActive(true);
        product.setDeleted(false);
    }

    @Test
    @DisplayName("Should create product successfully")
    void shouldCreateProductSuccessfully() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(productRepository.existsByTenantIdAndSkuAndDeletedFalse(tenantId, createProductRequest.getSku())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductResponse response = productService.createProduct(createProductRequest);

        assertNotNull(response);
        assertEquals(product.getName(), response.getName());
        assertEquals(product.getSku(), response.getSku());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Should create product with category successfully")
    void shouldCreateProductWithCategorySuccessfully() {
        createProductRequest.setCategoryId(category.getId());
        product.setCategory(category);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(productRepository.existsByTenantIdAndSkuAndDeletedFalse(tenantId, createProductRequest.getSku())).thenReturn(false);
        when(categoryRepository.findByIdAndDeletedFalse(category.getId())).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductResponse response = productService.createProduct(createProductRequest);

        assertNotNull(response);
        assertEquals(category.getId(), response.getCategoryId());
        verify(categoryRepository).findByIdAndDeletedFalse(category.getId());
    }

    @Test
    @DisplayName("Should create product with variants successfully")
    void shouldCreateProductWithVariantsSuccessfully() {
        ProductVariantRequest variantRequest = new ProductVariantRequest();
        variantRequest.setSku("TEST-SKU-001-VAR1");
        variantRequest.setName("Variant 1");
        variantRequest.setCostPrice(new BigDecimal("11.00"));
        variantRequest.setSellingPrice(new BigDecimal("21.00"));
        createProductRequest.setVariants(List.of(variantRequest));

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(productRepository.existsByTenantIdAndSkuAndDeletedFalse(eq(tenantId), anyString())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductResponse response = productService.createProduct(createProductRequest);

        assertNotNull(response);
        verify(productRepository, atLeastOnce()).existsByTenantIdAndSkuAndDeletedFalse(eq(tenantId), anyString());
    }

    @Test
    @DisplayName("Should throw exception when SKU already exists")
    void shouldThrowExceptionWhenSkuAlreadyExists() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(productRepository.existsByTenantIdAndSkuAndDeletedFalse(tenantId, createProductRequest.getSku())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> productService.createProduct(createProductRequest));
    }

    @Test
    @DisplayName("Should throw exception when category not found")
    void shouldThrowExceptionWhenCategoryNotFound() {
        createProductRequest.setCategoryId(UUID.randomUUID());

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(productRepository.existsByTenantIdAndSkuAndDeletedFalse(tenantId, createProductRequest.getSku())).thenReturn(false);
        when(categoryRepository.findByIdAndDeletedFalse(any())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> productService.createProduct(createProductRequest));
    }

    @Test
    @DisplayName("Should get all products successfully")
    void shouldGetAllProductsSuccessfully() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Product> productPage = new PageImpl<>(List.of(product));

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(productRepository.findByTenantIdAndDeletedFalse(tenantId, pageable)).thenReturn(productPage);

        var response = productService.getAllProducts(pageable, null);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
    }

    @Test
    @DisplayName("Should get product by id successfully")
    void shouldGetProductByIdSuccessfully() {
        UUID productId = product.getId();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.of(product));

        ProductResponse response = productService.getProductById(productId);

        assertNotNull(response);
        assertEquals(product.getName(), response.getName());
    }

    @Test
    @DisplayName("Should throw exception when product not found")
    void shouldThrowExceptionWhenProductNotFound() {
        UUID productId = UUID.randomUUID();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> productService.getProductById(productId));
    }

    @Test
    @DisplayName("Should update product successfully")
    void shouldUpdateProductSuccessfully() {
        UpdateProductRequest request = new UpdateProductRequest(
                "Updated Product", "UPD-SKU", "Desc", null, null, "UNIT",
                new BigDecimal("11.00"), new BigDecimal("22.00"), new BigDecimal("20.00"), true);
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(productRepository.findByIdAndDeletedFalse(product.getId())).thenReturn(Optional.of(product));
        when(productRepository.existsByTenantIdAndSkuAndDeletedFalse(tenantId, "UPD-SKU")).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductResponse response = productService.updateProduct(product.getId(), request);

        assertNotNull(response);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Should throw when update product not found")
    void shouldThrowWhenUpdateProductNotFound() {
        UpdateProductRequest request = new UpdateProductRequest(
                "A", "B", null, null, null, "UNIT", BigDecimal.ZERO, new BigDecimal("1"), BigDecimal.ZERO, null);
        UUID productId = UUID.randomUUID();
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(productRepository.findByIdAndDeletedFalse(productId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> productService.updateProduct(productId, request));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("Should throw when update product SKU already exists")
    void shouldThrowWhenUpdateProductSkuAlreadyExists() {
        UpdateProductRequest request = new UpdateProductRequest(
                "Name", "OTHER-SKU", null, null, null, "UNIT", BigDecimal.ZERO, new BigDecimal("1"), BigDecimal.ZERO, null);
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(productRepository.findByIdAndDeletedFalse(product.getId())).thenReturn(Optional.of(product));
        when(productRepository.existsByTenantIdAndSkuAndDeletedFalse(tenantId, "OTHER-SKU")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> productService.updateProduct(product.getId(), request));
        verify(productRepository, never()).save(any(Product.class));
    }
}

