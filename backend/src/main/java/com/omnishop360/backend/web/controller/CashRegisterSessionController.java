package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.entity.CashRegisterSession;
import com.omnishop360.backend.domain.service.CashRegisterSessionService;
import com.omnishop360.backend.web.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/cash-register-sessions")
@RequiredArgsConstructor
@Tag(name = "Cash Register Sessions", description = "API pour l'ouverture/clôture de caisse")
public class CashRegisterSessionController {

    private final CashRegisterSessionService cashRegisterSessionService;

    @PostMapping("/open")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Ouvrir une caisse")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Caisse ouverte"),
            @ApiResponse(responseCode = "400", description = "Session déjà ouverte ou données invalides")
    })
    public ResponseEntity<CashRegisterSessionResponse> openSession(@Valid @RequestBody OpenCashRegisterSessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cashRegisterSessionService.openSession(request));
    }

    @PostMapping("/close")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Clôturer une caisse")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Caisse clôturée"),
            @ApiResponse(responseCode = "404", description = "Session ouverte introuvable")
    })
    public ResponseEntity<CashRegisterSessionResponse> closeSession(@Valid @RequestBody CloseCashRegisterSessionRequest request) {
        return ResponseEntity.ok(cashRegisterSessionService.closeSession(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Lister les sessions de caisse")
    public ResponseEntity<PageResponse<CashRegisterSessionResponse>> getSessions(
            Pageable pageable,
            @Parameter(description = "Filtrer par statut OPEN/CLOSED")
            @RequestParam(required = false) CashRegisterSession.Status status
    ) {
        CashRegisterSessionSearchDto searchDto = CashRegisterSessionSearchDto.builder().status(status).build();
        return ResponseEntity.ok(cashRegisterSessionService.getSessions(searchDto, pageable));
    }

    @PostMapping("/remainder-vouchers")
    @PreAuthorize("hasAnyRole('tenant_admin', 'shop_admin', 'cashier')")
    @Operation(summary = "Générer un reliquat (avoir) manuellement")
    public ResponseEntity<VoucherCodeResponse> generateRemainderVoucher(
            @Valid @RequestBody GenerateRemainderVoucherRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cashRegisterSessionService.generateRemainderVoucher(request));
    }
}
