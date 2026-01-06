package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.Category;
import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.repository.CategoryRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.web.dto.CategoryResponse;
import com.omnishop360.backend.web.dto.CreateCategoryRequest;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CategoryService Tests")
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TenantRepository tenantRepository;

    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private CategoryService categoryService;

    private UUID tenantId;
    private Tenant tenant;
    private CreateCategoryRequest createCategoryRequest;
    private Category category;
    private Category parentCategory;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        tenant = new Tenant();
        tenant.setId(tenantId);
        tenant.setCompanyName("Test Company");

        createCategoryRequest = new CreateCategoryRequest();
        createCategoryRequest.setName("Test Category");
        createCategoryRequest.setCode("TEST-CAT");
        createCategoryRequest.setDescription("Test Description");

        category = new Category();
        category.setId(UUID.randomUUID());
        category.setTenant(tenant);
        category.setName("Test Category");
        category.setCode("TEST-CAT");
        category.setDescription("Test Description");
        category.setActive(true);
        category.setDeleted(false);

        parentCategory = new Category();
        parentCategory.setId(UUID.randomUUID());
        parentCategory.setTenant(tenant);
        parentCategory.setName("Parent Category");
        parentCategory.setCode("PARENT-CAT");
    }

    @Test
    @DisplayName("Should create category successfully")
    void shouldCreateCategorySuccessfully() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(categoryRepository.existsByTenantIdAndCodeAndDeletedFalse(tenantId, createCategoryRequest.getCode())).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        CategoryResponse response = categoryService.createCategory(createCategoryRequest);

        assertNotNull(response);
        assertEquals(category.getName(), response.getName());
        assertEquals(category.getCode(), response.getCode());
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    @DisplayName("Should create category with parent successfully")
    void shouldCreateCategoryWithParentSuccessfully() {
        createCategoryRequest.setParentId(parentCategory.getId());
        category.setParent(parentCategory);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(categoryRepository.existsByTenantIdAndCodeAndDeletedFalse(tenantId, createCategoryRequest.getCode())).thenReturn(false);
        when(categoryRepository.findByIdAndDeletedFalse(parentCategory.getId())).thenReturn(Optional.of(parentCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        CategoryResponse response = categoryService.createCategory(createCategoryRequest);

        assertNotNull(response);
        assertEquals(parentCategory.getId(), response.getParentId());
        verify(categoryRepository).findByIdAndDeletedFalse(parentCategory.getId());
    }

    @Test
    @DisplayName("Should throw exception when code already exists")
    void shouldThrowExceptionWhenCodeAlreadyExists() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(categoryRepository.existsByTenantIdAndCodeAndDeletedFalse(tenantId, createCategoryRequest.getCode())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> categoryService.createCategory(createCategoryRequest));
    }

    @Test
    @DisplayName("Should throw exception when parent category not found")
    void shouldThrowExceptionWhenParentCategoryNotFound() {
        createCategoryRequest.setParentId(UUID.randomUUID());

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(categoryRepository.existsByTenantIdAndCodeAndDeletedFalse(tenantId, createCategoryRequest.getCode())).thenReturn(false);
        when(categoryRepository.findByIdAndDeletedFalse(any())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> categoryService.createCategory(createCategoryRequest));
    }

    @Test
    @DisplayName("Should get all categories successfully")
    void shouldGetAllCategoriesSuccessfully() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(categoryRepository.findByTenantIdAndDeletedFalseOrderByName(tenantId)).thenReturn(List.of(category));

        List<CategoryResponse> response = categoryService.getAllCategories();

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals(category.getName(), response.get(0).getName());
    }

    @Test
    @DisplayName("Should get category by id successfully")
    void shouldGetCategoryByIdSuccessfully() {
        UUID categoryId = category.getId();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(categoryRepository.findByIdAndDeletedFalse(categoryId)).thenReturn(Optional.of(category));

        CategoryResponse response = categoryService.getCategoryById(categoryId);

        assertNotNull(response);
        assertEquals(category.getName(), response.getName());
    }

    @Test
    @DisplayName("Should throw exception when category not found")
    void shouldThrowExceptionWhenCategoryNotFound() {
        UUID categoryId = UUID.randomUUID();

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(categoryRepository.findByIdAndDeletedFalse(categoryId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> categoryService.getCategoryById(categoryId));
    }

    @Test
    @DisplayName("Should throw exception when category belongs to different tenant")
    void shouldThrowExceptionWhenCategoryBelongsToDifferentTenant() {
        UUID categoryId = category.getId();
        UUID differentTenantId = UUID.randomUUID();
        Tenant differentTenant = new Tenant();
        differentTenant.setId(differentTenantId);
        category.setTenant(differentTenant);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(categoryRepository.findByIdAndDeletedFalse(categoryId)).thenReturn(Optional.of(category));

        assertThrows(EntityNotFoundException.class, () -> categoryService.getCategoryById(categoryId));
    }
}

