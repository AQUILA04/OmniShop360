package com.omnishop360.backend.web.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("CreateTenantRequest Tests")
class CreateTenantRequestTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("Should create valid CreateTenantRequest")
    void shouldCreateValidCreateTenantRequest() {
        CreateTenantRequest request = new CreateTenantRequest(
                "ACME Corporation",
                "contact@acme.com",
                "John",
                "Doe",
                "john.doe@acme.com"
        );

        Set<ConstraintViolation<CreateTenantRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("Should fail validation when companyName is blank")
    void shouldFailValidationWhenCompanyNameIsBlank() {
        CreateTenantRequest request = new CreateTenantRequest(
                "",
                "contact@acme.com",
                "John",
                "Doe",
                "john.doe@acme.com"
        );

        Set<ConstraintViolation<CreateTenantRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("companyName")));
    }

    @Test
    @DisplayName("Should fail validation when companyName is too short")
    void shouldFailValidationWhenCompanyNameIsTooShort() {
        CreateTenantRequest request = new CreateTenantRequest(
                "AB",
                "contact@acme.com",
                "John",
                "Doe",
                "john.doe@acme.com"
        );

        Set<ConstraintViolation<CreateTenantRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("companyName") && 
                v.getMessage().contains("between 3 and 100 characters")));
    }

    @Test
    @DisplayName("Should fail validation when contactEmail is invalid")
    void shouldFailValidationWhenContactEmailIsInvalid() {
        CreateTenantRequest request = new CreateTenantRequest(
                "ACME Corporation",
                "invalid-email",
                "John",
                "Doe",
                "john.doe@acme.com"
        );

        Set<ConstraintViolation<CreateTenantRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("contactEmail")));
    }

    @Test
    @DisplayName("Should fail validation when adminFirstName is blank")
    void shouldFailValidationWhenAdminFirstNameIsBlank() {
        CreateTenantRequest request = new CreateTenantRequest(
                "ACME Corporation",
                "contact@acme.com",
                "",
                "Doe",
                "john.doe@acme.com"
        );

        Set<ConstraintViolation<CreateTenantRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("adminFirstName")));
    }

    @Test
    @DisplayName("Should fail validation when adminFirstName is too short")
    void shouldFailValidationWhenAdminFirstNameIsTooShort() {
        CreateTenantRequest request = new CreateTenantRequest(
                "ACME Corporation",
                "contact@acme.com",
                "J",
                "Doe",
                "john.doe@acme.com"
        );

        Set<ConstraintViolation<CreateTenantRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> 
                v.getPropertyPath().toString().equals("adminFirstName") && 
                v.getMessage().contains("between 2 and 50 characters")));
    }

    @Test
    @DisplayName("Should fail validation when adminLastName is blank")
    void shouldFailValidationWhenAdminLastNameIsBlank() {
        CreateTenantRequest request = new CreateTenantRequest(
                "ACME Corporation",
                "contact@acme.com",
                "John",
                "",
                "john.doe@acme.com"
        );

        Set<ConstraintViolation<CreateTenantRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("adminLastName")));
    }

    @Test
    @DisplayName("Should fail validation when adminEmail is invalid")
    void shouldFailValidationWhenAdminEmailIsInvalid() {
        CreateTenantRequest request = new CreateTenantRequest(
                "ACME Corporation",
                "contact@acme.com",
                "John",
                "Doe",
                "invalid-email"
        );

        Set<ConstraintViolation<CreateTenantRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("adminEmail")));
    }

    @Test
    @DisplayName("Should fail validation when adminEmail is blank")
    void shouldFailValidationWhenAdminEmailIsBlank() {
        CreateTenantRequest request = new CreateTenantRequest(
                "ACME Corporation",
                "contact@acme.com",
                "John",
                "Doe",
                ""
        );

        Set<ConstraintViolation<CreateTenantRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("adminEmail")));
    }

    @Test
    @DisplayName("Should fail validation when all fields are invalid")
    void shouldFailValidationWhenAllFieldsAreInvalid() {
        CreateTenantRequest request = new CreateTenantRequest(
                "",
                "invalid",
                "",
                "",
                "invalid"
        );

        Set<ConstraintViolation<CreateTenantRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertEquals(8, violations.size());
    }

    @Test
    @DisplayName("Should accept valid email formats")
    void shouldAcceptValidEmailFormats() {
        String[] validEmails = {
                "user@example.com",
                "user.name@example.com",
                "user+tag@example.co.uk",
                "user123@example-domain.com"
        };

        for (String email : validEmails) {
            CreateTenantRequest request = new CreateTenantRequest(
                    "ACME Corporation",
                    email,
                    "John",
                    "Doe",
                    email
            );

            Set<ConstraintViolation<CreateTenantRequest>> violations = validator.validate(request);
            assertTrue(violations.isEmpty(), "Email " + email + " should be valid");
        }
    }
}

