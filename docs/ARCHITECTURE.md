# Architecture

## Next.js App Router Architecture
TechCore leverages the Next.js 16 App Router. The application is logically separated into distinct Route Groups to isolate layouts, data fetching, and security boundaries.

### Route Groups
- `app/(public)`: Contains all public-facing marketing and content pages. Layout handles global theming and public navigation.
- `app/(admin)`: Contains the secure Administrative CMS. Layouts enforce authentication and provide the CMS shell.

### API Routes
API routes (`app/api/`) are used sparingly, primarily for external webhooks or complex multi-part form submissions (e.g., `app/api/jobs/[id]/apply/route.ts` handling file uploads alongside data).

### Server Actions
The primary method of data mutation (CRUD operations) within the Admin CMS is Server Actions. These are co-located in `modules/**/actions.ts` files, providing a seamless, type-safe RPC-like experience from Client Components to the Server.

## Modules & Domain-Driven Design
Business logic is decoupled from routing and UI, residing in the `modules/` directory. Each module (e.g., `identity`, `catalog`, `content`) encapsulates:
- `*.model.ts`: Mongoose schema definitions.
- `*.service.ts`: Core business logic, data access, and orchestration.
- `actions.ts`: Next.js Server Actions for UI mutation.

## Core Utilities (`lib/`)
Cross-cutting concerns are centralized:
- `auth.ts`: Session retrieval and permission enforcement functions.
- `db.ts`: MongoDB connection pooling.
- `rate-limit.ts`: Distributed rate limiting mechanism.
- `rbac.ts`: Role and permission definitions.
- `cache-tags.ts`: ISR invalidation constants and helpers.

## Authentication Flow
1. User submits credentials to the login route.
2. Server validates via bcrypt and creates a secure session in MongoDB.
3. A signed HTTP-only cookie (`tc-session`) is attached to the response.
4. Subsequent requests extract the cookie, validate the session in the DB, and resolve the user object.

## Authorization Flow
1. Protected routes and Server Actions call `requireUser()`, `requireAdminPage()`, or `requirePermission()`.
2. The resolved user's `role` is checked against the mapping in `lib/rbac.ts`.
3. If unauthorized, a `403 Forbidden` or redirect is triggered.

## Storage Architecture
Binary assets (images, resumes) are uploaded directly to Vercel Blob. 
- Media module creates a `Media` document in MongoDB holding the Blob URL and metadata.
- Resumes are linked directly to `Application` records via `resumeAssetId`.

## Email Architecture
Transactional emails use Resend. The `email.service.ts` module generates HTML via React components (`modules/notifications/templates/`), and dispatches emails concurrently to both the customer and the site administrators with built-in retry logic for transient provider errors.

## Search Architecture
Search relies on MongoDB's native `$text` indexing. `public.service.ts` queries multiple collections (Services, Solutions, Blog, Jobs, etc.) concurrently, aggregates results, and sorts them by MongoDB's computed `textScore`.

## Caching Architecture
Read-heavy public pages use Next.js Incremental Static Regeneration (ISR). When CMS content is updated via a Server Action, `revalidatePublic()` (using Next.js `revalidateTag` and `revalidatePath`) is called to instantly purge the cache for the affected content.
