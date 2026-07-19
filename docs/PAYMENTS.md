# Payment Processing & Receivables System

## Overview
The Payment Processing & Receivables module manages incoming funds, applies them to customer invoices, and generates immutable receipts. It forms the foundation for accounts receivable in FoneBox Enterprise CRM.

## Architecture & Financial Immutability

### 1. Payment Lifecycle
Payments strictly follow a state machine:
- **PENDING**: Payment is recorded but not yet confirmed. Cannot be allocated.
- **CONFIRMED**: Payment has cleared or been confirmed by staff. Funds become available for allocation to invoices.
- **FAILED**: Payment failed (e.g. card declined). Terminal state.
- **CANCELLED**: Payment was cancelled before confirmation. Terminal state.
- **REFUNDED**: A confirmed payment that has been returned to the customer. Terminal state.

### 2. Allocation Policy
- **Immutability**: `PaymentAllocation` records are **immutable**. Once an allocation is made to an invoice, it cannot be edited or deleted.
- **Source of Truth**: The `PaymentAllocation` table is the definitive record of how funds were applied. The `Invoice.paidAmount` and `Invoice.balanceDue` are derived from these allocations.
- **Partial Payments**: A single payment can be allocated across multiple invoices. An invoice can be paid through multiple payments over time.

### 3. Immutable Receipts
When a receipt is generated from a confirmed payment, it acts as a historical snapshot.
- The `PaymentReceipt` model stores snapshots of critical information (customer name, invoice numbers, amounts, method) at the exact moment of generation.
- Receipts do NOT rely on live relations for display. Even if the customer's name changes later, the receipt preserves the original name.

### 4. Refund Strategy
Refunds are treated as **independent financial events**. 
- A refund does not overwrite history or delete allocations. 
- Refunding a payment updates its status to `REFUNDED` and generates an audit trail. 
- (Future Feature: Reversal of allocations during a refund will generate a negative adjustment allocation or Credit Note).

### 5. Atomic Transactions
Every financial operation (Receive, Confirm, Allocate, Refund, Receipt Generation) is strictly wrapped in a Prisma `$transaction`. Each operation also generates:
1. `PaymentActivity` entry (business audit log)
2. `PaymentStatusHistory` (if status changes)
3. `AuditLog` entry (system compliance)

## Sequences
- **Payments** use prefix: `FBXP-XXXXXX`
- **Receipts** use prefix: `FBXR-XXXXXX`
