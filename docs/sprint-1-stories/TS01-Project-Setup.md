# TS01: Project Setup (Spring Boot & Angular)

**Story:** As a developer, I want to set up the initial project structure for a Spring Boot backend and an Angular frontend, so that we have a clean and organized codebase from the start.

**Technology Stack:**
- **Frontend:** Angular CLI
- **Backend:** Spring Boot with Maven
- **Linting:** TSLint/ESLint for Angular, Checkstyle for Spring Boot
- **Formatting:** Prettier for Angular

**Tasks:**

1.  **Initialize Frontend (Angular):**
    - Use the Angular CLI to create a new application in the `frontend` directory.
    - Enable routing.
    - Create the modules defined in the architecture: `Admin-Tenant`, `Admin-Shop`, `POS`, `Core`, and `Auth`. Configure lazy loading for `Admin-Tenant` and `Admin-Shop`.
    - Set up TSLint/ESLint and Prettier for code quality.

2.  **Initialize Backend (Spring Boot):**
    - Use the Spring Initializr to create a new Spring Boot application in the `backend` directory.
    - Use Maven as the build tool.
    - Include the following dependencies: `Spring Web`, `Spring Security`, `Spring Data JPA`, `PostgreSQL Driver`.
    - Create a basic REST controller with a "Hello World" endpoint.
    - Set up Checkstyle for code quality.

**Definition of Done (DoD):**

- **Frontend:**
    - The `frontend` directory contains a new Angular project.
    - The application can be started with `ng serve`.
    - The defined modules are created and lazy loading is configured.
    - TSLint/ESLint and Prettier are configured and working.
    - A `README.md` file is created with setup and run instructions.
- **Backend:**
    - The `backend` directory contains a new Spring Boot project.
    - The application can be started with `mvn spring-boot:run`.
    - A "Hello World" endpoint is working.
    - Checkstyle is configured and working.
    - A `README.md` file is created with setup and run instructions.
- **General:**
    - All code is committed to the Git repository.

**Validation Steps:**

1.  **Verify Frontend:**
    - `cd frontend`
    - `npm install`
    - `ng serve` (should start the dev server without errors)
    - `ng lint` (should not report any errors)
    - Open the browser and see the Angular application.

2.  **Verify Backend:**
    - `cd backend`
    - `mvn compile`
    - `mvn spring-boot:run` (should start the server without errors)
    - Send a GET request to the "Hello World" endpoint and expect a response.
    - `mvn checkstyle:check` (should not report any errors).
