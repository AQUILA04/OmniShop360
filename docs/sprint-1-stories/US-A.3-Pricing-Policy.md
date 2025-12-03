# US-A.3: Configure Pricing Policy

**User Story:** As a **Tenant Admin**, I want to be able to set the **pricing policy** (Global Imposed or Local Enforceable) to control my margin.

**ID from PRD:** A.3

**Module:** `Admin-Tenant`

**Tasks:**

1.  **Frontend (Angular):**
    - Create a new component in the `Admin-Tenant` module for configuring the pricing policy.
    - The component should allow the Tenant Admin to choose between two options: "Global Imposed" and "Local Enforceable".
    - The current pricing policy should be displayed.

2.  **Backend (Spring Boot):**
    - Create a new REST controller for managing the pricing policy.
    - Implement the following endpoints:
        - `GET /api/v1/tenant/pricing-policy`: Get the current pricing policy for the tenant.
        - `PUT /api/v1/tenant/pricing-policy`: Set the pricing policy for the tenant.
    - The pricing policy should be persisted in the `tenants` table in the database.
    - The endpoints must be protected and only accessible to users with the `Tenant Admin` role.

**Definition of Done (DoD):**

- **Frontend:**
    - A Tenant Admin can view and set the pricing policy.
- **Backend:**
    - The API endpoints for managing the pricing policy are implemented and protected.
    - The pricing policy is stored in the database.
- **General:**
    - The feature is covered by unit and integration tests.
    - All code is committed to the Git repository.

**Validation Steps:**

1.  **Log in as a Tenant Admin.**
2.  **Navigate to the Pricing Policy page.**
3.  **Set the pricing policy to "Global Imposed".** Verify that the setting is saved.
4.  **Refresh the page and verify that the correct pricing policy is displayed.**
5.  **Set the pricing policy to "Local Enforceable".** Verify that the setting is saved.
6.  **Check the database to confirm that the `pricing_policy` column in the `tenants` table has been updated.**
