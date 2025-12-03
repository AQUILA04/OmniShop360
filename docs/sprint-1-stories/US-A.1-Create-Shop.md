# US-A.1: Create, Activate, and Deactivate Shops

**User Story:** As a **Tenant Admin**, I want to be able to create, activate, and deactivate new **Boutiques** (Shops) in order to expand my network.

**ID from PRD:** A.1

**Module:** `Admin-Tenant`

**Tasks:**

1.  **Frontend (Angular):**
    - Create a new component in the `Admin-Tenant` module for managing shops.
    - The component should display a list of existing shops with their status (active/inactive).
    - Implement a form to create a new shop, including fields for the shop name and address.
    - Add buttons to activate or deactivate a shop.

2.  **Backend (Spring Boot):**
    - Create a new REST controller for managing shops.
    - Implement the following endpoints:
        - `GET /api/v1/tenant/shops`: Get a list of all shops for the current tenant.
        - `POST /api/v1/tenant/shops`: Create a new shop.
        - `PUT /api/v1/tenant/shops/{shopId}/activate`: Activate a shop.
        - `PUT /api/v1/tenant/shops/{shopId}/deactivate`: Deactivate a shop.
    - All endpoints must be protected and only accessible to users with the `Tenant Admin` role.
    - The backend must enforce Row-Level Security to ensure a Tenant Admin can only manage shops within their own tenant.

**Definition of Done (DoD):**

- **Frontend:**
    - A Tenant Admin can see a list of all their shops.
    - A Tenant Admin can create a new shop.
    - A Tenant Admin can activate and deactivate a shop.
    - The UI is intuitive and provides feedback to the user.
- **Backend:**
    - The API endpoints are implemented and protected.
    - The business logic for creating, activating, and deactivating shops is implemented.
    - Row-Level Security is enforced.
- **General:**
    - The feature is covered by unit and integration tests.
    - All code is committed to the Git repository.

**Validation Steps:**

1.  **Log in as a Tenant Admin.**
2.  **Navigate to the Shop Management page.**
3.  **Create a new shop.** Verify that the shop is added to the list with a generated ID and the correct address.
4.  **Deactivate the shop.** Verify that the shop's status changes.
5.  **Activate the shop.** Verify that the shop's status changes back to active.
6.  **Try to access the API endpoints with a user that is not a Tenant Admin.** The request should be denied.
