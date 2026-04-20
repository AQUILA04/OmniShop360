package com.omnishop360.backend.domain.service;

import com.omnishop360.backend.domain.entity.*;
import com.omnishop360.backend.domain.repository.CashRegisterSessionRepository;
import com.omnishop360.backend.domain.repository.CustomerRepository;
import com.omnishop360.backend.domain.repository.SalePaymentRepository;
import com.omnishop360.backend.domain.repository.ShopRepository;
import com.omnishop360.backend.domain.repository.TenantRepository;
import com.omnishop360.backend.infrastructure.config.SecurityUtils;
import com.omnishop360.backend.web.dto.CloseCashRegisterSessionRequest;
import com.omnishop360.backend.web.dto.GenerateRemainderVoucherRequest;
import com.omnishop360.backend.web.dto.OpenCashRegisterSessionRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CashRegisterSessionService Tests")
class CashRegisterSessionServiceTest {

    @Mock
    private CashRegisterSessionRepository cashRegisterSessionRepository;
    @Mock
    private TenantRepository tenantRepository;
    @Mock
    private ShopRepository shopRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private SalePaymentRepository salePaymentRepository;
    @Mock
    private VoucherCodeService voucherCodeService;
    @Mock
    private UserContextService userContextService;

    @InjectMocks
    private CashRegisterSessionService service;

    private UUID tenantId;
    private UUID shopId;
    private Tenant tenant;
    private Shop shop;

    @BeforeEach
    void setUp() {
        tenantId = UUID.randomUUID();
        shopId = UUID.randomUUID();
        tenant = new Tenant();
        tenant.setId(tenantId);
        shop = new Shop();
        shop.setId(shopId);
        shop.setTenant(tenant);
        shop.setName("Shop");
    }

    @Test
    void shouldOpenSession() {
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(cashRegisterSessionRepository.findOpenSession(tenantId, shopId)).thenReturn(Optional.empty());
        when(tenantRepository.findByIdAndDeletedFalse(tenantId)).thenReturn(Optional.of(tenant));
        when(shopRepository.findByIdAndDeletedFalse(shopId)).thenReturn(Optional.of(shop));
        when(cashRegisterSessionRepository.save(any(CashRegisterSession.class))).thenAnswer(i -> i.getArgument(0));

        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserKeycloakId).thenReturn(Optional.of("user-id"));
            var response = service.openSession(new OpenCashRegisterSessionRequest(new BigDecimal("10000")));
            assertNotNull(response);
            assertEquals(new BigDecimal("10000"), response.openingFloat());
            assertEquals(CashRegisterSession.Status.OPEN, response.status());
        }
    }

    @Test
    void shouldCloseSessionWithoutGeneratingVoucher() {
        UUID customerId = UUID.randomUUID();
        CashRegisterSession openSession = new CashRegisterSession();
        openSession.setId(UUID.randomUUID());
        openSession.setTenant(tenant);
        openSession.setShop(shop);
        openSession.setOpeningFloat(new BigDecimal("1000"));
        openSession.setStatus(CashRegisterSession.Status.OPEN);
        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(cashRegisterSessionRepository.findOpenSession(tenantId, shopId)).thenReturn(Optional.of(openSession));
        when(salePaymentRepository.sumCashPaymentsBySession(openSession.getId())).thenReturn(new BigDecimal("500"));
        when(cashRegisterSessionRepository.save(any(CashRegisterSession.class))).thenAnswer(i -> i.getArgument(0));

        try (MockedStatic<SecurityUtils> mockedSecurity = mockStatic(SecurityUtils.class)) {
            mockedSecurity.when(SecurityUtils::getCurrentUserKeycloakId).thenReturn(Optional.of("user-id"));
            var response = service.closeSession(new CloseCashRegisterSessionRequest(new BigDecimal("1700"), customerId));
            assertNotNull(response);
            assertEquals(CashRegisterSession.Status.CLOSED, response.status());
            assertNull(response.generatedVoucherCode());
            verify(voucherCodeService, never()).issueVoucher(any(), any(), any(), any(), any());
        }
    }

    @Test
    void shouldGenerateRemainderVoucherManually() {
        UUID customerId = UUID.randomUUID();
        UUID sessionId = UUID.randomUUID();
        CashRegisterSession session = new CashRegisterSession();
        session.setId(sessionId);
        session.setTenant(tenant);
        session.setShop(shop);
        Customer customer = new Customer();
        customer.setId(customerId);
        customer.setTenant(tenant);
        VoucherCode voucherCode = new VoucherCode();
        voucherCode.setId(UUID.randomUUID());
        voucherCode.setCode("VCH-1234");
        voucherCode.setOriginalAmount(new BigDecimal("500"));
        voucherCode.setRemainingAmount(new BigDecimal("500"));
        voucherCode.setStatus(VoucherCode.Status.ACTIVE);
        voucherCode.setSourceSession(session);
        voucherCode.setCustomer(customer);

        when(userContextService.getCurrentUserTenantId()).thenReturn(tenantId);
        when(userContextService.getCurrentUserShopId()).thenReturn(Optional.of(shopId));
        when(cashRegisterSessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(customerRepository.findByIdAndTenantIdAndDeletedFalse(customerId, tenantId)).thenReturn(Optional.of(customer));
        when(voucherCodeService.issueVoucher(tenant, shop, customer, session, new BigDecimal("500"))).thenReturn(voucherCode);

        var response = service.generateRemainderVoucher(new GenerateRemainderVoucherRequest(sessionId, new BigDecimal("500"), customerId));

        assertNotNull(response);
        assertEquals("VCH-1234", response.code());
    }
}
