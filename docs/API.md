# API Documentation

This document covers all endpoints implemented in the FoneBox Enterprise CRM backend API.

---

## Authentication Endpoints

### 1. Login
- **Method**: `POST`
- **Route**: `/api/v1/auth/login`
- **Purpose**: Authenticate user and issue secure HTTP-only cookies and JWT.
- **Authentication Required**: No
- **Request Schema**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response Schema** (200 OK):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "roles": ["ADMIN"]
      },
      "token": "jwt-token-string"
    }
  }
  ```
- **Error Responses**: 401 Unauthorized (Invalid credentials).

### 2. Validate Session
- **Method**: `GET`
- **Route**: `/api/v1/auth/me`
- **Purpose**: Returns the currently authenticated user based on JWT in cookies.
- **Authentication Required**: Yes
- **Response Schema** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "email": "user@example.com",
      "roles": ["ADMIN"]
    }
  }
  ```
- **Error Responses**: 401 Unauthorized (Token missing or invalid).

### 3. Logout
- **Method**: `POST`
- **Route**: `/api/v1/auth/logout`
- **Purpose**: Clear session cookies.
- **Authentication Required**: Yes
- **Response Schema** (200 OK):
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

## Lead Endpoints

### 1. Capture Quote / Inquiry / Repair / Business
- **Method**: `POST`
- **Route**: `/api/v1/leads/:type` (e.g. `/api/v1/leads/quote`)
- **Purpose**: Capture lead data from the marketing frontend. Automatically generates a unique reference ID.
- **Authentication Required**: No
- **Request Schema**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+15550000000",
    "message": "Need fleet repair.",
    "company": "Acme Corp",
    "source": "WEBSITE",
    "consentAccepted": true
  }
  ```
- **Response Schema** (201 Created):
  ```json
  {
    "success": true,
    "message": "Lead captured successfully",
    "data": {
      "id": "uuid",
      "reference": "FBX-2026-000001",
      "status": "NEW"
    }
  }
  ```
- **Error Responses**: 400 Bad Request (Validation failed).
