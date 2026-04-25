---
name: omnishop-frontend-dev
description: Guide for frontend development agents working on OmniShop 360. Use this skill when developing, modifying, or reviewing frontend code (Angular, UI/UX, Design System) for the OmniShop 360 project to ensure strict adherence to design specifications, architectural rules, and SOLID/DRY principles.
---

# OmniShop 360 Frontend Development Guide

This skill provides strict guidelines and standards for developing the OmniShop 360 frontend application. As a frontend development agent, you MUST follow these instructions to ensure consistency, performance, and a premium user experience.

## 1. Core Philosophy & Design Vision

The application follows the **"Digital Atelier"** design philosophy: a space that feels curated, bespoke, and high-end, yet possesses the industrial strength required for multi-tenant retail operations.

- **Mobile-First Approach:** All development must start with mobile considerations. The UI must be perfectly responsive and usable on tablets and phones, especially for the Point of Sale (POS) interface.
- **Premium SaaS Aesthetic:** Avoid rigid, boxy constraints. Utilize intentional asymmetry, glassmorphism, and tonal depth. Do not use standard 1px solid borders for sectioning; use background color shifts instead.
- **Performance First:** The POS interface must respond in under 100ms. Minimize clicks and optimize touch targets (minimum 60px height for POS buttons).

## 2. Architecture & Technical Stack

The project is an Angular 17+ application using modern features like Signals and lazy loading.

### Tech Stack
- **Framework:** Angular 17+ (using Signals)
- **CSS Framework:** Tailwind CSS
- **Component Library:** PrimeNG
- **Icons:** Lucide Icons or Phosphor Icons
- **Charts:** Chart.js (via PrimeNG) or ngx-charts

### Module Structure
- `core/`: Transversal services, route guards, interceptors, and authentication logic (Keycloak).
- `shared/`: Reusable components, directives, and pipes. **Prioritize component reusability (DRY) from the very beginning.**
- `features/`: Main functional modules, loaded via lazy loading (except POS which may be eager loaded for performance).
  - `admin-tenant`: Tenant administration.
  - `admin-shop`: Shop administration.
  - `dashboard`: Dashboards and reports.
- `models/`: TypeScript interfaces and data models based on API contracts.

## 3. Design System Implementation

You must strictly implement the design system as defined in the visual specifications.

### Color Palette & Theming
- Use CSS Variables (Design Tokens) for colors to support multi-tenant theming.
- **Primary:** `#2F7EDA` (Blue Jeans) - Customizable by tenant.
- **Success:** `#51BC8F` (Ocean Green)
- **Warning:** `#FCA103` (Orange Web)
- **Error:** `#D93E3E` (Vermilion)
- **Backgrounds:** Use `surface` (`#FFFFFF`), `surface-container-lowest` (`#FFFFFF`), `surface-container-low` (`#F4F2FF` or `#F8F9FA`), and `background` (`#FBF8FF` or `#FCFDFD`) to create depth without borders.

### Typography
- **Primary Font:** Inter (or Roboto as fallback).
- Use aggressive hierarchy: Pair `Heading 1` (32px, SemiBold) or `Heading 2` with smaller body text to create an editorial feel.
- Never use pure black (`#000000`); use `#555663` or `#414752` for text.

### Components & Depth
- **The "No-Line" Rule:** Do not use `<hr>` or 1px solid borders to separate content. Use 12px vertical whitespace or subtle background color toggles.
- **Tonal Layering:** Create elevation by placing lighter cards on slightly darker backgrounds, rather than relying heavily on drop shadows.
- **Ambient Shadows:** When shadows are necessary (e.g., floating elements), use diffused, tinted shadows (e.g., `box-shadow: 0 20px 40px rgba(25, 27, 38, 0.05);`), never pure black shadows.
- **Glassmorphism:** For modals and overlays, use 80% opacity surface color with a 20px backdrop-blur.
- **Buttons:** Primary buttons should use a subtle linear gradient. Hover states should include a `scale(1.02)` or slight upward shift. POS buttons MUST be at least 60px high.

## 4. Development Principles (SOLID & DRY)

Act with the rigor of a Senior Developer. Quality and correctness are paramount.

- **Single Responsibility Principle (SRP):** Components should do one thing. Separate UI presentation from business logic. Use Angular Services for state management and API calls.
- **Don't Repeat Yourself (DRY):** If a UI pattern or logic block is used more than once, extract it into the `shared/` or `core/` module.
- **Strict Typing:** Always use strict TypeScript interfaces (defined in `models/`). Do not use `any`.
- **Verification:** Meticulously verify all code, variable usage, and method references before finalizing a feature. Do not make assumptions about API responses; rely on the provided contracts.

## 5. Workflow Constraints

- **Iterative Visual Overhaul:** When implementing significant visual changes, focus on a single user journey (e.g., "admin-shop") and present the visual rendering for review before proceeding to other parts of the application.
- **Component Adaptation:** When using PrimeNG, adapt its default styling to match the OmniShop custom theme using Tailwind CSS and CSS variables.

## References

- Use `references/design-system.md` for complete design tokens and component specs.
- Use `references/architecture.md` for Angular architecture details.
