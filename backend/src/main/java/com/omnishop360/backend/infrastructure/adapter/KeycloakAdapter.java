package com.omnishop360.backend.infrastructure.adapter;

import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@Slf4j
public class KeycloakAdapter {

    private final String keycloakUrl;
    private final String realm;
    private final String clientId;
    private final String clientSecret;

    public KeycloakAdapter(
            @Value("${keycloak.url:http://localhost:8080}") String keycloakUrl,
            @Value("${keycloak.realm:omnishop360}") String realm,
            @Value("${keycloak.client-id:omnishop-backend}") String clientId,
            @Value("${keycloak.client-secret:}") String clientSecret) {
        this.keycloakUrl = keycloakUrl;
        this.realm = realm;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    private Keycloak getKeycloakClient() {
        return KeycloakBuilder.builder()
                .serverUrl(keycloakUrl)
                .realm(realm)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .grantType("client_credentials")
                .build();
    }

    private RealmResource getRealmResource() {
        return getKeycloakClient().realm(realm);
    }

    public String createUser(String email, String firstName, String lastName, String role) {
        try {
            UsersResource usersResource = getRealmResource().users();
            
            UserRepresentation user = new UserRepresentation();
            user.setEnabled(true);
            user.setEmail(email);
            user.setEmailVerified(false);
            user.setUsername(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            
            org.keycloak.representations.idm.CredentialRepresentation credential = 
                    new org.keycloak.representations.idm.CredentialRepresentation();
            credential.setType(org.keycloak.representations.idm.CredentialRepresentation.PASSWORD);
            credential.setValue(java.util.UUID.randomUUID().toString() + "!A1");
            credential.setTemporary(true);
            user.setCredentials(Collections.singletonList(credential));

            try (Response response = usersResource.create(user)) {
                int statusCode = response.getStatus();
                log.debug("Keycloak create user response status: {}", statusCode);
                
                if (statusCode == Response.Status.CREATED.getStatusCode()) {
                    String userId = getCreatedUserId(response);
                    
                    if (userId != null) {
                        UserResource userResource = usersResource.get(userId);
                        
                        assignRoleToUser(userResource, role);
                        
                        sendPasswordResetEmail(userResource);
                        
                        log.info("User created in Keycloak: {} with role: {}", email, role);
                        return userId;
                    } else {
                        throw new RuntimeException("Failed to extract user ID from Keycloak response");
                    }
                } else if (statusCode == Response.Status.CONFLICT.getStatusCode()) {
                    log.warn("User already exists in Keycloak: {}", email);
                    UserRepresentation existingUser = usersResource.searchByEmail(email, true).stream()
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("User exists but could not be retrieved"));
                    return existingUser.getId();
                } else {
                    String errorMessage = response.readEntity(String.class);
                    log.error("Failed to create user in Keycloak: {} - Status: {}, Error: {}", email, statusCode, errorMessage);
                    log.error("User representation sent: enabled={}, email={}, username={}, firstName={}, lastName={}", 
                            user.isEnabled(), user.getEmail(), user.getUsername(), user.getFirstName(), user.getLastName());
                    throw new RuntimeException("Failed to create user in Keycloak (HTTP " + statusCode + "): " + errorMessage);
                }
            }
        } catch (Exception e) {
            log.error("Error creating user in Keycloak: {}", email, e);
            throw new RuntimeException("Error creating user in Keycloak: " + e.getMessage(), e);
        }
    }

    private String getCreatedUserId(Response response) {
        java.net.URI location = response.getLocation();
        if (location == null) {
            log.error("Location header is missing in Keycloak response");
            return null;
        }
        String locationHeader = location.toString();
        int lastSlashIndex = locationHeader.lastIndexOf('/');
        if (lastSlashIndex < 0 || lastSlashIndex >= locationHeader.length() - 1) {
            log.error("Invalid location header format: {}", locationHeader);
            return null;
        }
        return locationHeader.substring(lastSlashIndex + 1);
    }

    private void assignRoleToUser(UserResource userResource, String role) {
        try {
            List<org.keycloak.representations.idm.RoleRepresentation> realmRoles = 
                    getRealmResource().roles().list();
            
            org.keycloak.representations.idm.RoleRepresentation roleToAssign = realmRoles.stream()
                    .filter(r -> r.getName().equals(role))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Role not found: " + role));
            
            userResource.roles().realmLevel().add(Collections.singletonList(roleToAssign));
            log.debug("Role {} assigned to user", role);
        } catch (Exception e) {
            log.error("Error assigning role {} to user", role, e);
            throw new RuntimeException("Error assigning role to user: " + e.getMessage(), e);
        }
    }

    private void sendPasswordResetEmail(UserResource userResource) {
        try {
            List<String> actions = Collections.singletonList("UPDATE_PASSWORD");
            userResource.executeActionsEmail(actions);
            log.info("Password reset email sent to user");
        } catch (Exception e) {
            log.error("Error sending password reset email", e);
            throw new RuntimeException("Error sending password reset email: " + e.getMessage(), e);
        }
    }
}

