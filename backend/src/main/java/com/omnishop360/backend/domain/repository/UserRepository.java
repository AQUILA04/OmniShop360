package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailAndDeletedFalse(String email);

    Optional<User> findByKeycloakIdAndDeletedFalse(String keycloakId);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email AND u.tenant.id = :tenantId AND u.deleted = false")
    boolean existsByEmailAndTenantIdAndDeletedFalse(@Param("email") String email, @Param("tenantId") UUID tenantId);

    boolean existsByEmailAndDeletedFalse(String email);

    @Query("SELECT COUNT(u) FROM User u WHERE u.tenant.id = :tenantId AND u.deleted = false")
    long countByTenantId(@Param("tenantId") UUID tenantId);
}

