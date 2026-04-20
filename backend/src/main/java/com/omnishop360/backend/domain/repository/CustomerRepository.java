package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, UUID>, JpaSpecificationExecutor<Customer> {

    @Query("SELECT c FROM Customer c WHERE c.id = :id AND c.tenant.id = :tenantId AND c.deleted = false")
    Optional<Customer> findByIdAndTenantIdAndDeletedFalse(@Param("id") UUID id, @Param("tenantId") UUID tenantId);

    @Query("SELECT c FROM Customer c WHERE c.tenant.id = :tenantId AND c.deleted = false")
    java.util.List<Customer> findByTenantIdAndDeletedFalse(@Param("tenantId") UUID tenantId);

    @Query("SELECT c FROM Customer c WHERE c.tenant.id = :tenantId AND c.deleted = false AND LOWER(COALESCE(c.firstName, '')) = 'client' AND LOWER(COALESCE(c.lastName, '')) = 'divers'")
    Optional<Customer> findWalkInCustomer(@Param("tenantId") UUID tenantId);
}
