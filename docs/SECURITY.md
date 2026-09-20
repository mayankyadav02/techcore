# Security Architecture

## Session Security
- Authentication relies on HTTP-only, Secure cookies holding a cryptographically secure session string. 
- NextAuth is not used; sessions are tracked explicitly in the database (`Session` model).

## RBAC & Permission Checks
- Authorization is strictly enforced in Server Actions and protected API routes using `requirePermission(permission)`. 
- Access is determined by specific capability strings (e.g., `content:write`), not just the user's role name.

## Input Validation (Zod)
- All incoming data in Server Actions and API routes is rigorously validated using Zod schemas. This ensures type safety and prevents malformed data injection.

## Rate Limiting
- **Mechanism**: Distributed, persistent rate limiting using MongoDB (`RateLimit` model and `lib/rate-limit.ts`).
- **Why MongoDB?**: Ensures rate limits apply across multiple serverless function invocations (e.g., on Vercel), preventing abuse that in-memory limiters would miss.
- **Protected Areas**: Login, Password Reset, and all public forms (Contact, Quote, Job Application).

## Spam Protection (Honeypot)
- Public forms include a silent honeypot field. Submissions caught by the honeypot are flagged (`honeypotCaught: true` in the `Enquiry` model) or silently rejected to deter automated spam.

## GDPR Consent
- Forms collecting PII (Applications, Enquiries) include explicit `gdprConsent` tracking.

## Headers & CSP
Configured centrally in `next.config.ts`:
- **Content-Security-Policy (CSP)**: Restricts script and resource origins.
- **Strict-Transport-Security (HSTS)**: Enforces HTTPS.
- **X-Frame-Options**: `DENY` to prevent clickjacking.
- **Permissions-Policy**: Restricts camera, microphone, and geolocation.

## Private Data Access (Applicant Resumes)
- **Implementation**: Applicant resumes containing PII are uploaded to Vercel Blob with `access: "private"`. Unauthenticated access to the raw Blob URL is denied by the storage provider.
- **Controlled Retrieval**: Resumes are retrieved via a server-side authenticated proxy (`app/api/admin/applications/[id]/resume/route.ts`).
- **Authorization Boundary**: The proxy explicitly verifies the `leads:read` permission before fetching the private blob and streaming it to the client. 

## Audit Logging
- Admin mutating actions (Creates, Updates, Deletes) are recorded in the `AuditLog` collection, providing an immutable history of system changes.
