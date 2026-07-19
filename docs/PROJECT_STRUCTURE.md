# Project Structure

The repository is built as a Turborepo Monorepo to ensure seamless code sharing and independent deployment pipelines.

## Root Directory
- `/apps`: Contains executable applications.
- `/packages`: Contains shared configuration (`@fonebox/config`, `@fonebox/utils`, `@fonebox/types`).
- `/docs`: Contains all architectural and engineering guidelines.
- `/prisma`: Contains the shared Database Schema and migration history.

## Frontend (`apps/web`)
- `src/app`: Next.js App Router root.
  - `(public)`: Marketing website routes (`/about`, `/contact`, `/pricing`, etc.).
  - `(auth)`: Application routes (Login, Dashboard, CRM).
- `src/components/ui`: Highly reusable Tailwind primitives (Button, Input, Cards).
- `src/content`: Data-driven constants for marketing text (Services, FAQs).
- `src/lib`: Frontend utilities, including the `Analytics` abstract layer.

## Backend (`apps/api`)
- `src/config`: Environment and static configurations.
- `src/middlewares`: Global and route-specific logic (Error Handler, `authorize`, `validate`).
- `src/modules`: Domain-driven feature clusters (e.g. `auth/`, `leads/`). Each contains:
  - `*.controller.ts`: Handles request/response mapping.
  - `*.service.ts`: Handles core business logic.
- `src/routes/v1`: Route definitions mapping HTTP methods to Controllers.
- `src/scripts`: Database seeders (`seed-roles`, `seed-users`).
- `src/utils`: Helpers like API Response formatters.
