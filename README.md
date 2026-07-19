# FoneBox Enterprise CRM & Operations Platform

A comprehensive Enterprise Operations and Client Management Platform. FoneBox delivers trusted ICT solutions for governments and corporations, specializing in secure identity, fintech systems, and cybersecurity integration worldwide.

## 🗂️ Repository Structure

This project is built as a scalable NPM workspaces monorepo:

```text
FoneBoxUSA/
├── apps/
│   ├── api/            # Express.js REST API Backend
│   └── web/            # Next.js 15 Frontend (App Router)
├── packages/
│   ├── config/         # Shared ESLint, TS configs
│   ├── types/          # Shared TypeScript definitions
│   └── utils/          # Shared utility functions
├── prisma/             # Database Schema & Migrations
│   └── schema.prisma
├── docs/               # Architecture, Status, & Assessment Guides
├── package.json        # Root workspace configuration
└── README.md
```

## 🛠️ Technology Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Shadcn UI (`lucide-react`, `@dnd-kit/core`).
- **Backend:** Express.js, Node.js (v20+), TypeScript 5.
- **Database:** PostgreSQL (managed via Prisma ORM).
- **Security:** JWT (Access & Refresh), Bcrypt, Helmet, CORS.
- **DevOps:** Docker (optional), NPM Workspaces.

## 🧩 Feature Summary by Business Domain

| Domain | Implemented Features |
| :--- | :--- |
| **Sales & Marketing** | Public Marketing site, Automated Quick Quote Lead generation. |
| **CRM Pipeline** | Kanban-style Sales tracking (New Inquiry -> Contract), Lead Conversion. |
| **Client Management** | 360-degree Client Workspaces, System tracking, Timeline History. |
| **Project Operations** | Operations Queue, Technician assignment, Implementation Checklists. |
| **Supply Chain** | Double-Entry Inventory Ledger, Strict Stock Reservations, Adjustments. |
| **Financial Billing** | Draft to Issued Invoice workflow, Immutable Line Item Snapshots. |
| **Payment & Receivables**| Secure Payment intent processing, Allocation to Invoices, Receipts. |
| **Platform Security** | Tiered RBAC (Admin, Sales, Engineer), System-wide Audit Logging. |

## 🚀 Installation & Setup

1. **Clone the Repository**
```bash
git clone https://github.com/your-org/FoneBoxUSA.git
cd FoneBoxUSA
```

2. **Install Dependencies**
Install all packages across the monorepo from the root directory:
```bash
npm install
```

3. **Environment Configuration**
Copy the example environment file:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL` is configured correctly to point to your PostgreSQL instance.

4. **Database Preparation**
Generate the Prisma Client and push the schema:
```bash
npx prisma generate
npx prisma db push
```

## 🛡️ Root-Level Verification (Quality Gate)

To ensure the monorepo is in a healthy, production-ready state, run the following verification commands from the root directory:

```bash
# Verify Database Schema
npx prisma validate

# Linting & Typechecking
npm run lint --workspace=web
npm run typecheck --workspace=web

# Production Build
npm run build --workspace=web
```

## 🏃 Running the Application

**Development Mode**
```bash
npm run dev --workspace=web
npm run dev --workspace=api
```

**Production Mode**
```bash
npm run start --workspace=web
npm run start --workspace=api
```

## 📚 Documentation
For an in-depth understanding of the architecture and assessment details, refer to the documents in the `/docs` directory, starting with `ASSESSMENT_MAPPING.md`.
