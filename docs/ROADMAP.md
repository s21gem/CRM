# Project Roadmap

This document outlines the complete implementation roadmap for the FoneBox Enterprise CRM.

## ✅ Completed

### Prompt 1: Enterprise Foundation
- Initialize Turborepo Monorepo (Next.js, Express, Prisma).
- Establish Tailwind design system & UI library.
- Configure standardized error handling and ESLint/Prettier baseline.

### Prompt 2: Enterprise Authentication & RBAC
- Build secure stateless/stateful authentication mechanism (JWT & HTTP-Only cookies).
- Implement multi-tier Role-Based Access Control (`SUPER_ADMIN`, `ADMIN`, `CRM_MANAGER`, `SALES`, `SUPPORT`, `ENGINEER`, `CUSTOMER`).
- Integrate comprehensive `AuditLog` tracking.

### Prompt 3: Customer-Facing Website & Lead Generation
- Build data-driven marketing frontend in Next.js App Router.
- Develop lead capture flows (Quick Quote, Repair Request, Business Consultation).
- Implement concurrency-safe Lead reference generator (`Sequence` model).
- Abstract Analytics tracking.

### Pre-Prompt 4: Quality Gate & Documentation
- Lock architecture.
- Document modules, API, database, and system architecture.
- Perform security and performance reviews.

## 🚧 Upcoming

### Prompt 4: CRM Pipeline & Operations
- Build Ticket management and repair workflow states.
- Implement technician assignment and SLA tracking.
- Develop internal tech portal for engineers.

### Prompt 5: Inventory & Parts Management
- Supplier tracking and inventory cataloging.
- Low-stock alerts and purchase order generation.
- Serial number and warranty tracking.

### Prompt 6: Customer Portal & Invoicing
- Develop self-service customer portal.
- Implement ticketing history and real-time repair tracking.
- Integrate billing, invoicing, and payment gateways.

### Prompt 7: Global Admin & Reporting
- Build global super admin dashboard.
- Develop advanced data analytics and performance reporting.
- Final production readiness (CI/CD pipeline, Dockerization, logging aggregation).
