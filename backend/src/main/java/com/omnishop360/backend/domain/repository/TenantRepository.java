package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, UUID>, TenantRepositoryCustom {

    Optional<Tenant> findByIdAndDeletedFalse(UUID id);

    boolean existsByContactEmailAndDeletedFalse(String email);

    boolean existsByCode(String code);
}

