# US-A.2: Create a Shop Admin

**User Story:** As a **Tenant Admin**, I want to be able to create a **Shop Admin** and associate them only with their boutique to ensure data security.

**ID from PRD:** A.2

**Module:** `Admin-Tenant`

**Tasks:**

1.  **Frontend (Angular):**
    - Create a new component in the `Admin-Tenant` module for managing Shop Admins.
    - Implement a form to create a new Shop Admin, including fields for their email and the shop they will be assigned to.
    - The list of shops should be populated from the shops owned by the Tenant Admin.

2.  **Backend (Spring Boot):**
    - Create a new REST controller for managing Shop Admins.
    - Implement the endpoint `POST /api/v1/tenant/shop-admins`.
    - This endpoint will:
        - Take the Shop Admin's email and the `shop_id` as input.
        - Call the Keycloak Admin API to create a new user in Keycloak.
        - Assign the `Shop Admin` role to the new user.
        - Associate the `shop_id` with the new user in the Keycloak user attributes.
    - The endpoint must be protected and only accessible to users with the `Tenant Admin` role.

**Definition of Done (DoD):**

- **Frontend:**
    - A Tenant Admin can create a new Shop Admin and assign them to a shop.
- **Backend:**
    - The API endpoint for creating a Shop Admin is implemented and protected.
    - A new user is created in Keycloak with the `Shop Admin` role.
    - The `shop_id` is stored as a user attribute in Keycloak.
- **Security:**
    - The new Shop Admin can only access the data of their assigned shop. This will be enforced by RLS, which will be implemented in a separate story. This story is focused on the creation of the user.
- **General:**
    - The feature is covered by unit and integration tests.
    - All code is committed to the Git repository.

**Validation Steps:**

1.  **Log in as a Tenant Admin.**
2.  **Navigate to the Shop Admin Management page.**
3.  **Create a new Shop Admin.**
4.  **Verify in Keycloak that the new user has been created with the `Shop Admin` role and the correct `shop_id` attribute.**
5.  **Log in as the new Shop Admin.** They should be able to access the application, but their access to data will be limited in subsequent stories.
