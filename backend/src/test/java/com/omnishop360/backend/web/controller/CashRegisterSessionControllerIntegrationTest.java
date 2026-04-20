package com.omnishop360.backend.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omnishop360.backend.domain.entity.VoucherCode;
import com.omnishop360.backend.domain.service.CashRegisterSessionService;
import com.omnishop360.backend.web.dto.GenerateRemainderVoucherRequest;
import com.omnishop360.backend.web.dto.VoucherCodeResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CashRegisterSessionControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CashRegisterSessionService cashRegisterSessionService;

    @Test
    @WithMockUser(authorities = "ROLE_cashier")
    @DisplayName("POST /v1/cash-register-sessions/remainder-vouchers should return created")
    void shouldGenerateRemainderVoucher() throws Exception {
        UUID sessionId = UUID.randomUUID();
        GenerateRemainderVoucherRequest request = new GenerateRemainderVoucherRequest(sessionId, new BigDecimal("1200"), null);
        VoucherCodeResponse response = VoucherCodeResponse.builder()
                .id(UUID.randomUUID())
                .code("VCH-ABCD1234")
                .originalAmount(new BigDecimal("1200"))
                .remainingAmount(new BigDecimal("1200"))
                .status(VoucherCode.Status.ACTIVE)
                .sourceSessionId(sessionId)
                .build();
        when(cashRegisterSessionService.generateRemainderVoucher(any())).thenReturn(response);

        mockMvc.perform(post("/v1/cash-register-sessions/remainder-vouchers")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("VCH-ABCD1234"));
    }
}
