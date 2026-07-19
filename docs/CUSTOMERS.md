# Customers & Devices Module

## Overview
The Customers & Devices module is the foundational domain of FoneBox. It bridges the initial lead acquisition phase into long-term retention and lifecycle management. It acts as the core registry mapping Customers to their physical hardware (Devices) and their comprehensive interaction history (Timeline).

## Core Models

### Customer
Represents either an Individual or a Business entity interacting with FoneBox.
- **Key Fields**: `customerNumber` (Auto-generated FBXC-XXXX), `type` (INDIVIDUAL/BUSINESS).
- **Relations**: `devices`, `leads` (historical), `activities` (timeline), `customerNotes`.

### Device
Represents physical hardware owned by a Customer.
- **Key Fields**: `deviceNumber` (Auto-generated FBXD-XXXX), `brand`, `model`, `category`, `imei`, `serialNumber`, `status`.
- **Relations**: `customer`.

### 360-Degree Timeline
The timeline aggregates events from multiple entities to provide a unified history:
- `LeadActivity`
- `CustomerActivity`

## Workflows

### Lead Conversion
Leads are converted to Customers atomically:
1. Matches existing customer by Email or Phone, OR creates a new Customer.
2. Generates sequential `FBXC-000001` ID.
3. Attaches Customer to Lead and marks Lead as `CONVERTED`.
4. Logs `CustomerActivity`, `LeadActivity`, and `AuditLog` inside a single Prisma `$transaction`.

### Device Registration
1. Devices are registered under a specific Customer.
2. Generates sequential `FBXD-000001` ID.
3. Automatically creates an `AuditLog` and a `CustomerActivity`.

## Future Expansion
The module is designed to seamlessly integrate with:
- **Repairs Module**: Links `RepairOrder` to `Device`.
- **Invoices Module**: Links `Invoice` to `Customer`.
