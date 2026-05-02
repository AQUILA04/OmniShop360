package com.omnishop360.backend.domain.repository;

import com.omnishop360.backend.domain.entity.SalePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface SalePaymentRepository extends JpaRepository<SalePayment, UUID> {

    List<SalePayment> findBySaleId(UUID saleId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM SalePayment p WHERE p.sale.cashRegisterSession.id = :sessionId AND p.method = 'CASH'")
    BigDecimal sumCashPaymentsBySession(@Param("sessionId") UUID sessionId);
}
