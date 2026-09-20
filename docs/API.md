# API Routes & Server Actions

TechCore utilizes both API Route Handlers and Server Actions depending on the use case.

## API Route Handlers

There are currently 23 API route handlers in the `app/api/` directory.

### Authentication

- **`POST /api/auth/login`**
  - **Purpose**: Authenticates a user and creates a session.
  - **Status**: Public.
  - **Rate Limiting**: Enforced.
- **`POST /api/auth/logout`**
  - **Purpose**: Destroys the current user session and clears the cookie.
  - **Status**: Authenticated.
- **`GET /api/auth/session`**
  - **Purpose**: Retrieves current session context.
  - **Status**: Public/Authenticated (returns null if unauthenticated).
- **`POST /api/auth/forgot-password`**
  - **Purpose**: Initiates password recovery flow via email OTP.
  - **Status**: Public.
  - **Rate Limiting**: Enforced.
- **`POST /api/auth/reset-password`**
  - **Purpose**: Completes password recovery flow using OTP.
  - **Status**: Public.
  - **Rate Limiting**: Enforced.

### Public Forms

- **`POST /api/jobs/[id]/apply`**
  - **Purpose**: Handles job application submissions, including PDF/DOC resume uploads.
  - **Status**: Public.
  - **Validation**: Enforced via Zod. Validates magic bytes, mime types, and size for the resume. Requires `gdprConsent`.
  - **Rate Limiting**: Enforced.
  - **Security**: Resumes are uploaded securely to Vercel Blob with `access: "private"`. Honeypot field stops automated spam.
- **`POST /api/contact`**
  - **Purpose**: Submits contact enquiries.
  - **Status**: Public.
  - **Rate Limiting**: Enforced.
- **`POST /api/enquiries`**
  - **Purpose**: Submits general enquiries/quotes.
  - **Status**: Public.
  - **Rate Limiting**: Enforced.

### Public Content
These endpoints expose read-only data for public consumption or dynamic client-side fetching.
- **`GET /api/blog`**: Lists blog posts.
- **`GET /api/blog/[slug]`**: Fetches specific blog post data.
- **`GET /api/industries`**: Lists industries.
- **`GET /api/industries/[slug]`**: Fetches specific industry data.
- **`GET /api/jobs`**: Lists open jobs.
- **`GET /api/jobs/[id]`**: Fetches specific job data.
- **`GET /api/projects`**: Lists projects.
- **`GET /api/projects/[slug]`**: Fetches specific project data.
- **`GET /api/services`**: Lists services.
- **`GET /api/services/[slug]`**: Fetches specific service data.
- **`GET /api/solutions`**: Lists solutions.
- **`GET /api/solutions/[slug]`**: Fetches specific solution data.

### Admin / Protected

- **`GET /api/admin/applications/[id]/resume`**
  - **Purpose**: Proxies download of private applicant resumes from Vercel Blob.
  - **Status**: Admin Protected.
  - **Permission Requirement**: `leads:read`.
  - **Response Behavior**: Streams the private Blob as an attachment to the authorized client.
- **`GET /api/admin/dashboard`**
  - **Purpose**: Retrieves high-level dashboard metrics for the CMS.
  - **Status**: Admin Protected.
  - **Permission Requirement**: `dashboard:read`.

### Health / System

- **`GET /api/health`**
  - **Purpose**: System health check endpoint.
  - **Status**: Public.

---

## Server Actions
Server Actions (`modules/**/actions.ts`) are the primary method for mutating data within the Admin CMS.

### Common Structure
Every Admin Server Action must:
1. Call `requireUser()` or `requirePermission()` to authorize the request.
2. Validate input payload using Zod.
3. Perform database operations.
4. Log the action via `AuditLog` (if applicable).
5. Call `revalidatePublic()` (using tags) to clear Next.js ISR caches.
6. Return a standardized response or throw an `AppError`.

### Example Locations
- `modules/content/actions.ts`: Manage Home, About, Legal, Settings.
- `modules/catalog/actions.ts`: CRUD for Services, Solutions, Industries.
- `modules/identity/actions.ts`: Auth flows, user management.
- `modules/media/actions.ts`: Upload/Delete media.
