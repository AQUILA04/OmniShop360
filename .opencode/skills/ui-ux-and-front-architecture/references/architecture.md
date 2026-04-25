# OmniShop 360 Architecture & Best Practices

This document outlines the Angular architectural rules and development best practices for the OmniShop 360 frontend application.

## 1. Angular Application Structure

The application is structured using feature modules with lazy loading to ensure optimal performance.

### `core` Module
- Contains application-wide singleton services.
- Includes route guards (e.g., AuthGuard).
- Includes HTTP interceptors (e.g., adding Keycloak tokens, error handling).
- Houses the central authentication logic.

### `shared` Module
- Contains reusable UI components (buttons, cards, data tables).
- Contains custom directives and pipes.
- **Rule:** If a component or logic is used in more than one feature module, it must be placed in `shared` or `core`.

### `features` Modules
- `admin-tenant`: Loaded lazily. Handles tenant-level operations (shops, global catalog).
- `admin-shop`: Loaded lazily. Handles shop-level operations (inventory, local sales history).
- `dashboard`: Loaded lazily. Contains BI and analytics views.
- **POS Module:** The Point of Sale interface may be eager-loaded or pre-loaded to guarantee immediate availability for cashiers.

### `models` Directory
- Contains TypeScript interfaces representing data structures.
- **Rule:** Always map API contracts (e.g., `contracts/analytics-controller.v1.md`) strictly to TypeScript interfaces. Avoid using `any`.

## 2. SOLID Principles in Angular

As a frontend developer on this project, you must adhere to SOLID principles:

- **Single Responsibility Principle (SRP):**
  - A component should only manage its view and user interactions.
  - State management, API calls, and complex business logic must be delegated to Services.
- **Open/Closed Principle (OCP):**
  - Design components to be extensible (e.g., using `@Input()`, `@Output()`, and content projection with `<ng-content>`) rather than modifying existing code for new use cases.
- **Liskov Substitution Principle (LSP):**
  - Ensure derived classes or extended components can replace base components without breaking the application.
- **Interface Segregation Principle (ISP):**
  - Create specific, focused TypeScript interfaces rather than large, monolithic ones.
- **Dependency Inversion Principle (DIP):**
  - Rely on abstractions (interfaces) rather than concrete implementations. Use Angular's Dependency Injection system effectively.

## 3. DRY Principle (Don't Repeat Yourself)

- Prioritize component reusability from the start of development.
- Extract common CSS classes into Tailwind utility classes or PrimeNG theme overrides.
- Centralize API endpoints and configuration in environment files or configuration services.

## 4. Mobile-First Development

- Start styling for the smallest screens (`< 640px`) using Tailwind's default classes.
- Use responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) to adjust layouts for larger screens.
- **POS Exception:** The POS interface is highly specific and must prioritize touch targets (min 60px height) and rapid interaction over standard responsive reflows. It often uses a split-screen layout on tablets/desktop.

## 5. Quality and Verification

- Adopt the rigor of a senior developer.
- Verify all variable names, method references, and template bindings.
- Do not make assumptions about data structures; always refer to the `models` and API contracts.
- Ensure that the implementation strictly matches the visual specifications and wireframes provided in the design documents.
