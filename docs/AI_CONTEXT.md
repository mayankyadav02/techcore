# TechCore AI Context

**ATTENTION AI AGENTS**: Read this document first to understand the architecture, boundaries, and rules of the TechCore project before generating or modifying code.

## Project Identity
TechCore is a full-stack Next.js 16 application with a public marketing site and a secure admin CMS. 

## What TechCore Currently Is
It is a **SINGLE-TENANT** platform. Multi-tenancy, SaaS functionality, and billing are NOT currently implemented. Do NOT design features assuming multi-tenant boundaries.

## Current Architecture
TechCore uses the Next.js App Router (`app/`). It separates public pages (`app/(public)`) from the admin interface (`app/(admin)`). Business logic, database models, and server actions are grouped by domain in the `modules/` directory. Core shared utilities are in `lib/`.

## Technology Stack
- Next.js 16.3.1 (App Router), React 19.2.8, TypeScript 5.x, Tailwind CSS 4.x
- MongoDB (Mongoose 9.9.2)
- Vercel Blob (Storage), Resend (Emails)
- Zod (Validation), native Node.js testing.

## Repository Structure
- `app/`: Next.js routing (public, admin, API).
- `components/`: React UI components.
- `modules/`: Domain logic (models, services, actions).
- `lib/`: Shared utilities (auth, DB, rate limiting).
- `tests/`: Integration and unit tests.

## Major Domains
Identity, Catalog, Content, Insights, Careers, Leads, Media, Notifications, Search, Shared, Work.

## Public Website
Dynamic pages for Services, Solutions, Industries, Projects, Blog, Careers, and Forms (Contact, Quote). Configured dynamically via a global settings model.

## Admin CMS
Secure portal for managing all public content, job applications, user accounts, and global site settings.

## Authentication
Custom session-based authentication via secure cookies. NextAuth is NOT used. Handled in `lib/auth.ts`.

## Session Management
Sessions are stored in MongoDB (`Session` model) and linked via the `SESSION_COOKIE` (`tc-session`).

## RBAC
Role-Based Access Control is enforced. Roles: `super_admin`, `admin`, `editor`, `viewer`. 

## Permission System
String-based granular permissions (e.g., `content:write`). Mapped in `lib/rbac.ts`. Always authorize via permissions, not just roles.

## Database Models
Mongoose models live in `modules/**/[name].model.ts`. 

## API Routes
Minimal usage. Used primarily for webhooks or specific client-side submissions (e.g., job applications at `app/api/jobs/[id]/apply/route.ts`).

## Server Actions
Primary method for data mutation. Found in `modules/**/actions.ts`. Must include auth/permission checks and Zod validation.

## Search
MongoDB `$text` search spanning multiple models. Logic in `modules/search/public.service.ts`.

## Media
Vercel Blob integration wrapper in `modules/media/blob.ts`. Used for images and documents.

## Private Resume Storage
Resumes uploaded via job applications are stored in Vercel Blob and linked via `resumeAssetId`. 

## Email / Resend
Centralized in `modules/notifications/email.service.ts`. Handles concurrent admin and customer emails with retry logic.

## Enquiry Management
Centralized `Enquiry` model handling Contact and Quote requests. Includes silent honeypot spam protection.

## Careers / Applications
Careers page lists `Job`s. Submissions create `Application`s with required GDPR consent.

## SEO
Managed via standard Next.js Metadata API and a dedicated `PageSeo` model. OpenGraph image generation is implemented.

## Performance / Caching
Utilizes Next.js ISR via `revalidateTag` and `revalidatePath` in `lib/cache-tags.ts`. 

## Security
- Zod validation for all inputs.
- Distributed MongoDB rate limiting (`lib/rate-limit.ts`).
- Secure headers and CSP in `next.config.ts`.
- Silent honeypots on public forms.

## Testing
Uses Node.js native test runner (`tsx --test`). Do not break existing tests. Run `npm run test` to verify changes.

## Environment Variables
Listed in `.env.example`. Includes MongoDB URI, Auth Secret, Resend Key, and App URL.

## Deployment
Optimized for Vercel. 

## White-Label Architecture
Settings (Company Name, Logo, Colors, Theme) are dynamically served from a single `Settings` document (key: "global"). `--brand` CSS variables are injected in `app/layout.tsx`.

## Current Limitations
No multi-tenancy. No built-in payment processing.

## Future Roadmap
Potential future multi-tenancy, but must not be implemented in current tickets unless explicitly requested.

## Important Rules For AI Agents
- Read existing implementation before changing architecture.
- Reuse existing services and utilities (`lib/auth.ts`, `lib/db.ts`).
- Do not duplicate authentication logic.
- Do not bypass RBAC. Use `requirePermission()` or `requireAnyPermission()`.
- Do not expose private resume blobs to public unauthenticated routes.
- Do not bypass Zod validation.
- Do not introduce tenant assumptions. TechCore is single-tenant.
- Do not assume SaaS functionality.
- Do not change global settings architecture without understanding current single-tenant design.
- Preserve existing security headers in `next.config.ts`.
- Preserve rate limiting on forms and auth endpoints.
- Preserve audit logging where applicable.
- Follow existing module boundaries (`modules/[domain]/`).
- Run appropriate tests after changes.
