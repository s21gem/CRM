# Project Status: FoneBox Enterprise CRM

**Governance**: This project strictly adheres to the Definition of Done outlined in [GOVERNANCE.md](../GOVERNANCE.md).

## 🟢 Completed Iterations
- **Prompt 1**: Enterprise Foundation (Monorepo, Next.js, Express, Prisma, Tailwind, UI Library).
- **Prompt 2**: Enterprise Authentication & Role-Based Access Control (RBAC).
- **Prompt 3**: Customer-Facing Website & Lead Generation Platform.
- **Pre-Prompt 4**: Architecture, Documentation, and Quality Gate.
- **Prompt 4**: CRM Pipeline & Operations (Sales Pipeline Kanban, Service Queue, Lead detail view, Workflow-centric operations).

## 🏛 Current Architecture
- **Frameworks**: Next.js 15 (App Router), Express.js (REST API).
- **Language**: TypeScript 5.
- **Database**: PostgreSQL with Prisma ORM.
- **Styling**: Tailwind CSS with custom UI library (`@/components/ui`).
- **Monorepo**: npm workspaces (`apps/web`, `apps/api`, `packages/config`, `packages/types`, `packages/utils`).
- **Security**: JWT-based session management with HttpOnly architecture capabilities, bcrypt hashing, opaque refresh tokens.
- **Pipeline**: `@dnd-kit/core` drag-and-drop workflow handling.

## 🔐 Implemented Modules
- **Authentication**: Stateful login, session tracking, session revocation, token rotation.
- **RBAC**: Multi-tier hierarchy, permission-based routing, component-level guards.
- **Logging**: Comprehensive `AuditLog` and `LeadActivity` tracking for CRM events.
- **Lead Capture**: Concurrency-safe Lead reference generator, standardized Lead submission APIs (`/quote`, `/repair`, `/business`).
- **Marketing Frontend**: Data-driven Next.js marketing architecture, AI-generated assets, centralized analytics abstraction.
- **CRM Operations**: Workflow-centric Sales Pipeline and Service Queue.

## 🚧 Pending Roadmap
- **Prompt 9**: Payment Processing System
- Future Iterations (To be defined)

## 🛡 Post-Prompt 8 Architecture Lock & QA
## Project State
- Prompts Completed: 1, 2, 3, 4, 5, 6, 7, 8
- Modules Implemented: 
  - Core CRM (Auth, Roles, Leads, Customers)
  - Hardware Ecosystem (Devices)
  - Operations (Repair Orders, Checklists)
  - Inventory & Parts Management (Stock, Reservations, Movements)
  - Billing & Invoices (Financial State, Immutable Snapshots)
- Current Target: Prompt 9 (Payment Processing System)
The project underwent a rigorous stabilization phase before entering Prompt 7.
- **Database Schema**: Hardened `onDelete` behaviors. `Customer.organizationId` and `Lead.customerId` use `SetNull` as a defensive safeguard. Deletion of a customer is NOT part of the standard business workflow (customers should be archived, not deleted). `Device.customerId` uses implicit `Restrict` because a device cannot logically exist without an owner, and we must never delete an owner with active devices.
- **Soft Delete Strategy**: The CRM will rely on status flags (e.g., `status: 'ARCHIVED'`) for entity removal instead of hard deletion to preserve marketing attribution and historical data integrity.
- **Transaction Atomicity**: All business transactions (e.g., Lead Conversion, Customer Creation, Repair Status changes) have been securely migrated to the Service Layer (`CrmService`, `CustomersService`, `RepairsService`).
- **Repository Health**: 
  - Verified no unused Prisma models exist in the current domain.
  - Checked for unused components and cleaned up route RBAC middlewares.
  - Verified atomic sequence generation.

## ⚠️ Known Limitations
- None. Enterprise Foundation, Authentication, and CRM Pipelines are production-locked.
