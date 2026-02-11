package com.omnishop360.backend.domain.repository.specification;

import com.omnishop360.backend.domain.entity.User;
import com.omnishop360.backend.web.dto.UserSearchDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.domain.Specification;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@DisplayName("UserSpecification Tests")
class UserSpecificationTest {

    @Test
    @DisplayName("Should create specification with email filter")
    void shouldCreateSpecificationWithEmailFilter() {
        UserSearchDto dto = UserSearchDto.builder().email("test@example.com").build();

        Specification<User> spec = UserSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with active filter")
    void shouldCreateSpecificationWithActiveFilter() {
        UserSearchDto dto = UserSearchDto.builder().active(true).build();

        Specification<User> spec = UserSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with tenantId filter")
    void shouldCreateSpecificationWithTenantIdFilter() {
        UUID tenantId = UUID.randomUUID();
        UserSearchDto dto = UserSearchDto.builder().tenantId(tenantId).build();

        Specification<User> spec = UserSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with shopId filter")
    void shouldCreateSpecificationWithShopIdFilter() {
        UUID shopId = UUID.randomUUID();
        UserSearchDto dto = UserSearchDto.builder().shopId(shopId).build();

        Specification<User> spec = UserSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with keyword filter")
    void shouldCreateSpecificationWithKeywordFilter() {
        UserSearchDto dto = UserSearchDto.builder().keyword("john").build();

        Specification<User> spec = UserSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with all filters")
    void shouldCreateSpecificationWithAllFilters() {
        UUID tenantId = UUID.randomUUID();
        UUID shopId = UUID.randomUUID();
        UserSearchDto dto = UserSearchDto.builder()
                .keyword("john")
                .email("test@example.com")
                .active(true)
                .tenantId(tenantId)
                .shopId(shopId)
                .build();

        Specification<User> spec = UserSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with empty filters")
    void shouldCreateSpecificationWithEmptyFilters() {
        UserSearchDto dto = UserSearchDto.builder().build();

        Specification<User> spec = UserSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with blank keyword")
    void shouldCreateSpecificationWithBlankKeyword() {
        UserSearchDto dto = UserSearchDto.builder().keyword("   ").build();

        Specification<User> spec = UserSpecification.from(dto);
        assertNotNull(spec);
    }

    @Test
    @DisplayName("Should create specification with blank email")
    void shouldCreateSpecificationWithBlankEmail() {
        UserSearchDto dto = UserSearchDto.builder().email("   ").build();

        Specification<User> spec = UserSpecification.from(dto);
        assertNotNull(spec);
    }
}
