# Development Guide

## Prerequisites
- Node.js >= 20.x
- Docker & Docker Compose
- npm workspaces familiarity

## Scripts
Run these from the root directory:
- `npm run dev` - Starts all apps in dev mode.
- `npm run build` - Builds all apps and packages.
- `npm run lint` - Runs ESLint across workspaces.
- `npm run typecheck` - Validates TypeScript.

## Creating a new Package
1. Add a new folder in `/packages`.
2. Initialize `package.json` with `private: true` and name prefixed with `@fonebox/`.
3. Export functionality via `index.ts`.

## Adding a new API Route
1. Create a controller in `apps/api/src/controllers/`.
2. Map it in `apps/api/src/routes/v1/`.
3. Add any necessary business logic in `src/services/` and data access in `src/repositories/`.

## Environment Variables
Always use `Zod` validation for parsing environment variables (to be added in core setup). Never expose sensitive backend variables to the frontend.
