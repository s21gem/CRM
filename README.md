<div align="center">
  <img src="public/logo.png" alt="FoneBox Logo" width="200" />
  <h1>FoneBox Enterprise ICT Solutions Platform</h1>
  <p><strong>A highly secure, state-level cryptographic operations and enterprise management ecosystem.</strong></p>
</div>

---

## 🌟 Total Project Overview

The **FoneBox Enterprise ICT Solutions Platform** is a world-class, enterprise-grade Information and Communication Technology (ICT) platform. Engineered from the ground up to support national-level infrastructure, border control operations, and international fintech institutions.

This repository contains the full monorepo source code for both the frontend client portals and the backend REST API, utilizing a strict **Role-Based Access Control (RBAC)** model.

---

## 🏗️ System Architecture

The system is built on a modern, robust, and horizontally scalable architecture.

```mermaid
graph TD
    Client[Web Client - React/Vite] -->|HTTPS/REST| Gateway(API Gateway/Rate Limiter)
    Client -->|WSS| SocketIO(Socket.io Real-time Bus)
    
    Gateway --> Auth[Auth Middleware]
    Auth --> Cache[(Redis Cache)]
    
    Cache -- Cache Miss --> API[Express.js Node Server]
    API --> Controller[Domain Controllers]
    
    Controller --> Prisma[Prisma ORM]
    Prisma --> DB[(PostgreSQL Database)]
    
    SocketIO --> API
```

### Key Design Decisions
1. **Frontend:** React 19 + TypeScript + Vite. Optimized with `vite-plugin-image-optimizer` and `brotliCompress` for sub-second delivery. UI is heavily stylized using Tailwind CSS 4.x and Framer Motion.
2. **Backend:** Express.js running on Node.js. Compiled to pure JavaScript via `tsc` in production for minimal memory footprint and fast startup times.
3. **Security:** JWT authentication via strict `HttpOnly`, `Secure`, `SameSite=strict` cookies. Bcrypt for password hashing. Rate limiting and Helmet.js for API hardening.
4. **Caching:** Redis is used for high-speed read operations on CMS routes (`/api/cms`) and websocket state management.
5. **Database:** PostgreSQL accessed via Prisma ORM for type-safe database queries and migrations.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- Redis (Optional, falls back to memory cache)
- npm or yarn

### Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/fonebox_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
REDIS_URL="redis://localhost:6379"
FRONTEND_URL="http://localhost:3000"
```

### Installation
```bash
# Install all dependencies (Frontend & Backend)
npm install

# Generate Prisma Client
npx prisma generate

# Push DB schema and seed data
npx prisma db push
```

### Running Locally
```bash
# Start both frontend (Vite) and backend (tsx) concurrently
npm run dev
```

---

## 🧪 Testing & Code Quality

This repository adheres to strict engineering standards.

```bash
# Run unit tests (Vitest + React Testing Library)
npm run test

# Run code linting (ESLint)
npm run lint

# Format code (Prettier)
npm run format
```
*Note: Pre-commit hooks via Husky and lint-staged ensure that only passing code is committed.*

---

## 📦 Deployment (Production)

The application is fully containerized for deployment via Docker or Kubernetes.

### Docker Setup
```bash
# Build the production image
docker build -t fonebox-enterprise:latest .

# Run the container
docker run -p 5000:5000 --env-file .env fonebox-enterprise:latest
```

### CI/CD Pipeline
Continuous Integration is configured via GitHub Actions (`.github/workflows/deploy.yml`).
- **Triggers:** Push or Pull Request to `main`.
- **Pipeline:** Installs dependencies -> Generates Prisma Client -> Builds Frontend -> Runs ESLint -> Runs Vitest.

---

## 🗺️ Technical Roadmap & Future Enhancements

As part of our commitment to continuous architectural improvement, the following enhancements are prioritized:

1. **E2E Testing:** Implementation of Playwright for end-to-end integration testing across all 5 portals.
2. **Kubernetes Orchestration:** Migration from PM2 clustering to full K8s deployment with readiness/liveness probes.
3. **GraphQL Migration:** Transitioning complex nested analytical queries from REST to GraphQL for the SOC Dashboard.
4. **Zero-Trust Network:** Implementing Mutual TLS (mTLS) between the Node.js backend and the PostgreSQL database.

---
*Property of FoneBox Global Intelligence. Unauthorized access to the secure portals is strictly prohibited and logged.*
