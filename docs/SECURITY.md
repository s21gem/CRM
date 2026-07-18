# Security Decisions & Audit Log

## Database Storage
- **Passwords**: Hashed with bcrypt (10 rounds).
- **Refresh Tokens**: Hashed with bcrypt before storage to prevent replay attacks if the database is compromised.
- **Access Tokens**: NEVER stored in the database. Validated purely cryptographically and via the `Session` revocation list.

## Audit Logs
All critical authentication events are stored in the `AuditLog` table using the `AuthEvent` enum:
- `LOGIN_SUCCESS`
- `LOGIN_FAILED`
- `LOGOUT`
- `TOKEN_REFRESH`
- `PASSWORD_CHANGED`
- `SESSION_REVOKED`
- `UNAUTHORIZED_ACCESS`

## Future Enterprise Roadmap
The architecture is configured to seamlessly integrate:
- **OAuth2 / SSO / SAML**: Extending the `login` controller to accept provider payloads.
- **MFA (Multi-Factor Authentication)**: Implementing an intermediate auth state `requires_mfa` on the session before full tokens are issued.
