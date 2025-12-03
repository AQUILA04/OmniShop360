# US-SA.1: Create a Tenant and Tenant Admin

**User Story:** As a **Superadmin**, I want to be able to create a new **Tenant** and a **Tenant Admin** for that tenant, so that I can onboard new businesses to the platform.

**Module:** `Superadmin`

**Tasks:**

1.  **Frontend (Angular):**
    - Create a new `Superadmin` module and a component for managing tenants.
    - Implement a form to create a new tenant, including a field for the tenant name.
    - The form should also include fields for the Tenant Admin's email.

2.  **Backend (Spring Boot):**
    - Create a new REST controller for managing tenants.
    - Implement the endpoint `POST /api/v1/superadmin/tenants`.
    - This endpoint will:
        - Create a new tenant in the `tenants` table.
        - Call the Keycloak Admin API to create a new user in Keycloak for the Tenant Admin.
        - Assign the `Tenant Admin` role to the new user.
        - Associate the `tenant_id` with the new user in the Keycloak user attributes.
    - The endpoint must be protected and only accessible to users with the `superadmin` role.

**Definition of Done (DoD):**

- **Frontend:**
    - A Superadmin can create a new tenant and a Tenant Admin.
- **Backend:**
    - The API endpoint for creating a tenant is implemented and protected.
    - A new tenant is created in the database.
    - A new user is created in Keycloak with the `Tenant Admin` role.
    - The `tenant_id` is stored as a user attribute in Keycloak.
- **General:**
    - The feature is covered by unit and integration tests.
    - All code is committed to the Git repository.

**Validation Steps:**

1.  **Log in as a Superadmin.**
2.  **Navigate to the Tenant Management page.**
3.  **Create a new tenant and Tenant Admin.**
4.  **Verify in the database that the new tenant has been created.**
5.  **Verify in Keycloak that the new user has been created with the `Tenant Admin` role and the correct `tenant_id` attribute.**
6.  **Log in as the new Tenant Admin.** They should be able to access the application and perform Tenant Admin tasks.
