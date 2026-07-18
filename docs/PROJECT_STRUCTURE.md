# Project Structure

The FoneBox Enterprise CRM is organized as a scalable monorepo using npm workspaces.

```mermaid
graph TD
    Root[fonebox-enterprise-crm]
    Apps[apps]
    Packages[packages]
    Prisma[prisma]
    Docs[docs]

    Root --> Apps
    Root --> Packages
    Root --> Prisma
    Root --> Docs

    Apps --> Web[web: Next.js 15]
    Apps --> API[api: Express.js]

    Packages --> UI[@fonebox/ui]
    Packages --> Types[@fonebox/types]
    Packages --> Utils[@fonebox/utils]
    Packages --> Config[@fonebox/config]
```

## Directory Details

### `/apps/web`
The frontend application built with Next.js App Router.
- `src/app`: Page components and routing skeletons.
- `src/components`: Reusable UI components.
  - `ui/`: shadcn/ui components.
  - `layout/`: Navbar, Sidebar, AppLayout.
  - `guards/`: Route access guards.
- `src/contexts`: React contexts (e.g., AuthContext).

### `/apps/api`
The backend Express application.
- `src/controllers`: Request handlers.
- `src/services`: Business logic.
- `src/repositories`: Data access layer (Prisma calls).
- `src/middlewares`: Express middlewares (auth, errors).
- `src/routes`: API endpoint definitions.

### `/packages/*`
Shared internal libraries.
- `@fonebox/types`: Shared TypeScript interfaces and enums.
- `@fonebox/ui`: Shared React components (if decoupled from Next.js).
- `@fonebox/utils`: Shared helper functions.
- `@fonebox/config`: Shared configurations.

### `/prisma`
Database configuration.
- `schema.prisma`: The single source of truth for the database schema.
