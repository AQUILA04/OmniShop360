package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Category;
import com.omnishop360.backend.domain.entity.Product;
import com.omnishop360.backend.domain.entity.ProductVariant;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.repository.CategoryRepository;
import com.omnishop360.backend.domain.repository.ProductRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.web.dto.CreateProductRequest;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.ProductResponse;
import com.omnishop360.backend.web.dto.ProductVariantRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final TenantRepository tenantRepository;
    private final CategoryRepository categoryRepository;
    private final UserContextService userContextService;

    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.info("Creating product: {} for tenant: {}", request.getName(), tenantId);

        Tenant tenant = tenantRepository.findByIdAndDeletedFalse(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));

        if (productRepository.existsByTenantIdAndSkuAndDeletedFalse(tenantId, request.getSku())) {
            throw new IllegalArgumentException("Product with SKU already exists: " + request.getSku());
        }

        Product product = new Product();
        product.setTenant(tenant);
        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setDescription(request.getDescription());
        product.setBarcode(request.getBarcode());
        product.setUnit(request.getUnit() != null ? request.getUnit() : "UNIT");
        product.setCostPrice(request.getCostPrice() != null ? request.getCostPrice() : java.math.BigDecimal.ZERO);
        product.setSellingPrice(request.getSellingPrice());
        product.setTaxRate(request.getTaxRate() != null ? request.getTaxRate() : java.math.BigDecimal.ZERO);
        product.setActive(true);
        product.setDeleted(false);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndDeletedFalse(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + request.getCategoryId()));
            if (!category.getTenant().getId().equals(tenantId)) {
                throw new EntityNotFoundException("Category not found with id: " + request.getCategoryId());
            }
            product.setCategory(category);
        }

        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductVariantRequest variantRequest : request.getVariants()) {
                if (productRepository.existsByTenantIdAndSkuAndDeletedFalse(tenantId, variantRequest.getSku())) {
                    throw new IllegalArgumentException("Product variant with SKU already exists: " + variantRequest.getSku());
                }

                ProductVariant variant = new ProductVariant();
                variant.setTenant(tenant);
                variant.setProduct(product);
                variant.setSku(variantRequest.getSku());
                variant.setName(variantRequest.getName());
                variant.setBarcode(variantRequest.getBarcode());
                variant.setCostPrice(variantRequest.getCostPrice());
                variant.setSellingPrice(variantRequest.getSellingPrice());
                variant.setActive(true);
                variant.setDeleted(false);
                product.getVariants().add(variant);
            }
        }

        product = productRepository.save(product);
        log.info("Product created successfully: {}", product.getId());
        return ProductResponse.from(product);
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> getAllProducts(Pageable pageable, String search) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.debug("Fetching products for tenant: {} with search: {}", tenantId, search);

        Page<Product> products;
        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.findByTenantIdAndDeletedFalseWithSearch(tenantId, search.trim(), pageable);
        } else {
            products = productRepository.findByTenantIdAndDeletedFalse(tenantId, pageable);
        }

        Page<ProductResponse> responsePage = products.map(ProductResponse::from);
        return PageResponse.from(responsePage);
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(UUID productId) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.debug("Fetching product: {} for tenant: {}", productId, tenantId);

        Product product = productRepository.findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));

        if (!product.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException("Product not found with id: " + productId);
        }

        return ProductResponse.from(product);
    }
}

