# FoneBox Enterprise CRM: Demonstration Guide

This guide provides a structured, end-to-end walkthrough of the FoneBox Enterprise CRM platform, highlighting the core architectural capabilities across all business domains.

## Demo Credentials

You can log in to the application using the following seed accounts. These accounts demonstrate the Role-Based Access Control (RBAC) boundaries of the platform.

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@fonebox.us` | `Password123!` | Full system access, User Management, Finance. |
| **Sales Manager** | `sales@fonebox.us` | `Password123!` | CRM, Leads, Customer Workspaces, Quotations. |
| **Engineer / Support** | `engineer@fonebox.us` | `Password123!` | Operations Queue, Project Workspaces, Inventory consumption. |

---

## End-to-End Business Scenario Walkthrough

This scenario follows the complete lifecycle of an enterprise implementation, demonstrating how data flows immutably from marketing through to final financial reconciliation.

### Step 1: Lead Capture (Marketing Website)
1. Open the public marketing website (`/`).
2. Navigate to the **Solutions** page to view the enterprise offerings.
3. Click **Contact Sales** and fill out the Quick Quote form.
   * *Architecture Note:* This submits to a public, rate-limited endpoint that generates a concurrency-safe Lead Reference Number.

### Step 2: CRM Qualification (Sales Pipeline)
1. Log in as `sales@fonebox.us`.
2. Navigate to **CRM & Sales -> Sales Pipeline** (`/crm/sales`).
3. Locate the newly generated Lead in the **New Inquiry** column.
4. Drag and drop the Lead to the **Proposal** column.
5. Click on the Lead to open the detail slide-over. Convert the Lead into a **Client**.
   * *Architecture Note:* The conversion is handled in an atomic Prisma transaction, generating a Customer profile and logging the activity.

### Step 3: Project Operations (Engineering)
1. Log out, and log back in as `engineer@fonebox.us`.
2. Navigate to **Operations -> Operations Queue** (`/crm/service`) or **Projects** (`/crm/repairs`).
3. Open a specific Project workspace (created from the Client conversion).
4. Assign the project to yourself.
5. Progress the Project status to **Implementation**.
6. Switch to the **Parts/Inventory** tab within the workspace and allocate an inventory item to the project.
   * *Architecture Note:* This creates a strict `InventoryReservation`. `currentStock` remains the same, but computed `availableStock` decreases.

### Step 4: Billing & Invoicing (Finance)
1. Log out, and log back in as `admin@fonebox.us`.
2. Navigate to **Projects** and open the project from Step 3.
3. Go to the **Billing** tab and generate a Draft Invoice based on the consumed inventory and labor.
4. Navigate to **Finance -> Invoices** (`/crm/invoices`) and open the drafted invoice.
5. Review the line items and click **Issue Invoice**.
   * *Architecture Note:* Issuing an invoice creates an **Immutable Snapshot** of the line items. The invoice will never change even if the original inventory item's price is updated in the database.

### Step 5: Payment Processing & Allocation (Receivables)
1. While logged in as `admin@fonebox.us`, navigate to **Finance -> Payments** (`/crm/payments`).
2. Click **Record Payment** and log a received Wire Transfer.
3. Open the created Payment record and navigate to the **Allocations** tab.
4. Allocate the payment amount to the outstanding invoice created in Step 4.
5. Click **Confirm Allocations**.
   * *Architecture Note:* This generates a permanent `PaymentAllocation` ledger entry and automatically reduces the outstanding balance of the target invoice.

---

## Reviewing Audit Logs
Throughout this entire lifecycle, the system has tracked every mutation.
- Navigate to **Administration -> Audit Logs** (or view the Timeline tab on the Client/Project workspace) to observe the immutable history of state changes, user interactions, and financial transactions.
