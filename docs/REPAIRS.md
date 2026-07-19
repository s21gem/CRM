# Repair Operations Management System

## Overview
The Repair Operations Management System bridges physical devices (Customer domain) with technician-driven workflows. It's a complete end-to-end module tracking everything from device intake to quality check and final delivery.

## Key Models
- **RepairOrder**: The core business record, denoted by `FBXR-XXXXXX`. Holds cost, complaint, condition, and status.
- **Diagnosis**: 1:1 mapping with RepairOrder for technical findings (root cause, repairability, parts needed).
- **RepairChecklistItem**: Configurable individual tasks attached to a repair.
- **RepairActivity**: A granular log of every single action taken on the repair (e.g. status changes, diagnosis updates).
- **RepairStatusHistory**: Specifically tracks the time spent in each operational status.

## Status Workflow
A repair moves through these states:
`NEW` -> `INSPECTING` -> `DIAGNOSING` -> `WAITING_APPROVAL` -> `APPROVED` -> `WAITING_PARTS` -> `IN_REPAIR` -> `ON_HOLD` -> `QUALITY_CHECK` -> `READY_FOR_PICKUP` -> `DELIVERED` -> `CLOSED`

*Transitions are enforced server-side. Skipping mandatory states or reverting to an invalid past state will throw an error.*

## Financial Tracking
Each repair explicitly tracks:
- `estimatedCost`: Pre-approval estimate.
- `approvedCost`: What the customer agreed to.
- `partsCost`: Internal cost (COGS).
- `finalCost`: The actual amount invoiced (reserved for Prompt 7 - Invoices).

## Roles and Access
- **Technicians**: Can view their assigned repairs, update diagnosis, and transition status.
- **Support**: Can initiate new repairs and answer customer inquiries.
- **CRM Managers**: Full oversight of the repair dashboard.
