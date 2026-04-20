package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.entity.CashRegisterSession;
import com.omnishop360.backend.domain.service.CashRegisterSessionService;
import com.omnishop360.backend.web.dto.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("CashRegisterSessionController Tests")
class CashRegisterSessionControllerTest {

    @Mock
    private CashRegisterSessionService cashRegisterSessionService;

    @InjectMocks
    private CashRegisterSessionController controller;

    @Test
    void shouldGenerateRemainderVoucher() {
        UUID sessionId = UUID.randomUUID();
        GenerateRemainderVoucherRequest request = new GenerateRemainderVoucherRequest(sessionId, new BigDecimal("1500"), null);
        VoucherCodeResponse responseBody = VoucherCodeResponse.builder()
                .id(UUID.randomUUID())
                .code("VCH-123456")
                .originalAmount(new BigDecimal("1500"))
                .remainingAmount(new BigDecimal("1500"))
                .status(com.omnishop360.backend.domain.entity.VoucherCode.Status.ACTIVE)
                .sourceSessionId(sessionId)
                .build();
        when(cashRegisterSessionService.generateRemainderVoucher(any())).thenReturn(responseBody);

        ResponseEntity<VoucherCodeResponse> response = controller.generateRemainderVoucher(request);

        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("VCH-123456", response.getBody().code());
        verify(cashRegisterSessionService).generateRemainderVoucher(any());
    }

    @Test
    void shouldCloseSessionWithoutVoucherCode() {
        CashRegisterSessionResponse closeResponse = CashRegisterSessionResponse.builder()
                .id(UUID.randomUUID())
                .shopId(UUID.randomUUID())
                .openedBy("u")
                .openedAt(LocalDateTime.now())
                .openingFloat(new BigDecimal("10000"))
                .status(CashRegisterSession.Status.CLOSED)
                .generatedVoucherCode(null)
                .build();
        when(cashRegisterSessionService.closeSession(any())).thenReturn(closeResponse);

        ResponseEntity<CashRegisterSessionResponse> response = controller.closeSession(
                new CloseCashRegisterSessionRequest(new BigDecimal("9500"), null)
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(CashRegisterSession.Status.CLOSED, response.getBody().status());
    }
}
