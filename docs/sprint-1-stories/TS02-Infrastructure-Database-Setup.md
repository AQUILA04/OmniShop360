# TS02: Infrastructure & Database Setup

**Story:** As a developer, I want to set up the basic infrastructure for the project, including a database with schema migrations and a Dockerized environment.

**Technology Stack:**
- **Containerization:** Docker
- **Database:** PostgreSQL
- **Database Migrations:** Flyway
- **Backend:** Spring Boot

**Tasks:**

1.  **Create Docker Compose Configuration:**
    - Create a `docker-compose.yml` file in the root of the project.
    - Define services for `frontend`, `backend`, and `db`.
    - The `db` service should use the official `postgres` image.
    - Configure environment variables for the database connection.

2.  **Create Dockerfiles:**
    - Create a `Dockerfile` in the `frontend` directory for the Angular application.
    - Create a `Dockerfile` in the `backend` directory for the Spring Boot application.

3.  **Configure Database Migrations (Flyway):**
    - Add the `Flyway` dependency to the `backend/pom.xml`.
    - Configure the database connection in `application.properties`.
    - Create the first migration script in `src/main/resources/db/migration`.
    - The first migration `V1__Initial_schema.sql` will create the initial tables based on the PRD:
        - `tenants`
        - `shops`
        - `users`
        - `products`
        - `stock`
        - `orders`
        - `order_items`
    - All tables must include a `tenant_id` column for Row-Level Security.

**Definition of Done (DoD):**

- **Docker:**
    - `docker-compose up` successfully starts the `frontend`, `backend`, and `db` services.
    - The applications are accessible in the browser.
- **Database:**
    - Flyway is configured and runs migrations on startup.
    - The initial schema is created in the PostgreSQL database.
- **General:**
    - All code is committed to the Git repository.

**Validation Steps:**

1.  **Verify Docker Compose:**
    - Run `docker-compose up --build`.
    - Check that all containers are running.
    - Access the frontend and backend applications.
2.  **Verify Database Schema:**
    - After the backend starts, connect to the PostgreSQL database.
    - Verify that all the tables defined in the V1 migration script have been created.
    - Check that the `flyway_schema_history` table contains an entry for the V1 migration.
