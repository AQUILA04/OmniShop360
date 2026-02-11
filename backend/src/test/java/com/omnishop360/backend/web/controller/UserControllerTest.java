package com.omnishop360.backend.web.controller;

import com.omnishop360.backend.domain.service.UserService;
import com.omnishop360.backend.web.dto.PageResponse;
import com.omnishop360.backend.web.dto.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserController Tests")
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private UserResponse userResponse;
    private PageResponse<UserResponse> pageResponse;

    @BeforeEach
    void setUp() {
        userResponse = UserResponse.builder()
                .id(UUID.randomUUID())
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@test.com")
                .keycloakId("keycloak-123")
                .active(true)
                .tenantId(UUID.randomUUID())
                .tenantCompanyName("ACME Corp")
                .build();

        pageResponse = PageResponse.<UserResponse>builder()
                .content(List.of(userResponse))
                .page(PageResponse.PageInfo.builder()
                        .size(20)
                        .number(0)
                        .totalElements(1L)
                        .totalPages(1)
                        .build())
                .build();
    }

    @Test
    @DisplayName("Should get users successfully")
    void shouldGetUsersSuccessfully() {
        when(userService.getUsers(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<UserResponse>> response = userController.getUsers(
                PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "createdAt")),
                null, null, null, null, null);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getContent().size());
        verify(userService).getUsers(any(), any());
    }

    @Test
    @DisplayName("Should get users with all search parameters")
    void shouldGetUsersWithAllSearchParameters() {
        when(userService.getUsers(any(), any())).thenReturn(pageResponse);

        ResponseEntity<PageResponse<UserResponse>> response = userController.getUsers(
                PageRequest.of(0, 20, Sort.by(Sort.Direction.ASC, "lastName")),
                "john", "john.doe@test.com", true, UUID.randomUUID(), UUID.randomUUID());

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService).getUsers(any(), any());
    }
}
