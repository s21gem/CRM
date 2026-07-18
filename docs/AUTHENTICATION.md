# Authentication Architecture

## Overview
FoneBox Enterprise CRM uses a scalable stateless JWT architecture paired with stateful refresh tokens for enhanced enterprise security.

## Tokens
- **Access Token (JWT)**: Short-lived token (15 mins) identifying the user and their session. Sent via HttpOnly cookie or Authorization header.
- **Refresh Token (Opaque/JWT)**: Long-lived token (7 days). Stored as a hashed value in the database. Never exposed outside the HttpOnly cookie context in production.

## Flow
1. User provides credentials to `/api/v1/auth/login`.
2. Backend validates against `bcrypt` hash.
3. Backend issues an `accessToken` and `refreshToken`, logging a `LOGIN_SUCCESS` event.
4. Client uses the `accessToken` for subsequent requests.
5. When expired, client requests `/api/v1/auth/refresh` using the `refreshToken`.
6. Backend verifies the refresh token against the hashed token in the DB, rotates the token, and issues new ones.

## Session Revocation
Administrators or users can revoke sessions. The `Session` model tracks active sessions. If `isRevoked` is set to true, any incoming request with that session ID will be immediately rejected, even if the JWT hasn't expired.
