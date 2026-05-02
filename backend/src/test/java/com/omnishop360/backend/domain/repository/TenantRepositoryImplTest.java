package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.Tenant;
import com.omnishop360.backend.domain.entity.TenantStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@DisplayName("TenantRepositoryImpl Tests")
class TenantRepositoryImplTest {

    @Autowired
    private TenantRepository tenantRepository;

    private Tenant tenant1;
    private Tenant tenant2;
    private Tenant tenant3;

    @BeforeEach
    void setUp() {
        tenantRepository.deleteAll();

        tenant1 = new Tenant();
        tenant1.setCompanyName("ACME Corporation");
        tenant1.setContactEmail("contact@acme.com");
        tenant1.setCode("ACMECORP");
        tenant1.setStatus(TenantStatus.ACTIVE);
        tenant1.setActive(true);
        tenant1.setDeleted(false);
        tenantRepository.save(tenant1);

        tenant2 = new Tenant();
        tenant2.setCompanyName("Tech Solutions Inc");
        tenant2.setContactEmail("info@techsolutions.com");
        tenant2.setCode("TECHSOL");
        tenant2.setStatus(TenantStatus.ACTIVE);
        tenant2.setActive(true);
        tenant2.setDeleted(false);
        tenantRepository.save(tenant2);

        tenant3 = new Tenant();
        tenant3.setCompanyName("Global Enterprises");
        tenant3.setContactEmail("hello@global.com");
        tenant3.setCode("GLOBAL");
        tenant3.setStatus(TenantStatus.ACTIVE);
        tenant3.setActive(true);
        tenant3.setDeleted(false);
        tenantRepository.save(tenant3);

        tenantRepository.flush();
    }

    @Test
    @DisplayName("Should find all active tenants without search")
    void shouldFindAllActiveTenantsWithoutSearch() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch(null, pageable);

        assertNotNull(result);
        assertEquals(3, result.getTotalElements());
        assertEquals(3, result.getContent().size());
        assertEquals(0, result.getNumber());
        assertEquals(20, result.getSize());
    }

    @Test
    @DisplayName("Should find tenants with search term")
    void shouldFindTenantsWithSearchTerm() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch("ACME", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(1, result.getContent().size());
        assertEquals("ACME Corporation", result.getContent().get(0).getCompanyName());
    }

    @Test
    @DisplayName("Should find tenants with case-insensitive search")
    void shouldFindTenantsWithCaseInsensitiveSearch() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch("tech", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Tech Solutions Inc", result.getContent().get(0).getCompanyName());
    }

    @Test
    @DisplayName("Should find tenants with partial search match")
    void shouldFindTenantsWithPartialSearchMatch() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch("Solutions", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Tech Solutions Inc", result.getContent().get(0).getCompanyName());
    }

    @Test
    @DisplayName("Should return empty page when search term matches nothing")
    void shouldReturnEmptyPageWhenSearchTermMatchesNothing() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch("NonExistentCompany", pageable);

        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        assertTrue(result.getContent().isEmpty());
    }

    @Test
    @DisplayName("Should exclude deleted tenants")
    void shouldExcludeDeletedTenants() {
        Tenant deletedTenant = new Tenant();
        deletedTenant.setCompanyName("Deleted Corp");
        deletedTenant.setContactEmail("deleted@corp.com");
        deletedTenant.setCode("DELETED");
        deletedTenant.setStatus(TenantStatus.ACTIVE);
        deletedTenant.setActive(true);
        deletedTenant.setDeleted(true);
        tenantRepository.save(deletedTenant);
        tenantRepository.flush();

        Pageable pageable = PageRequest.of(0, 20);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch(null, pageable);

        assertEquals(3, result.getTotalElements());
        assertTrue(result.getContent().stream()
                .noneMatch(t -> "Deleted Corp".equals(t.getCompanyName())));
    }

    @Test
    @DisplayName("Should sort by createdAt DESC by default")
    void shouldSortByCreatedAtDescByDefault() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch(null, pageable);

        assertNotNull(result);
        List<Tenant> content = result.getContent();
        assertTrue(content.size() >= 2);
        assertTrue(content.get(0).getCreatedAt().isAfter(content.get(1).getCreatedAt()) ||
                content.get(0).getCreatedAt().isEqual(content.get(1).getCreatedAt()));
    }

    @Test
    @DisplayName("Should sort by createdAt ASC when specified")
    void shouldSortByCreatedAtAscWhenSpecified() {
        Sort sort = Sort.by(Sort.Direction.ASC, "createdAt");
        Pageable pageable = PageRequest.of(0, 20, sort);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch(null, pageable);

        assertNotNull(result);
        List<Tenant> content = result.getContent();
        assertTrue(content.size() >= 2);
        assertTrue(content.get(0).getCreatedAt().isBefore(content.get(1).getCreatedAt()) ||
                content.get(0).getCreatedAt().isEqual(content.get(1).getCreatedAt()));
    }

    @Test
    @DisplayName("Should sort by companyName ASC when specified")
    void shouldSortByCompanyNameAscWhenSpecified() {
        Sort sort = Sort.by(Sort.Direction.ASC, "companyName");
        Pageable pageable = PageRequest.of(0, 20, sort);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch(null, pageable);

        assertNotNull(result);
        List<Tenant> content = result.getContent();
        assertTrue(content.size() >= 2);
        assertTrue(content.get(0).getCompanyName().compareToIgnoreCase(content.get(1).getCompanyName()) <= 0);
    }

    @Test
    @DisplayName("Should sort by companyName DESC when specified")
    void shouldSortByCompanyNameDescWhenSpecified() {
        Sort sort = Sort.by(Sort.Direction.DESC, "companyName");
        Pageable pageable = PageRequest.of(0, 20, sort);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch(null, pageable);

        assertNotNull(result);
        List<Tenant> content = result.getContent();
        assertTrue(content.size() >= 2);
        assertTrue(content.get(0).getCompanyName().compareToIgnoreCase(content.get(1).getCompanyName()) >= 0);
    }

    @Test
    @DisplayName("Should handle pagination correctly")
    void shouldHandlePaginationCorrectly() {
        Pageable pageable = PageRequest.of(0, 2);
        Page<Tenant> firstPage = tenantRepository.findAllActiveWithSearch(null, pageable);

        assertNotNull(firstPage);
        assertEquals(3, firstPage.getTotalElements());
        assertEquals(2, firstPage.getContent().size());
        assertEquals(0, firstPage.getNumber());
        assertEquals(2, firstPage.getSize());
        assertTrue(firstPage.hasNext());

        Pageable secondPageable = PageRequest.of(1, 2);
        Page<Tenant> secondPage = tenantRepository.findAllActiveWithSearch(null, secondPageable);

        assertNotNull(secondPage);
        assertEquals(3, secondPage.getTotalElements());
        assertEquals(1, secondPage.getContent().size());
        assertEquals(1, secondPage.getNumber());
        assertEquals(2, secondPage.getSize());
        assertFalse(secondPage.hasNext());
    }

    @Test
    @DisplayName("Should handle empty search string")
    void shouldHandleEmptySearchString() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch("", pageable);

        assertNotNull(result);
        assertEquals(3, result.getTotalElements());
    }

    @Test
    @DisplayName("Should handle whitespace-only search string")
    void shouldHandleWhitespaceOnlySearchString() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch("   ", pageable);

        assertNotNull(result);
        assertEquals(3, result.getTotalElements());
    }

    @Test
    @DisplayName("Should sort by updatedAt when specified")
    void shouldSortByUpdatedAtWhenSpecified() {
        Sort sort = Sort.by(Sort.Direction.DESC, "updatedAt");
        Pageable pageable = PageRequest.of(0, 20, sort);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch(null, pageable);

        assertNotNull(result);
        assertTrue(result.getTotalElements() > 0);
        List<Tenant> content = result.getContent();
        if (content.size() >= 2) {
            assertTrue(content.get(0).getUpdatedAt().isAfter(content.get(1).getUpdatedAt()) ||
                    content.get(0).getUpdatedAt().isEqual(content.get(1).getUpdatedAt()));
        }
    }

    @Test
    @DisplayName("Should handle multiple sort orders")
    void shouldHandleMultipleSortOrders() {
        Sort sort = Sort.by(Sort.Direction.ASC, "companyName")
                .and(Sort.by(Sort.Direction.DESC, "createdAt"));
        Pageable pageable = PageRequest.of(0, 20, sort);
        Page<Tenant> result = tenantRepository.findAllActiveWithSearch(null, pageable);

        assertNotNull(result);
        assertEquals(3, result.getTotalElements());
    }
}

