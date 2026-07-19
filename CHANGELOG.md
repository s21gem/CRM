# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- **Repair Operations Module**: A full enterprise repair tracking system linking customers and devices.
- **Repair Workspace**: `crm/repairs/[id]` features merged timelines, technical diagnosis tracking, configurable checklists, and financial estimates.
- **Strict State Machines**: Backend validation strictly prevents invalid `RepairStatus` transitions (e.g. `NEW` directly to `DELIVERED`).
- **Database Architecture**: Implemented `RepairOrder`, `Diagnosis`, `RepairChecklistItem`, `RepairActivity`, and `RepairStatusHistory`.
- **Technician Dashboard**: Custom KPI metrics showing unassigned, waiting approval, and ready repairs.

## [Prompt 5] - Customer & Device Management (Enterprise Domain Foundation)
### Added
- **Customers & Devices Module**: Implemented the core business domain representing clients and their hardware.
- **Device Management Workspace**: Full 360-degree timeline view of a Customer and their registered Devices.
- **Lead to Customer Conversion**: True transactional lead conversion handling FBXC ID generation.
- **Customer Database Models**: Added `CustomerActivity`, `CustomerNote`, and `Device` models with atomic sequence generators.
- **Customer Roles**: Implemented RBAC checks for Customer view and management.
- **Customer Pages**: `/crm/customers` (List and statistics) and `/crm/customers/[id]` (Tabbed 360-degree workspace).

## [Prompt 4] - Enterprise CRM Workspace
### Added
- **CRM Operations Module**: Implemented a workflow-centric workspace mimicking enterprise CRMs.
- **Sales Pipeline**: Added a drag-and-drop Kanban board (`@dnd-kit/core`) for tracking leads through custom stages (`NEW`, `CONTACTED`, `IN_PROGRESS`, `CONVERTED`, `LOST`).
- **Service Queue**: Added a dedicated data table for `REPAIR_REQUEST` and `GENERAL_INQUIRY` tracking.
- **CRM Dashboard**: Added KPI metrics showing Total Leads, New Leads, and Conversion Rates.
- **Lead Slide-Over**: Built a comprehensive 360-degree view component for lead contact information, activity history, and notes.
- **LeadActivity Model**: Implemented granular event tracking specifically for CRM records.
- **LeadNote Model**: Added ability for users to append timestamped notes to leads.
- **CRM Controller**: Created specialized backend endpoints for assigning, converting, and updating lead states.
- **Audit Logging**: Ensured all mutating CRM operations append to both `LeadActivity` and global `AuditLog`.

## [Pre-Prompt 4] - Quality Gate & Documentation
### Added
- Comprehensive architecture documentation (`SYSTEM_ARCHITECTURE.md`, `ROADMAP.md`, `MODULES.md`, `API.md`, `DATABASE.md`, `PROJECT_STRUCTURE.md`, `COMPONENTS.md`).
- Performance review and Security review documentation.
- Updated `README.md` and AI asset prompts metadata.
- Pre-prompt 4 codebase verification check.

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
