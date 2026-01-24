package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {

    @Query("SELECT pv FROM ProductVariant pv WHERE pv.id = :id AND pv.deleted = false")
    Optional<ProductVariant> findByIdAndDeletedFalse(@Param("id") UUID id);
}
