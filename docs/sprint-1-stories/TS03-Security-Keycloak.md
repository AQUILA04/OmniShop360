# TS03: Security with Keycloak

**Story:** As a developer, I want to integrate Keycloak for authentication and authorization to secure the application and manage user access.

**Technology Stack:**
- **Authentication:** Keycloak
- **Backend:** Spring Boot with Spring Security
- **Frontend:** Angular

**Tasks:**

1.  **Configure Keycloak:**
    - Set up a new realm in Keycloak for OmniShop360.
    - Create a client for the Angular frontend (public) and a client for the Spring Boot backend (confidential).
    - Create the roles defined in the PRD (`superadmin`, `Tenant Admin`, `Shop Admin`, etc.).
    - Create a custom mapper to add `tenant_id` to the JWT.

2.  **Integrate Backend with Keycloak:**
    - Add the Spring Boot Keycloak adapter dependency to `pom.xml`.
    - Configure the connection to Keycloak in `application.properties`.
    - Configure Spring Security to use the Keycloak adapter.
    - Create a protected endpoint that can only be accessed by users with a specific role.

3.  **Integrate Frontend with Keycloak:**
    - Add the `keycloak-angular` library to the Angular application.
    - Configure the Keycloak adapter in the `Core & Auth` module.
    - Implement login and logout functionality.
    - Create an Angular guard to protect routes based on authentication status and roles.

**Definition of Done (DoD):**

- **Keycloak:**
    - A realm, clients, and roles are configured in Keycloak.
    - The `tenant_id` custom mapper is working.
- **Backend:**
    - The backend is successfully connected to Keycloak.
    - There is a protected endpoint that enforces role-based access.
- **Frontend:**
    - The frontend can authenticate users with Keycloak.
    - Route guards are in place to protect routes.
    - The JWT is sent with every request to the backend.
- **General:**
    - All code is committed to the Git repository.

**Validation Steps:**

1.  **Verify Backend Protection:**
    - Attempt to access the protected endpoint without a token (should fail).
    - Attempt to access the protected endpoint with a token but without the required role (should fail).
    - Access the protected endpoint with a token and the correct role (should succeed).
2.  **Verify Frontend Authentication:**
    - The user is redirected to the Keycloak login page when trying to access a protected route.
    - After login, the user is redirected back to the application.
    - The user's information (username, roles) is available in the application.
    - The logout functionality works correctly.
