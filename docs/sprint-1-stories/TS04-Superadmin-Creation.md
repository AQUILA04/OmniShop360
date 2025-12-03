# TS04: Superadmin Creation

**Story:** As a developer, I want to automate the creation of a `superadmin` user during application deployment, so that the system has an initial administrator.

**Technology Stack:**
- **Backend:** Spring Boot
- **Authentication:** Keycloak

**Tasks:**

1.  **Create Superadmin Role in Keycloak:**
    - In the Keycloak configuration (e.g., realm export JSON in `keycloak-config`), add the `superadmin` role.

2.  **Create a Startup Runner in Spring Boot:**
    - Create a Spring Boot `ApplicationRunner` component that will be executed on application startup.
    - This runner will:
        - Check if a `superadmin` user already exists in Keycloak.
        - If not, it will create a new user with the `superadmin` role.
        - The `superadmin`'s email and initial username should be configurable via environment variables.
        - The runner will then trigger Keycloak's "Execute Actions Email" to send a password configuration link to the superadmin's email. This requires the "Verify Email" and "Update Password" actions to be enabled for the user.

3.  **Configure Email Server:**
    - Configure the SMTP settings in Keycloak to be able to send emails. This can be done via environment variables for the Keycloak container.

**Definition of Done (DoD):**

- **Superadmin Creation:**
    - A `superadmin` role is defined in Keycloak.
    - On the first startup of the backend application, a `superadmin` user is created in Keycloak.
    - On subsequent startups, the existing `superadmin` user is not modified.
- **Email Notification:**
    - The `superadmin` user receives an email with a link to set their password.
- **Configuration:**
    - The `superadmin`'s email is configurable via environment variables.
- **General:**
    - All code is committed to the Git repository.

**Validation Steps:**

1.  **Start the application for the first time.**
2.  **Check Keycloak to verify that the `superadmin` user has been created with the correct role.**
3.  **Check the email inbox of the configured `superadmin` email address for the password configuration email.**
4.  **Follow the link in the email to set the password for the `superadmin` user.**
5.  **Log in to the application as the `superadmin` user.**
6.  **Restart the application and verify that no new `superadmin` user is created.**
