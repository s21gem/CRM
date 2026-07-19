# Modules Documentation

This document explains the physical and logical modules implemented in the FoneBox Enterprise CRM monorepo.

## 1. Foundation
Located across `apps/web` (Frontend) and `apps/api` (Backend). The foundation establishes standard communication via REST, database ORM interaction via Prisma, and environment configurations. It strictly follows SOLID principles.

## 2. Authentication
The `apps/api/src/modules/auth` handles login, token issuance, session tracking, and revocation. It uses `bcrypt` for password hashing and issues secure JWTs. It integrates with `AuditLog` for security event tracking.

## 3. RBAC (Role-Based Access Control)
Roles are seeded centrally. Access control is managed in `apps/api/src/middlewares/auth.middleware.ts` which decodes JWTs, checks the `roles` payload against the required endpoint permissions, and rejects unauthorized requests with a `403`. Frontend guards (e.g., `useRole`) complement this defensively.

## 4. Marketing Website
Located in `apps/web/src/app`. Built with Next.js App Router Server Components to ensure optimal SEO and performance. It serves as the primary acquisition channel, featuring dynamic routing and responsive layouts.

## 5. Content System
Located in `apps/web/src/content/index.ts`. All textual data (services, FAQs, testimonials, pricing) is isolated from UI components. This prepares the website for an easy migration to a Headless CMS (like Sanity or Strapi) in future iterations.

## 6. Lead System
Located in `apps/api/src/modules/leads`. Exposes POST endpoints for various lead types (`quote`, `inquiry`, `repair`, `business`). Crucially, it uses an atomic `upsert` mechanism on the `Sequence` table to generate guaranteed unique reference identifiers (e.g., `FBX-2026-000001`).

## 7. Analytics
Located in `apps/web/src/lib/analytics.ts`. A provider-agnostic abstraction layer. UI components call `Analytics.trackEvent()` which can later be mapped to GTM, PostHog, or Mixpanel without altering the UI logic.

## 8. Shared Components
Located in `apps/web/src/components/ui`. A highly reusable, Tailwind-based component library. Enforces DRY principles by standardizing Buttons, Inputs, Cards, and layout primitives. 

## 9. Future Modules
Upcoming modules will include:
- `Tickets` (Pipeline state management)
- `Inventory` (Parts handling)
- `Billing` (Invoicing and payments)
