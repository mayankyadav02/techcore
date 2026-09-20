# Authentication & RBAC

## Concepts
- **Authentication**: Verifying *who* the user is (Login, Sessions).
- **Authorization**: Verifying *what* the user is allowed to do.
- **RBAC (Role-Based Access Control)**: Assigning users to Roles.
- **Permissions**: The granular actions a Role is allowed to perform.

## Authentication Architecture
TechCore uses a custom, secure session-based authentication system. NextAuth/Auth.js is NOT used.
- **Session Cookie**: `tc-session` (HTTP-only, Secure).
- **Login Flow**: Credentials submitted -> Validated against bcrypt hash in `User` model -> Secure string generated -> `Session` document created in MongoDB -> Cookie set on response.
- **Logout Flow**: `Session` document deleted -> Cookie cleared.
- **Password Reset & Lockout**: Implemented via `PasswordReset` and `Lockout` models for security against brute force.

## RBAC & Permissions
Defined in `lib/rbac.ts`.

### Roles
1. `super_admin`: Has all permissions.
2. `admin`: Has most permissions, excluding sensitive user management/audit logs.
3. `editor`: Can manage content and site settings.
4. `viewer`: Read-only access to dashboard, content, and testimonials.

### Permissions
Permissions are granular strings, e.g., `content:write`, `users:delete`, `settings:read`.

### Role -> Permission Mapping
The `rolePermissions` object in `lib/rbac.ts` explicitly maps Roles to an array of Permissions. 
**IMPORTANT**: Code must check for Permissions, not Roles.

## Protecting Routes and Actions
Use the helpers in `lib/auth.ts`:

- `requireUser()`: Ensures user is authenticated.
- `requireAdminPage()`: Ensures authentication, redirects to login if unauthenticated.
- `requirePermission(permission)`: Ensures user has a specific permission. Throws `AppError("FORBIDDEN")` if unauthorized.
- `requireAnyPermission(permissions[])`: Ensures user has at least one of the listed permissions.
- `requirePagePermission(permission)`: Used in Server Components for page rendering. Calls `forbidden()` if unauthorized.
