# FoneBox Enterprise CRM

A comprehensive Enterprise Client Management Platform for FoneBox.

## Domains & Modules

1. **Auth & RBAC**: Advanced role-based access control with layered middleware (Admin, CRM_MANAGER, SALES, SUPPORT, ENGINEER).
2. **CRM (Leads)**: Sales pipeline and Service queue processing. Captures activities and notes.
3. **Customers & Devices**: 360-degree customer workspace mapping individuals/businesses to physical devices. Includes Timeline tracking for history.

## Environment Variables

To run the project locally, you must configure your environment variables. 
Copy the provided `.env.example` file to `.env` in the root directory:

```bash
cp .env.example .env
```
Ensure you update the `DATABASE_URL` with your actual local database connection string, otherwise Prisma Client generation and database migrations will fail.

## Development

```bash
npm run dev
npm run build
```
