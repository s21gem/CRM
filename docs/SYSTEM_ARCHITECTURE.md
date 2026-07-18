# System Architecture

This document describes the high-level system architecture of the FoneBox Enterprise CRM.

## High-Level Request Flow

```mermaid
sequenceDiagram
    participant User as User (Browser)
    participant Web as Next.js Web App
    participant API as Express API
    participant DB as PostgreSQL DB

    User->>Web: Request page
    Web-->>User: Return React App
    User->>Web: Submit Form / Action
    Web->>API: HTTP Request (JWT Auth)
    API->>API: Validate Request & Auth
    API->>DB: Prisma Query
    DB-->>API: Data Result
    API-->>Web: JSON Response
    Web-->>User: Update UI
```

## Frontend Architecture
The frontend leverages the Next.js App Router for server-rendered efficiency with rich client-side interactivity where needed.
- **Routing:** Server components by default.
- **State Management:** React Context + Hooks.
- **Data Fetching:** TanStack Query (prepared).
- **Styling:** Tailwind CSS v4 + shadcn/ui.

## Backend Architecture
A layered architecture pattern ensuring separation of concerns.

```mermaid
graph TD
    Router[Express Router] --> Middleware[Auth/Validation Middleware]
    Middleware --> Controller[Controller]
    Controller --> Service[Service Layer]
    Service --> Repository[Repository Layer]
    Repository --> Prisma[Prisma ORM]
    Prisma --> DB[(PostgreSQL)]
```

## Authentication Flow
- JWT based authentication.
- API issues HTTP-Only secure cookies or returns tokens to be stored securely.
- Web app context manages the auth state and hydration across requests.
