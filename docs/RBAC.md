# Role-Based Access Control (RBAC)

## Roles
The system defines several default hierarchical roles:
- `SUPER_ADMIN`
- `ADMIN`
- `CRM_MANAGER`
- `SALES`
- `SUPPORT`
- `ENGINEER`
- `CUSTOMER`

## Permissions
Permissions follow a `{action}:{resource}` format.
Example: `read:customer`, `update:crm`.

## Guards
The frontend utilizes reusable guards:
- `AuthGuard`: Redirects unauthenticated users to `/login`.
- `GuestGuard`: Redirects authenticated users away from `/login`.
- `RoleGuard`: Only renders components for specific roles.
- `PermissionGuard`: Only renders components if a specific permission exists.

```tsx
<RoleGuard roles={['ADMIN', 'SUPER_ADMIN']}>
  <AdminDashboard />
</RoleGuard>
```
