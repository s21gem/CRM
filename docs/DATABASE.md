# Database Documentation

This document maps the physical tables created in the PostgreSQL database via Prisma.

## 1. User
- **Purpose**: Stores authenticated users of the system (staff and customers).
- **Relationships**: 
  - 1-to-Many with `Session`
  - 1-to-Many with `AuditLog`
  - Many-to-Many with `Role`
- **Indexes**: `email` (Unique).
- **Future Expansion**: Add relationships to `Ticket`, `Department`.

## 2. Role & Permission
- **Purpose**: Implements RBAC. Roles are assigned to Users, Permissions are assigned to Roles.
- **Relationships**: 
  - Many-to-Many: `User` <-> `Role`
  - Many-to-Many: `Role` <-> `Permission`
- **Enums/Static Data**: Seeds include `SUPER_ADMIN`, `ADMIN`, `CRM_MANAGER`, `SALES`, `SUPPORT`, `ENGINEER`, `CUSTOMER`.

## 3. Session
- **Purpose**: Tracks active user sessions for stateful authentication and revocation.
- **Fields**: Includes tracking metadata (`ipAddress`, `userAgent`, `deviceInfo`).
- **Indexes**: `userId`.

## 4. AuditLog
- **Purpose**: Append-only security tracking.
- **Fields**: Tracks `action` (e.g., `LOGIN_SUCCESS`, `UNAUTHORIZED_ACCESS`), `entityId`, `metadata`.
- **Indexes**: `userId`, `action`.

## 5. Lead
- **Purpose**: Stores incoming sales and support requests from the public website.
- **Relationships**: N/A initially. Will map to `User` and `Ticket` upon conversion.
- **Indexes**: `reference` (Unique).
- **Enums**: `LeadType`, `LeadStatus`, `LeadSource`, `LeadPriority`, `InquiryCategory`.

## 6. Sequence
- **Purpose**: Concurrency-safe counter for generating human-readable reference IDs.
- **Fields**: `name` (e.g., `LEAD_REF_2026`), `value` (integer counter).
- **Indexes**: `name` (Unique).
