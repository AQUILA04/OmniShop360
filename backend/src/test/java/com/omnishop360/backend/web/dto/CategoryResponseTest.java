package com.omnishop360.backend.web.dto;

import com.omnishop360.backend.domain.entity.Category;
import com.omnishop360.backend.domain.entity.Tenant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("CategoryResponse Tests")
class CategoryResponseTest {

    private Category category;
    private Category parentCategory;
    private Tenant tenant;

    @BeforeEach
    void setUp() {
        tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        tenant.setCompanyName("Test Company");

        parentCategory = new Category();
        parentCategory.setId(UUID.randomUUID());
        parentCategory.setTenant(tenant);
        parentCategory.setName("Parent Category");

        category = new Category();
        category.setId(UUID.randomUUID());
        category.setTenant(tenant);
        category.setParent(parentCategory);
        category.setName("Test Category");
        category.setCode("TEST-CAT");
        category.setDescription("Test Description");
        category.setActive(true);
    }

    @Test
    @DisplayName("Should create CategoryResponse from Category entity")
    void shouldCreateCategoryResponseFromCategory() {
        CategoryResponse response = CategoryResponse.from(category);

        assertNotNull(response);
        assertEquals(category.getId(), response.getId());
        assertEquals(category.getName(), response.getName());
        assertEquals(category.getCode(), response.getCode());
        assertEquals(category.getDescription(), response.getDescription());
        assertEquals(parentCategory.getId(), response.getParentId());
        assertEquals(parentCategory.getName(), response.getParentName());
        assertEquals(category.getActive(), response.getActive());
    }

    @Test
    @DisplayName("Should create CategoryResponse without parent")
    void shouldCreateCategoryResponseWithoutParent() {
        category.setParent(null);
        CategoryResponse response = CategoryResponse.from(category);

        assertNotNull(response);
        assertNull(response.getParentId());
        assertNull(response.getParentName());
    }

    @Test
    @DisplayName("Should return null when Category is null")
    void shouldReturnNullWhenCategoryIsNull() {
        CategoryResponse response = CategoryResponse.from(null);
        assertNull(response);
    }
}

