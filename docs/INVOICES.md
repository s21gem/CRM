# Billing & Invoice Management System

## Overview
The Invoices module handles the financial realization of Repair workflows in the FoneBox Enterprise CRM. It acts as the immutable billing ledger.

## Core Principles
1. **Separation of Concerns**: Invoices exist separately from Payments. An invoice strictly represents a billed state and outstanding balance.
2. **Immutability**: Once an Invoice is `ISSUED`, all constituent items, prices, quantities, and totals are frozen. Any historical discrepancies must be rectified via voiding or credit notes.
3. **Snapshots**: Invoice items linked to inventory or labor copy over metadata (e.g., part numbers, item names, units) at the time of invoicing to prevent future data corruption if inventory names change.

## State Machine
The invoice lifecycle strictly follows this transition path enforced by the Service layer:
- `DRAFT`: Initial state. `refreshParts()` can be called to re-sync consumed parts.
- `PENDING_REVIEW`: Awaiting managerial approval. Editable.
- `APPROVED`: Locked for edits. Awaiting issuance to the customer.
- `ISSUED`: Delivered to the customer. Completely immutable.
- `PARTIALLY_PAID` / `PAID`: Handled automatically based on incoming Payment transactions (Prompt 9).
- `VOID`: Only permitted if no payments have been applied.

## Integrations
### Inventory & Repairs
When `createDraft` is invoked for a `RepairOrder`:
- The system reads all `InventoryReservation` records with a status of `CONSUMED`.
- It copies these over as `InvoiceItem` entries (`sourceType: INVENTORY`).
- `refreshParts()` acts as a sync command for technicians to pull newly consumed parts onto an active draft.

## Extensibility
- **Taxes & Discounts**: Every `InvoiceItem` contains `taxAmount` and `discountAmount` attributes. Currently defaulted to zero, they form the basis for future promotional logic.
- **PDF Generation**: The `generatePdf` abstraction exists in `invoices.service.ts` for future printable exports.
