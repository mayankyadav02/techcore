# Environment Variables

TechCore relies on the following environment variables. **Never commit actual secret values to source control.**

## Core Configuration
- `NODE_ENV`: Standard environment indicator (`development`, `production`, `test`).
- `APP_URL`: The base public URL of the application. Required in production for canonical URLs, sitemaps, Open Graph, and CSRF checks. (e.g., `https://example.com`).

## Database
- `MONGODB_URI`: **Required**. The connection string for the MongoDB instance (e.g., `mongodb://127.0.0.1:27017/techcore`). Required in all environments.

## Authentication
- `AUTH_SECRET`: **Required**. A cryptographically secure random string (minimum 32 characters) used as a pepper for session hashing.

## Email (Resend)
- `RESEND_API_KEY`: API key for the Resend transactional email service. Required for emails to function.
- `EMAIL_FROM`: The verified sender address in Resend (e.g., `TechCore <noreply@yourdomain.com>`).
- `ADMIN_EMAIL`: The fallback administrator email address for system notifications (used if the CMS Settings model is not configured).

## Storage (Vercel Blob)
- `BLOB_READ_WRITE_TOKEN`: **Required**. The system token used natively by `@vercel/blob` to authenticate read/write operations against the Vercel Blob store.

## Internal Build Variables
- `NEXT_PHASE`: An internal variable used by Next.js during the build phase (e.g., `phase-production-build`). It is checked by `lib/env.ts` to bypass strict runtime environment checks during static generation. This is not a user-configured secret.

## Seeding (Development/Setup Only)
These are used exclusively by the `npm run seed:admin` script to bootstrap the initial super-admin account. They are not used at runtime.
- `ADMIN_PASSWORD`: The initial password for the seeded admin account.
- `ADMIN_NAME`: The name of the seeded admin account.
- `ADMIN_EMAIL`: The email of the seeded admin account.
