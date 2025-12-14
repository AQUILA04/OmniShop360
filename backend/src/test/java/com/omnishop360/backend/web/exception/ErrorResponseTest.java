package com.omnishop360.backend.web.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ErrorResponse Tests")
class ErrorResponseTest {

    @Test
    @DisplayName("Should create ErrorResponse with builder")
    void shouldCreateErrorResponseWithBuilder() {
        LocalDateTime timestamp = LocalDateTime.now();
        List<ErrorResponse.FieldError> fieldErrors = List.of(
                ErrorResponse.FieldError.builder()
                        .field("email")
                        .message("must be a valid email")
                        .build()
        );

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(timestamp)
                .status(400)
                .error("Bad Request")
                .message("Validation failed")
                .errors(fieldErrors)
                .path("/api/v1/tenants")
                .build();

        assertNotNull(errorResponse);
        assertEquals(timestamp, errorResponse.getTimestamp());
        assertEquals(400, errorResponse.getStatus());
        assertEquals("Bad Request", errorResponse.getError());
        assertEquals("Validation failed", errorResponse.getMessage());
        assertEquals(1, errorResponse.getErrors().size());
        assertEquals("email", errorResponse.getErrors().get(0).getField());
        assertEquals("must be a valid email", errorResponse.getErrors().get(0).getMessage());
        assertEquals("/api/v1/tenants", errorResponse.getPath());
    }

    @Test
    @DisplayName("Should create ErrorResponse without errors")
    void shouldCreateErrorResponseWithoutErrors() {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(404)
                .error("Not Found")
                .message("Resource not found")
                .path("/api/v1/tenants/123")
                .build();

        assertNotNull(errorResponse);
        assertEquals(404, errorResponse.getStatus());
        assertEquals("Not Found", errorResponse.getError());
        assertNull(errorResponse.getErrors());
    }

    @Test
    @DisplayName("Should create ErrorResponse with no-args constructor")
    void shouldCreateErrorResponseWithNoArgsConstructor() {
        ErrorResponse errorResponse = new ErrorResponse();

        assertNotNull(errorResponse);
        assertNull(errorResponse.getTimestamp());
        assertNull(errorResponse.getStatus());
        assertNull(errorResponse.getError());
        assertNull(errorResponse.getMessage());
        assertNull(errorResponse.getErrors());
        assertNull(errorResponse.getPath());
    }

    @Test
    @DisplayName("Should create FieldError with builder")
    void shouldCreateFieldErrorWithBuilder() {
        ErrorResponse.FieldError fieldError = ErrorResponse.FieldError.builder()
                .field("companyName")
                .message("must not be blank")
                .build();

        assertNotNull(fieldError);
        assertEquals("companyName", fieldError.getField());
        assertEquals("must not be blank", fieldError.getMessage());
    }

    @Test
    @DisplayName("Should create FieldError with no-args constructor")
    void shouldCreateFieldErrorWithNoArgsConstructor() {
        ErrorResponse.FieldError fieldError = new ErrorResponse.FieldError();

        assertNotNull(fieldError);
        assertNull(fieldError.getField());
        assertNull(fieldError.getMessage());
    }

    @Test
    @DisplayName("Should create ErrorResponse with all-args constructor")
    void shouldCreateErrorResponseWithAllArgsConstructor() {
        LocalDateTime timestamp = LocalDateTime.now();
        List<ErrorResponse.FieldError> fieldErrors = List.of();

        ErrorResponse errorResponse = new ErrorResponse(
                timestamp,
                500,
                "Internal Server Error",
                "An error occurred",
                fieldErrors,
                "/api/v1/tenants"
        );

        assertNotNull(errorResponse);
        assertEquals(timestamp, errorResponse.getTimestamp());
        assertEquals(500, errorResponse.getStatus());
        assertEquals("Internal Server Error", errorResponse.getError());
        assertEquals("An error occurred", errorResponse.getMessage());
        assertEquals(fieldErrors, errorResponse.getErrors());
        assertEquals("/api/v1/tenants", errorResponse.getPath());
    }
}

