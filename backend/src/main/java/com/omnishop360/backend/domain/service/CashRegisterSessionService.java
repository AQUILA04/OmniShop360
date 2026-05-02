package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.*;
import com.omnishop360.backend.domain.repository.CashRegisterSessionRepository;
import com.omnishop360.backend.domain.repository.CustomerRepository;
import com.omnishop360.backend.domain.repository.SalePaymentRepository;
import com.omnishop360.backend.domain.repository.ShopRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.domain.repository.specification.CashRegisterSessionSpecification;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CashRegisterSessionService {

    private final CashRegisterSessionRepository cashRegisterSessionRepository;
    private final TenantRepository tenantRepository;
    private final ShopRepository shopRepository;
    private final CustomerRepository customerRepository;
    private final SalePaymentRepository salePaymentRepository;
    private final VoucherCodeService voucherCodeService;
    private final UserContextService userContextService;

    @Transactional
    public CashRegisterSessionResponse openSession(OpenCashRegisterSessionRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = userContextService.getCurrentUserShopId()
                .orElseThrow(() -> new IllegalArgumentException("User must be associated with a shop to open cash register"));
        cashRegisterSessionRepository.findOpenSession(tenantId, shopId).ifPresent(session -> {
            throw new IllegalArgumentException("An open cash register session already exists");
        });
        Tenant tenant = tenantRepository.findByIdAndDeletedFalse(tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Tenant not found with id: " + tenantId));
        Shop shop = shopRepository.findByIdAndDeletedFalse(shopId)
                .orElseThrow(() -> new EntityNotFoundException("Shop not found with id: " + shopId));
        CashRegisterSession session = new CashRegisterSession();
        session.setTenant(tenant);
        session.setShop(shop);
        session.setOpeningFloat(request.openingFloat());
        session.setOpenedBy(SecurityUtils.getCurrentUserKeycloakId().orElse("system"));
        session.setOpenedAt(LocalDateTime.now());
        session.setStatus(CashRegisterSession.Status.OPEN);
        session = cashRegisterSessionRepository.save(session);
        return CashRegisterSessionResponse.from(session, null);
    }

    @Transactional
    public CashRegisterSessionResponse closeSession(CloseCashRegisterSessionRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = userContextService.getCurrentUserShopId()
                .orElseThrow(() -> new IllegalArgumentException("User must be associated with a shop to close cash register"));
        CashRegisterSession session = cashRegisterSessionRepository.findOpenSession(tenantId, shopId)
                .orElseThrow(() -> new EntityNotFoundException("No open cash register session found"));

        BigDecimal expectedCashAmount = session.getOpeningFloat().add(
                salePaymentRepository.sumCashPaymentsBySession(session.getId())
        );
        BigDecimal remainderAmount = request.countedCashAmount().subtract(expectedCashAmount);
        session.setExpectedCashAmount(expectedCashAmount);
        session.setCountedCashAmount(request.countedCashAmount());
        session.setRemainderAmount(remainderAmount);
        session.setClosedAt(LocalDateTime.now());
        session.setClosedBy(SecurityUtils.getCurrentUserKeycloakId().orElse("system"));
        session.setStatus(CashRegisterSession.Status.CLOSED);
        session = cashRegisterSessionRepository.save(session);
        return CashRegisterSessionResponse.from(session, null);
    }

    @Transactional(readOnly = true)
    public CashRegisterSession getOpenSessionOrThrow(UUID tenantId, UUID shopId) {
        return cashRegisterSessionRepository.findOpenSession(tenantId, shopId)
                .orElseThrow(() -> new IllegalArgumentException("Cash register must be opened before checkout"));
    }

    @Transactional(readOnly = true)
    public PageResponse<CashRegisterSessionResponse> getSessions(CashRegisterSessionSearchDto searchDto, Pageable pageable) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = userContextService.getCurrentUserShopId()
                .orElseThrow(() -> new IllegalArgumentException("User must be associated with a shop to view cash register sessions"));
        Specification<CashRegisterSession> spec = CashRegisterSessionSpecification.from(searchDto)
                .and((root, query, cb) -> cb.equal(root.get("tenant").get("id"), tenantId))
                .and((root, query, cb) -> cb.equal(root.get("shop").get("id"), shopId));
        Page<CashRegisterSessionResponse> responsePage = cashRegisterSessionRepository.findAll(spec, pageable)
                .map(session -> CashRegisterSessionResponse.from(session, null));
        return PageResponse.from(responsePage);
    }

    @Transactional
    public VoucherCodeResponse generateRemainderVoucher(GenerateRemainderVoucherRequest request) {
        UUID tenantId = userContextService.getCurrentUserTenantId();
        UUID shopId = userContextService.getCurrentUserShopId()
                .orElseThrow(() -> new IllegalArgumentException("User must be associated with a shop to generate remainder voucher"));
        CashRegisterSession session = cashRegisterSessionRepository.findById(request.cashRegisterSessionId())
                .orElseThrow(() -> new EntityNotFoundException("Cash register session not found with id: " + request.cashRegisterSessionId()));
        if (!session.getTenant().getId().equals(tenantId) || !session.getShop().getId().equals(shopId)) {
            throw new EntityNotFoundException("Cash register session not found with id: " + request.cashRegisterSessionId());
        }
        Customer customer = null;
        if (request.customerId() != null) {
            customer = customerRepository.findByIdAndTenantIdAndDeletedFalse(request.customerId(), tenantId)
                    .orElseThrow(() -> new EntityNotFoundException("Customer not found with id: " + request.customerId()));
        }
        VoucherCode voucherCode = voucherCodeService.issueVoucher(session.getTenant(), session.getShop(), customer, session, request.amount());
        return VoucherCodeResponse.from(voucherCode);
    }
}
