# Changelog

All notable changes to this project will be documented in this file.

## [Prompt 3] - Customer-Facing Website & Lead Generation Platform
### Added
- Enterprise-grade Next.js Marketing Pages (Home, About, Services, Pricing, Business, FAQ, Contact, Privacy, Terms).
- Reusable UI Components (Hero, CTABanner, PricingCard, ServiceCard, FAQAccordion, TestimonialCard).
- Abstracted Analytics Layer (`lib/analytics.ts`) for event tracking.
- `Lead` Schema enhancements in Prisma (`LeadSource`, `LeadPriority`, Marketing attribution, `consentAccepted`).
- Concurrency-safe Lead Reference Number generator (`Sequence` model in Prisma).
- Backend `/api/v1/leads/*` routes with Zod validation.
- AI-Generated visual assets via integrated Image AI tool, structured in `public/images/`.
- Detailed Prompt Engineering log in `docs/AI_ASSET_PROMPTS.md`.
- `docs/WEBSITE.md` documentation.

## [Prompt 2] - Enterprise Authentication and RBAC
### Added
- Complete Enterprise Authentication flow (Login, Logout, Session Validation).
- Stateful Session Management (Token rotation, revocation, expiration, IP/UserAgent tracking).
- Cryptographic Hashing for passwords and refresh tokens using `bcrypt`.
- Reusable Authentication Hooks (`useAuth`, `useRole`, `usePermission`).
- Reusable React Guards (`AuthGuard`, `RoleGuard`, `PermissionGuard`, `GuestGuard`).
- `SUPER_ADMIN` and `Permission` models in Prisma Schema.
- Database Audit Logs for all Authentication Events (`LOGIN_SUCCESS`, `LOGIN_FAILED`, `LOGOUT`, etc.).
- Centralized configuration-driven Sidebar navigation based on user roles.
- `seed-demo-users.ts` script for generating demo data and permissions.
- Documentation for Authentication, RBAC, and Security.

## [Prompt 1] - Enterprise Foundation
### Added
- Initialized Monorepo using `npm workspaces`.
- Created `apps/web` (Next.js 15, App Router, Tailwind).
- Created `apps/api` (Express, TypeScript).
- Initialized Prisma ORM setup.
- Configured ESLint and Prettier across workspaces.
- Implemented core UI component library.
- Initialized project routing and layouts.
- Initialized PWA Manifest metadata.
