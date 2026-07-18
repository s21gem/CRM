# FoneBox Enterprise CRM
Enterprise Client Management Platform for Customer Operations, CRM, Internal Workforce and Administration.

## Overview
This repository contains the monorepo foundation for the FoneBox Enterprise CRM. Built with scalable and modular enterprise standards.

## Features Roadmap
- [ ] Authentication & RBAC (Prompt 2)
- [ ] CRM Dashboard & Analytics (Prompt 3)
- [ ] Customer Management & Portal (Prompt 4)
- [ ] Internal Operations & Settings (Prompt 5)

## Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS v4, shadcn/ui, Framer Motion
- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Monorepo:** npm workspaces, TurboRepo (prepared)
- **DevOps:** Docker, Docker Compose, Husky, ESLint, Prettier

## Folder Structure
Refer to [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed architecture.

## Setup Instructions
1. Install dependencies: `npm install`
2. Start infrastructure: `docker-compose up -d`
3. Generate Prisma client: `npx prisma generate` (No migrations applied yet)
4. Start development servers: `npm run dev`

## Environment Variables
See `.env.example` in respective directories (`apps/api`, `apps/web`, `prisma`).

## Screenshots
_Screenshots will be added here once UI is fully populated._
