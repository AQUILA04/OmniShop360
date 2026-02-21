package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Category;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.repository.CategoryRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.web.dto.CategoryResponse;
import com.omnishop360.backend.web.dto.CreateCategoryRequest;
import com.omnishop360.backend.web.dto.UpdateCategoryRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TenantRepository tenantRepository;
    private final UserContextService userContextService;

    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.info("Creating category: {} for tenant: {}", request.getName(), tenantId);

        Tenant tenant = tenantRepository.findByIdAndDeletedFalse(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));

        if (categoryRepository.existsByTenantIdAndCodeAndDeletedFalse(tenantId, request.getCode())) {
            throw new IllegalArgumentException("Category with code already exists: " + request.getCode());
        }

        Category category = new Category();
        category.setTenant(tenant);
        category.setName(request.getName());
        category.setCode(request.getCode());
        category.setDescription(request.getDescription());
        category.setActive(true);
        category.setDeleted(false);

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findByIdAndDeletedFalse(request.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent category not found with id: " + request.getParentId()));
            if (!parent.getTenant().getId().equals(tenantId)) {
                throw new EntityNotFoundException("Parent category not found with id: " + request.getParentId());
            }
            category.setParent(parent);
        }

        category = categoryRepository.save(category);
        log.info("Category created successfully: {}", category.getId());
        return CategoryResponse.from(category);
    }

    @Transactional
    public CategoryResponse updateCategory(UUID categoryId, UpdateCategoryRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.info("Updating category: {} for tenant: {}", categoryId, tenantId);

        Category category = categoryRepository.findByIdAndDeletedFalse(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));

        if (!category.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException("Category not found with id: " + categoryId);
        }

        if (!category.getCode().equals(request.getCode())
                && categoryRepository.existsByTenantIdAndCodeAndDeletedFalse(tenantId, request.getCode())) {
            throw new IllegalArgumentException("Category with code already exists: " + request.getCode());
        }

        category.setName(request.getName());
        category.setCode(request.getCode());
        category.setDescription(request.getDescription());

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findByIdAndDeletedFalse(request.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent category not found with id: " + request.getParentId()));
            if (!parent.getTenant().getId().equals(tenantId)) {
                throw new EntityNotFoundException("Parent category not found with id: " + request.getParentId());
            }
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        category = categoryRepository.save(category);
        log.info("Category updated successfully: {}", category.getId());
        return CategoryResponse.from(category);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.debug("Fetching all categories for tenant: {}", tenantId);

        List<Category> categories = categoryRepository.findByTenantIdAndDeletedFalseOrderByName(tenantId);
        return categories.stream()
                .map(CategoryResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(UUID categoryId) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        log.debug("Fetching category: {} for tenant: {}", categoryId, tenantId);

        Category category = categoryRepository.findByIdAndDeletedFalse(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));

        if (!category.getTenant().getId().equals(tenantId)) {
            throw new EntityNotFoundException("Category not found with id: " + categoryId);
        }

        return CategoryResponse.from(category);
    }
}

