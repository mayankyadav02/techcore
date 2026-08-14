# TechCore Technical Architecture Specification

**Document type:** Architecture / design (pre-implementation)  
**Project:** TechCore — IT Services & Solutions website, lead management, admin CMS  
**Status:** Draft — awaiting review and explicit approval before implementation  
**Stack:** Next.js · TypeScript · Tailwind CSS · MongoDB · Mongoose · Framer Motion · React Hook Form · Zod  
**Audience:** Engineering review (architecture, security, product)

This document is the implementation contract. No application code should be written until this specification is approved.

---

## 1. Executive Overview

TechCore is a fictional IT services company. The platform is a **single Next.js application** that serves three tightly related capabilities:

1. **Public corporate website** — marketing pages (home, services, solutions, industries, projects, careers, blog, contact, quote, legal).
2. **Lead / enquiry intake** — public forms for contact, quote requests, general enquiries, and job applications.
3. **Authenticated admin CMS** — content management, lead/application review, testimonials, and site settings.

The recommended shape is a **modular monolith**: one deployable Next.js App Router app, one MongoDB database, clear module boundaries (content, leads, careers, auth, media), and a strict split between **public read paths** (cacheable, SEO-first) and **admin / mutation paths** (authenticated, audited, rate-limited).

This is intentionally **not** a microservices design. For a company website plus CMS, a well-structured Next.js app is simpler to secure, deploy, and maintain, and it can still grow (background jobs, object storage, search, extra locales) without a rewrite.

---

## 2. Requirements Analysis

### 2.1 Public website (visitor)

| Page | Purpose | Dynamic content |
| --- | --- | --- |
| Home | Positioning, featured services/solutions/projects, CTAs | CMS-driven sections + featured entities |
| About | Company story, values, leadership (optional) | Page content + team/stats if CMS-backed |
| Services | Catalogue of IT services | `Service` documents |
| Solutions | Packaged technology solutions | `Solution` documents |
| Industries | Vertical expertise | `Industry` documents |
| Projects | Case studies | `Project` documents |
| Careers | Open roles | `Job` documents |
| Blog | Thought leadership | `Post` documents |
| Contact | General contact / enquiry | Form → `Enquiry` |
| Request Quote | Structured commercial request | Form → `Enquiry` (type `quote`) |
| Privacy / Terms | Legal | `Page` or settings-backed HTML/markdown |

Visitors must be able to submit:

- General enquiries
- Contact requests
- Quote requests
- Job applications (CV + role reference)

### 2.2 Admin CMS (staff)

| Area | Purpose |
| --- | --- |
| Dashboard | Counts, recent leads, unpublished content, applications needing review |
| Services / Solutions / Projects / Blog / Careers | CRUD + publish workflow |
| Applications | Review job applications |
| Enquiries | Review contact/quote/general leads |
| Testimonials | Moderate and publish social proof |
| Settings | Company profile, contact details, SEO defaults, feature flags |

### 2.3 MVP vs later

**MVP (must ship)**

- All listed public pages with CMS-backed primary content (services, solutions, industries, projects, jobs, posts).
- Contact + quote forms creating enquiries.
- Job application form creating applications (PDF/DOC resume upload).
- Admin auth (email/password), session cookies, role-based access.
- Admin CRUD for CMS entities, enquiry/application queues, testimonials, basic settings.
- Publish/draft for content; status workflow for leads and applications.
- SEO basics (metadata, slugs, sitemap, robots, Open Graph).
- Validation (Zod), rate limiting on public forms, security headers, hashed passwords.
- Responsive UI, accessible forms, Tailwind design system, Framer Motion used sparingly on public marketing surfaces.

**Later (explicitly out of MVP)**

- Multi-language / i18n.
- Full-text search (Atlas Search / Meilisearch).
- Marketing automation, CRM sync (HubSpot, Salesforce).
- Email drip / newsletter.
- Real-time chat / chatbot.
- Multi-factor authentication (design for it; implement after MVP unless required at launch).
- Granular custom permission editor (start with 2–3 fixed roles).
- Commenting on blog, user accounts for candidates.
- A/B testing, personalization.
- Separate media DAM with image variants pipeline beyond Next.js Image + object storage.
- Background worker cluster (start with in-process or a single queue when email is added).
- Analytics product (use a third-party pixel later; optional privacy-friendly analytics).

### 2.4 Non-functional requirements

- Production-realistic security for an internet-facing form + admin panel.
- Fast public pages (TTFB, LCP) via server rendering / static generation and caching.
- Maintainable TypeScript, reusable UI, no business logic trapped in presentational components.
- Ability to grow content volume and lead volume without schema rewrites.

---

## 3. Architecture Goals

1. **Separation of concerns** — UI ≠ validation ≠ services ≠ persistence ≠ auth.
2. **Security by default** — public surface is read-mostly; all writes are validated and (for admin) authorized.
3. **SEO and performance** — public routes are server-first; client JS is reserved for forms, admin, and motion.
4. **Modular growth** — add email, storage, search, or integrations without exploding the folder graph.
5. **Developer experience** — one repo, one language, shared Zod schemas, typed Mongoose models.
6. **Avoid over-engineering** — no event sourcing, no CQRS, no Kubernetes-first design.

---

## 4. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Clients                                  │
│  Browser (public)          Browser (admin)         Crawlers      │
└────────────┬─────────────────────┬─────────────────────┬────────┘
             │                     │                     │
             ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js App (App Router)                     │
│                                                                  │
│  Public RSC / SSG / ISR          Admin (dynamic, noindex)        │
│  app/(public)/*                  app/(admin)/admin/*             │
│                                                                  │
│  Server Actions / Route Handlers                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ Content     │  │ Leads        │  │ Auth / Session          │ │
│  │ services    │  │ + careers    │  │ RBAC middleware         │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
│                                                                  │
│  Shared: Zod schemas, mappers, errors, rate limit, audit         │
└────────────┬───────────────────────────────┬────────────────────┘
             │                               │
             ▼                               ▼
┌────────────────────────┐     ┌──────────────────────────────────┐
│ MongoDB + Mongoose     │     │ Object storage (uploads)         │
│ (primary data)         │     │ S3-compatible or Cloudinary      │
└────────────────────────┘     └──────────────────────────────────┘

Later (not MVP): email provider, queue worker, search index, CDN logs/APM
```

**Trust boundaries**

- **Public:** unauthenticated reads of *published* content; unauthenticated writes only through three form pipelines (enquiry, quote, application), all rate-limited and validated.
- **Admin:** authenticated session required; CSRF-safe mutations; unpublished content never leaked via public APIs or RSC data loaders.
- **Infrastructure:** secrets only in environment; DB not exposed to the browser.

**Data flow (enquiry example)**

1. Public page (RSC) renders form shell; client island mounts React Hook Form.
2. Client validates with shared Zod schema; submit via Server Action (preferred) or `POST /api/public/enquiries`.
3. Server re-validates with the same Zod schema, applies rate limit + honeypot, sanitizes, persists `Enquiry`.
4. Admin list (RSC) loads via service layer with session + permission check.
5. Admin status change is a Server Action with RBAC + audit log.

---

## 5. Technology Decisions

| Concern | Choice | Rationale |
| --- | --- | --- |
| Framework | Next.js (App Router) | SSR/SSG/ISR, Server Actions, nested layouts, Route Handlers |
| Language | TypeScript (strict) | Shared types across UI, Zod, Mongoose |
| Styling | Tailwind CSS | Fast, consistent design tokens; no CSS-in-JS runtime cost |
| Animation | Framer Motion | Client-only; marketing flourishes, not layout-critical content |
| Forms | React Hook Form | Performant admin + public forms |
| Validation | Zod | Single source of truth for client, server, and OpenAPI-like contracts |
| Database | MongoDB | Document model fits CMS + nested content blocks; specified stack |
| ODM | Mongoose | Schema, indexes, middleware, TypeScript types |
| Auth | Session cookies (httpOnly, Secure, SameSite) via Auth.js (Auth.js / NextAuth v5) **or** a thin custom session using `jose` + Mongo `Session` collection | Cookie sessions fit a first-party admin app better than bearer JWTs in localStorage |
| Hosting (assumption) | Node-capable host (Vercel, Railway, container) | Server Actions + MongoDB need a Node runtime, not purely static export |
| Files | Object storage + public CDN URLs stored in DB | Do not store binaries in MongoDB |
| Email (later) | Transactional provider (Resend / SES) | Decouple from request path via queue when volume grows |

**Next.js rendering policy**

| Surface | Strategy |
| --- | --- |
| Marketing pages, blog, case studies | `generateStaticParams` + ISR (`revalidate`) or `revalidateTag` on publish |
| Listing pages with filters | SSR with cache tags; or ISR for default view |
| Contact / quote / apply | SSR page + client form island |
| Admin entire tree | Dynamic, `force-dynamic`, `robots: noindex` |
| Sitemap / robots | Route handlers, regenerated on publish |

**Assumption:** App Router (not Pages Router). Reasonable because it is current Next.js best practice and matches Server Actions + RSC.

---

## 6. Application / Module Architecture

Organize by **domain module**, not by “type-only” folders as the only axis. Each module owns schema, services, and UI slices.

| Module | Owns | Public | Admin |
| --- | --- | --- | --- |
| `content` | Pages, SEO defaults, navigation, settings | Read published | Full |
| `catalog` | Services, solutions, industries | Read published | CRUD |
| `work` | Projects / case studies | Read published | CRUD |
| `insights` | Blog posts, categories/tags | Read published | CRUD |
| `careers` | Jobs + applications | Jobs list/detail + apply | Jobs CRUD + application queue |
| `leads` | Enquiries (contact, quote, general) | Submit only | Queue + notes |
| `social-proof` | Testimonials | Read published | Moderate |
| `media` | Upload metadata, virus/type checks | Indirect (URLs) | Upload |
| `identity` | Users, sessions, roles, audit | — | Auth + user admin (super-admin) |

**Layering inside a module**

```
schema (Zod) → model (Mongoose) → service (business rules) → actions/routes (HTTP/RSC) → UI
```

- **UI components** never import Mongoose models.
- **Services** never import React.
- **Route handlers / Server Actions** are thin: authz → parse → service → map error.

---

## 7. Frontend Architecture

### 7.1 Route groups

```
app/
  (public)/                 # marketing layout, header/footer, analytics stub
    page.tsx                # Home
    about/
    services/[[...slug]]/
    solutions/[[...slug]]/
    industries/[[...slug]]/
    projects/[[...slug]]/
    careers/[[...slug]]/
    blog/[[...slug]]/
    contact/
    request-quote/
    privacy/
    terms/
  (admin)/
    admin/
      layout.tsx            # requires session; admin chrome
      page.tsx              # dashboard
      services/
      solutions/
      projects/
      blog/
      careers/
      applications/
      enquiries/
      testimonials/
      settings/
      login/                # exception: no session required
  api/                      # only where Server Actions are a poor fit (webhooks, uploads)
```

**Login** lives under `/admin/login` (public within admin group, no sidebar). All other `/admin/*` routes are protected by middleware + layout session check (defense in depth).

### 7.2 Server vs client

**Server Components (default)**

- Page shells, SEO metadata, data fetching for published content.
- Admin tables’ initial data (after auth).
- Layouts, navigation built from settings.

**Client Components (`"use client"`)**

- Forms (RHF + Zod resolver).
- Admin interactive tables (filters, pagination controls, status dropdowns).
- Framer Motion sections, mobile nav, modals, toasts.
- Rich text editor (admin only).

**Rules**

- Fetch data on the server. Client components receive serializable props or call Server Actions.
- Do not fetch MongoDB from the browser.
- Motion must not block LCP: animate non-critical decoration; keep hero text in HTML.

### 7.3 Public vs admin UI

| | Public | Admin |
| --- | --- | --- |
| Layout | Marketing chrome, SEO | Dense workspace, noindex |
| Auth | None | Required |
| Data | Published only | All statuses |
| Motion | Tasteful | Minimal (productivity) |
| Forms | Few, high friction-reduction | Many CRUD forms |

### 7.4 State

- **No global Redux for MVP.** Server is the source of truth.
- Client state: form state (RHF), URL search params for admin filters/pagination, light UI state (sidebar, modal).
- Cache: Next.js `fetch` cache / `unstable_cache` / `revalidateTag('services')` after CMS writes.

---

## 8. Backend / API Architecture

### 8.1 Preferred mutation style

**Server Actions** for:

- Public form submits (enquiry, quote, application metadata).
- Admin CRUD and status changes.

**Route Handlers** for:

- Multipart resume / image upload (`POST /api/uploads`).
- Auth routes if using Auth.js (`/api/auth/*`).
- Health check (`GET /api/health`).
- Webhooks later (email bounce, storage).

This keeps most business logic out of REST sprawl while still offering HTTP endpoints where the platform requires them.

### 8.2 Public API surface (minimal)

Unauthenticated, strictly scoped, rate-limited.

| Endpoint / Action | Purpose | Auth | Validation | Response |
| --- | --- | --- | --- | --- |
| `submitEnquiry` / `POST /api/public/enquiries` | Contact or general enquiry | None | `enquiryPublicSchema` | `{ ok: true, id }` or field errors |
| `submitQuote` / same collection `type: quote` | Quote request | None | `quotePublicSchema` | same |
| `submitApplication` | Job application (after upload) | None | `applicationPublicSchema` | same |
| `POST /api/uploads/resume` | Resume file | None + rate limit + jobId check | MIME, size, extension | `{ fileKey, url }` **or** `{ fileToken }` (prefer opaque token, not a long-lived public URL) |
| `GET /api/health` | Liveness | None | — | `{ status }` |

Public **read** of CMS should **not** be a JSON API in MVP. RSC loaders query services directly. If a future headless consumer appears, add versioned `GET /api/v1/public/...` that only returns published documents.

### 8.3 Admin API surface

All require session. All mutations re-check RBAC in the service.

**Content (pattern repeats for services, solutions, industries, projects, posts, jobs, testimonials)**

| Action | Purpose |
| --- | --- |
| `list*` | Paginated, filter by status/search |
| `get*` | By id (admin can see drafts) |
| `create*` | Create draft |
| `update*` | Patch fields |
| `setPublishStatus` | draft / published / archived |
| `delete*` | Soft-delete preferred (`deletedAt`) |

**Leads**

| Action | Purpose |
| --- | --- |
| `listEnquiries` | Filter type, status, date |
| `getEnquiry` | Detail + notes |
| `updateEnquiryStatus` | Workflow transition |
| `addEnquiryNote` | Internal note |
| `assignEnquiry` | Optional owner (admin user id) |

**Applications** — same pattern (`list`, `get`, `status`, `notes`). Resume download via authenticated handler that checks permission and streams from storage (do not expose raw bucket URLs in the browser without signed URLs).

**Settings / users**

| Action | Purpose | Role |
| --- | --- | --- |
| `getSettings` / `updateSettings` | Company, SEO, contact | `admin`+ |
| `listUsers` / `inviteUser` / `setUserRole` / `disableUser` | Identity | `super_admin` |
| `changeOwnPassword` | Self-service | any authenticated |

### 8.4 Request / response responsibilities

**Success (action)**

```ts
{ ok: true, data: T }
```

**Validation failure**

```ts
{ ok: false, code: "VALIDATION_ERROR", fields: Record<string, string> }
```

**Domain / authz**

```ts
{ ok: false, code: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "RATE_LIMITED", message: string }
```

HTTP mapping if Route Handlers are used: 200/201, 400, 401, 403, 404, 409, 429, 500.

Never leak stack traces or Mongo errors to the client. Log internally with a `requestId`.

### 8.5 Service layer responsibilities

Each service:

1. Assert actor + permission.
2. Parse input with Zod (server copy).
3. Enforce domain rules (e.g. cannot publish job without `slug`; cannot apply to closed job).
4. Persist via Mongoose.
5. `revalidateTag` / `revalidatePath` for public pages.
6. Write audit log for admin mutations and lead status changes.

---

## 9. Database Architecture

**Single database**, logical collections per domain. No multi-tenant `tenantId` (assumption: one company).

**Conventions**

- `_id`: ObjectId.
- `slug`: unique sparse index where public URLs exist.
- `status`: string enums (not booleans) for workflow.
- `createdAt` / `updatedAt`: Mongoose timestamps.
- Soft delete: `deletedAt: Date | null` on CMS entities; public queries always `deletedAt: null` and `status: 'published'`.
- References: store `ObjectId` + optional denormalized `title`/`slug` for list performance where needed (jobs on applications).
- Do **not** embed unbounded arrays (enquiry notes can grow — use a `notes[]` cap or a child `EnquiryNote` collection if volume is high; MVP: capped embedded notes, e.g. max 50, then later extract).

**Indexing strategy (MVP)**

- Unique: `slug`, `email` on users.
- Compound: `{ status: 1, updatedAt: -1 }` on content; `{ status: 1, createdAt: -1 }` on enquiries/applications; `{ jobId: 1, createdAt: -1 }` on applications.
- Text index later; MVP admin search via regex on indexed `title` **or** prefix search on `title` with collation — avoid unanchored collection-wide regex in production.

**Ownership**

- **System / CMS content:** owned by TechCore; last editor stored as `updatedBy`.
- **Leads & applications:** owned by TechCore (PII); access restricted to roles with `leads:read`. Subject to retention policy (assumption: 24 months unless legal says otherwise — configurable in settings later).
- **Users:** identity records; passwords never returned from APIs.

**Connection**

- One Mongoose connection module, reused in serverless via cached global (standard Next.js + Mongo pattern).
- No client-side DB credentials.

---

## 10. Database Models & Relationships

### 10.1 Relationship overview

```
User ──────── updates ──► Service | Solution | Industry | Project | Post | Job | Testimonial | Page
User ──────── assigned ─► Enquiry | Application
Job  1 ─── * Application
Post * ─── * Tag (optional MVP: string tags array)
Enquiry / Application * ── * Note (embedded)
MediaAsset 1 ◄── * content fields (heroImageId, galleryIds)
Settings (singleton)
AuditLog * ── User, resourceType, resourceId
Session * ── User (if using DB sessions)
```

### 10.2 `User`

| Field | Type | Notes |
| --- | --- | --- |
| email | string | unique, lowercase, indexed |
| name | string | |
| passwordHash | string | Argon2id or bcrypt (cost ≥ 12); never select by default |
| role | enum | `super_admin` \| `admin` \| `editor` \| `viewer` |
| status | enum | `active` \| `disabled` |
| lastLoginAt | Date | |
| passwordChangedAt | Date | invalidate old sessions |
| createdAt, updatedAt | Date | |

**Indexes:** unique `email`; `{ role: 1, status: 1 }`.

### 10.3 `Session` (if DB sessions)

| Field | Notes |
| --- | --- |
| userId | ref User, indexed |
| expiresAt | TTL index |
| userAgentHash / ipHash | optional anomaly signals (hash, don’t store raw IP long-term if avoidable) |

### 10.4 `Service`

| Field | Notes |
| --- | --- |
| title, slug | slug unique |
| summary, body | body: markdown or portable rich-text JSON |
| icon | string key or media id |
| heroImageId | ref MediaAsset |
| highlights | string[] |
| relatedSolutionIds | ObjectId[] |
| relatedIndustryIds | ObjectId[] |
| seo | `{ title, description, ogImageId }` |
| status | `draft` \| `published` \| `archived` |
| publishedAt | |
| sortOrder | number |
| deletedAt | |
| createdBy, updatedBy | User refs |
| timestamps | |

**Indexes:** unique `slug`; `{ status: 1, sortOrder: 1 }`; `{ deletedAt: 1, status: 1 }`.

### 10.5 `Solution` — same pattern as Service

Add `problem`, `approach`, `outcomes` (strings or block list). Optional `relatedServiceIds`.

### 10.6 `Industry`

`title`, `slug`, `summary`, `body`, `heroImageId`, `relatedServiceIds`, `relatedProjectIds`, `seo`, `status`, `sortOrder`, audit fields.

### 10.7 `Project` (case study)

| Field | Notes |
| --- | --- |
| title, slug, clientName | clientName may be “Confidential” |
| summary, challenge, solution, results | |
| industryIds, serviceIds, solutionIds | refs |
| heroImageId, galleryIds | |
| metrics | `{ label, value }[]` small array |
| year | number, indexed for filters |
| status, seo, sortOrder, deletedAt, audit | |

### 10.8 `Post` (blog)

`title`, `slug`, `excerpt`, `body`, `authorName` (string MVP; later User), `category`, `tags: string[]`, `heroImageId`, `status`, `publishedAt`, `seo`, audit.

**Indexes:** unique `slug`; `{ status: 1, publishedAt: -1 }`.

### 10.9 `Job`

| Field | Notes |
| --- | --- |
| title, slug | |
| department, location, employmentType | enums + string location |
| description, requirements, benefits | |
| status | `draft` \| `open` \| `closed` \| `archived` |
| closesAt | optional |
| applicationsCount | denormalized counter |
| seo, audit | |

Public list: `status: 'open'` only. Applications rejected if job not `open`.

### 10.10 `Application` (PII)

| Field | Notes |
| --- | --- |
| jobId | required, indexed |
| jobTitleSnapshot | denormalized |
| name, email, phone | PII |
| coverLetter | string, length-capped |
| resumeAssetId | MediaAsset |
| status | `new` \| `reviewing` \| `shortlisted` \| `rejected` \| `hired` \| `archived` |
| assignedTo | User |
| notes | `{ body, authorId, createdAt }[]` |
| source | `careers_page` |
| gdprConsent | boolean, required true |
| deletedAt | soft delete / right-to-erasure support |

**Indexes:** `{ status: 1, createdAt: -1 }`; `{ jobId: 1, createdAt: -1 }`; `{ email: 1 }`.

### 10.11 `Enquiry` (PII)

| Field | Notes |
| --- | --- |
| type | `contact` \| `quote` \| `general` |
| name, email, phone, company | |
| message | |
| // quote-specific (optional fields) | |
| serviceInterestIds | ObjectId[] |
| budgetRange, timeline | enums/strings |
| status | `new` \| `in_progress` \| `qualified` \| `closed_won` \| `closed_lost` \| `spam` |
| assignedTo | |
| notes | embedded |
| sourcePage | string |
| utm | `{ source, medium, campaign }` optional |
| honeypotCaught | do not persist spam if possible; or status `spam` |
| gdprConsent | |
| timestamps | |

**Indexes:** `{ type: 1, status: 1, createdAt: -1 }`; `{ email: 1 }`.

**Future growth:** when notes or activities explode, extract `LeadActivity` collection. When sales process matures, add `valueEstimate` and pipeline stages without renaming `status` carelessly (extend enum).

### 10.12 `Testimonial`

`quote`, `authorName`, `authorRole`, `company`, `avatarId`, `relatedProjectId`, `rating` (optional 1–5), `status` (`draft` \| `published` \| `archived`), `sortOrder`, audit.

### 10.13 `Page`

For About, Privacy, Terms, and optional Home extra blocks.

`key` unique (`about`, `privacy`, `terms`, `home`), `title`, `body`, `seo`, `status`, audit.

Alternatively Home is composed from Settings + featured refs — both are valid; **recommendation:** `Page` for legal/about, `Settings.homepage` for featured IDs.

### 10.14 `MediaAsset`

| Field | Notes |
| --- | --- |
| key | storage key |
| url | CDN URL or empty if private |
| visibility | `public` \| `private` |
| mime, size, originalName | |
| width, height | images |
| uploadedBy | User or `public_applicant` |
| purpose | `cms` \| `resume` |
| createdAt | |

Resumes: `visibility: private`. CMS images: public.

### 10.15 `Settings` (singleton)

`companyName`, `tagline`, `logoId`, `contactEmail`, `contactPhone`, `address`, `socialLinks`, `defaultSeo`, `featureFlags`, `updatedBy`, timestamps.

Access via `key: 'global'` unique document.

### 10.16 `AuditLog`

`actorId`, `action`, `resourceType`, `resourceId`, `metadata` (small JSON, no secrets/PII dumps), `ipHash`, `createdAt`.

**TTL (later):** 90–180 days. **Indexes:** `{ resourceType: 1, resourceId: 1, createdAt: -1 }`; `{ actorId: 1, createdAt: -1 }`.

Log: login success/failure (careful with enumeration), user role changes, content publish, enquiry status, settings updates, user disable.

### 10.17 Future-friendly fields

- `locale` later on content (not in MVP).
- `externalId` for CRM sync.
- Avoid deeply nested unknown blobs; prefer named fields.

---

## 11. Authentication & Authorization

### 11.1 Admin authentication (MVP)

- **Method:** email + password.
- **Session:** server-side session ID in an **httpOnly**, **Secure**, **SameSite=Lax** cookie (or Auth.js JWT session in httpOnly cookie — still never localStorage).
- **Cookie name:** prefixed `__Host-` if served only from HTTPS on apex (or `__Secure-` as fallback).
- **TTL:** 8-hour idle or 12-hour absolute for admin (short is appropriate for CMS). “Remember me” is **not** recommended for MVP admin.
- **Password:** Argon2id preferred (bcrypt acceptable); pepper in env optional; min length 12; breach check later.
- **Lockout:** after N failed logins per email + IP (e.g. 5 / 15 min) — generic error messages (“Invalid credentials”).
- **Logout:** destroy session server-side + expire cookie.
- **Password change:** bump `passwordChangedAt`; revoke other sessions.

**Not for MVP:** OAuth social login for admin, magic links (optional later), public user registration.

### 11.2 Protected routes

1. **Middleware:** if path starts with `/admin` and is not `/admin/login` or `/api/auth`, require session cookie; else redirect to login with `callbackUrl`.
2. **Admin layout:** `auth()` / `getSession()`; if missing, redirect (middleware bypass hardening).
3. **Every Server Action / upload route:** `requireUser()` then `requirePermission()`.

Never rely on middleware alone (it can be skipped for some Server Action paths depending on Next version/config — **defense in depth**).

### 11.3 Roles (RBAC)

| Permission | super_admin | admin | editor | viewer |
| --- | --- | --- | --- | --- |
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| CMS content CRUD | ✓ | ✓ | ✓ | read |
| Publish / archive | ✓ | ✓ | ✓ | — |
| Enquiries / applications | ✓ | ✓ | — | read optional (default: no PII for editor) |
| Testimonials | ✓ | ✓ | ✓ | read |
| Settings | ✓ | ✓ | — | — |
| User management | ✓ | — | — | — |
| Delete users / hard-delete PII | ✓ | — | — | — |

**Assumption:** Editors must not see candidate resumes or enquiry PII by default (need-to-know). Admins run the business pipeline. This is a reasonable privacy default for an IT services firm.

Implement permissions as a map `role → Permission[]`, not scattered `if (role === 'admin')`. Check permissions, not role strings, in services so new roles are cheap.

### 11.4 Public “auth”

None. Form submissions are anonymous (identified only by submitted PII). Optional later: application tracking token.

### 11.5 Attack protections (auth)

- Generic login errors (no user enumeration).
- Rate limit `/admin/login` and public forms.
- CSRF: SameSite cookies + Server Actions origin checks / Auth.js CSRF tokens; custom POST handlers verify origin/host headers.
- Session fixation: rotate session on login.
- Brute force: lockout + CAPTCHA later if abused.
- MFA: architecture allows `User.mfaEnabled` later; do not block MVP.

---

## 12. Admin CMS Architecture

### 12.1 UX model

- Left nav matching required areas: Dashboard, Services, Solutions, Projects, Blog, Careers, Applications, Enquiries, Testimonials, Settings.
- List pages: search, status filter, pagination (page size 20).
- Edit pages: RHF + Zod; dirty-state warning; Save draft vs Publish.
- Lead detail: timeline of status + notes; do not allow free-form status strings.

### 12.2 Content workflow

`draft → published → archived` (and back to draft if needed).  
Public site reads `published` only. ISR revalidation on publish.

### 12.3 Lead workflow

**Enquiry:** `new → in_progress → qualified → closed_won | closed_lost` and `spam` from any early state.  
**Application:** `new → reviewing → shortlisted → hired | rejected` and `archived`.

Invalid transitions return `CONFLICT`.

### 12.4 Dashboard (MVP)

- Counts: new enquiries, new applications, drafts unpublished.
- Tables: last 5 enquiries, last 5 applications.
- No heavy analytics charts in MVP.

### 12.5 Settings

Singleton editor: company identity, contact, default SEO, social links. Changing logo revalidates layout.

---

## 13. Reusable Component Architecture

```
components/
  ui/                 # primitives: Button, Input, Select, Textarea, Badge, Modal, Toast, Pagination, Spinner
  forms/              # FormField, FormError, FileDropzone — RHF bindings, no domain
  marketing/          # Section, Hero, Card, CTA, LogoCloud — public
  motion/             # FadeIn, StaggerList — Framer wrappers, client-only
  admin/              # DataTable, PageHeader, StatusBadge, ConfirmDialog, AdminShell
  content/            # PortableText/Markdown renderer (server-safe)
```

**Rules**

- `ui/` has no domain imports and no Mongoose.
- Domain components (`ServiceCard`) live next to the module or under `components/catalog/`.
- Variants via CVA (class-variance-authority) or Tailwind-only props — pick one and stick to it.
- Admin and public may share `ui/` but **not** marketing layout chrome.
- Accessibility: label association, focus rings, keyboard modals.

**Rich text:** MVP markdown (`textarea` + `react-markdown` on public) is enough. WYSIWYG (TipTap) is a later upgrade; store markdown or a JSON doc, not raw HTML from the client without sanitization.

---

## 14. Validation Strategy

**Single Zod schemas**, composed:

```
schemas/enquiry.ts
  enquiryBase
  enquiryPublicSubmit    // used by RHF + Server Action
  enquiryAdminPatch
```

- Client: `@hookform/resolvers/zod`.
- Server: `schema.safeParse(input)` **always** — never trust the client.
- Mongoose: keep a pragmatic schema (types, required, enums, maxlength) aligned with Zod; Zod is the API contract, Mongoose is the persistence safety net.
- Sanitize strings (trim, max length). Strip HTML from plain-text fields. If markdown, render with a sanitizing pipeline (no raw `dangerouslySetInnerHTML` of user input).
- File validation: MIME allowlist, size limits, extension vs detected type.

**Public form limits (suggested)**

- Name 2–80, email RFC + 254, phone optional E.164-ish, message 20–5000, quote budget enum.
- Resume: PDF/DOC/DOCX, 5 MB.

---

## 15. Error Handling

| Layer | Behavior |
| --- | --- |
| Zod | Field-level errors to the form |
| Domain | Typed `AppError` with `code` |
| Unknown | Log + generic “Something went wrong” |
| RSC data | `notFound()` for missing published slug; never 500 for “not published” (treat as 404) |
| Admin | 404 vs 403 distinguished for authenticated users |
| UI | Toast for action failures; inline for forms |
| Boundary | `app/error.tsx`, `admin/error.tsx`, `not-found.tsx` |

**Logging:** structured JSON (`level`, `requestId`, `userId`, `code`, `path`). No passwords, no full resume bodies, no raw cards (N/A).

---

## 16. Security Strategy

| Threat | Control |
| --- | --- |
| Auth | httpOnly sessions, hashing, lockout, short TTL, HTTPS only |
| RBAC | permission checks in services; editors isolated from PII |
| Input | Zod + maxlength + enum allowlists |
| XSS | React default escaping; sanitize markdown; never store admin HTML unsanitized; CSP header |
| CSRF | SameSite + origin checks + framework CSRF for auth |
| NoSQL injection | Mongoose parameterized queries; never concatenate user input into query objects unsafely; parse ObjectIds; forbid passing raw request bodies into `Model.find` |
| Rate limiting | IP + route: login, enquiry, quote, apply, upload (e.g. Upstash Redis or in-memory for single instance with clear limitation) |
| Cookies | Secure, httpOnly, SameSite, `__Host-` when possible |
| Passwords | Argon2id/bcrypt; `select: false` |
| Uploads | Allowlist, size cap, random keys, private bucket for resumes, no executable types, do not serve resumes as `inline` HTML |
| Secrets | `MONGODB_URI`, `AUTH_SECRET`, storage keys — env only; no `NEXT_PUBLIC_` for secrets |
| API abuse | Minimal public JSON; rate limits; honeypot field on forms; optional Turnstile later |
| Admin | noindex, separate layout, audit log, disable users, no default passwords in repo |
| Enumeration | same login message; 404 for unpublished public slugs |
| Headers | `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `X-Content-Type-Options`, HSTS at edge |
| Dependency | lockfile, no unknown postinstall scripts |

**Honeypot:** hidden field; if filled, return fake success and do not persist (or persist as spam without notifying attacker).

---

## 17. SEO & Performance

**SEO**

- Unique `generateMetadata` per page from CMS SEO fields with fallbacks.
- Canonical URLs; slug immutability or 301 map later (`SlugRedirect` collection if needed).
- `sitemap.ts` from published content; `robots.ts` disallow `/admin`.
- Semantic HTML, one H1, descriptive alt text from media.
- Open Graph / Twitter images from `ogImageId`.
- JSON-LD `Organization` + `BlogPosting` + `JobPosting` where it helps.
- ISR so new posts appear without full rebuild.

**Performance**

- Server Components by default; minimize client bundles (admin is a separate layout so marketing pages don’t load RHF/editor).
- `next/image` for CMS images (remote patterns for the CDN).
- Fonts via `next/font`.
- Split Framer Motion into below-fold client islands.
- Pagination on admin and on public blog/project indexes (e.g. 12 per page).
- Mongo projections for lists (`title slug summary heroImage status` only).
- Cache tags: `services`, `solutions`, `projects`, `posts`, `jobs`, `settings`.
- Avoid fetching all enquiries on dashboard; use `countDocuments` + `limit`.

---

## 18. Scalability Strategy

| Growth | Approach |
| --- | --- |
| Website traffic | CDN + ISR/static; scale Next horizontally; Mongo connection pooling |
| CMS content | Indexes + pagination; later Atlas Search |
| Enquiries/leads | Compound indexes; archive old to cold collection; export CSV later |
| Admin users | Tens to low hundreds: single Users collection is enough |
| Images | Object storage + Next.js optimizer; don’t store binaries in Mongo |
| API | Almost no public read API; actions stay cheap |
| Email on submit | MVP: skip or fire-and-forget; next: queue (Inngest / BullMQ) |
| Integrations | `externalId` + outbound adapter module; don’t couple HubSpot into Mongoose models |

**Background jobs (when needed, not day one)**

- Enquiry notification email to `settings.contactEmail`.
- Application received confirmation.
- Image variant generation (if not using a media CDN).

**Caching layers**

1. ISR / `revalidateTag`
2. Optional Redis for rate limits and session (if not JWT)
3. CDN for public assets

**Pagination:** cursor (`_id` + `createdAt`) for large lead lists; offset is acceptable for CMS content under a few thousand.

---

## 19. Folder Structure

```
techcore/
  ARCHITECTURE.md
  app/
    (public)/...
    (admin)/admin/...
    api/auth/[...nextauth]/   # if Auth.js
    api/uploads/
    api/health/
    sitemap.ts
    robots.ts
    layout.tsx
    globals.css
  components/  ui/ forms/ marketing/ admin/ motion/
  modules/
    identity/
    catalog/
    work/
    insights/
    careers/
    leads/
    social-proof/
    content/
    media/
      model.ts
      schema.ts          # Zod
      service.ts
      actions.ts
  lib/
    db.ts                # mongoose connect
    auth.ts
    rbac.ts
    errors.ts
    rate-limit.ts
    audit.ts
    env.ts               # zod-parsed env
    utils.ts
  types/
  hooks/                 # client hooks only
  public/
  tests/                 # later
```

Alternative: `features/` instead of `modules/` — same idea. **Do not** use only `controllers/models/views` across the whole app; it does not scale with domains.

---

## 20. Development Standards

- TypeScript `strict`, no `any` without justification.
- ESLint + Prettier; import order.
- Env validated at boot with Zod (`lib/env.ts`).
- Conventional commits optional; PRs small and module-scoped.
- Every public action has a Zod schema test (unit) when tests are introduced.
- Do not commit `.env`; provide `.env.example`.
- Accessibility: forms usable without motion; `prefers-reduced-motion`.
- Naming: collections singular or plural — **pick plural Mongo collections** (`users`, `enquiries`) and stick to it.
- Dates: store UTC ISODates; display in admin locale.
- **No secrets in client bundles.**

---

## 21. Risks & Potential Problems

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Serverless + Mongoose | Connection storms | Cached global connection; pool size; consider a long-running Node host if traffic grows |
| PII in Mongo | Breach impact | Minimize fields, access control, encryption at rest (Atlas), retention, private resumes |
| ISR stale content | Editors confused | `revalidateTag` on every publish; preview mode later |
| Server Actions CSRF / auth gaps | Next.js specifics | Origin checks, session in every action, automated tests |
| Spam forms | Lead quality | Honeypot, rate limit, Turnstile when needed |
| Rich text XSS | Site defacement / cookie theft | Markdown + sanitizer; CSP |
| Over-fetching admin lists | Slow CMS | Indexes, projections, pagination |
| File upload abuse | Disk/cost/malware | Size/MIME, private storage, random keys, later AV scan |
| Role sprawl | Confused authz | Start with 4 roles; permission map |
| Treating Next.js as a REST backend | Duplicate APIs | RSC + actions first |
| Framer Motion on entire pages | Poor LCP/INP | Islands only |
| Unique slugs after title edits | Broken URLs | Immutable slug after publish, or redirect table |
| Unbounded `notes[]` | 16MB document limit | Cap notes; extract collection later |

---

## 22. Recommended Development Phases

**Phase 0 — Foundation**  
Repo, Tailwind theme tokens, `lib/db`, env schema, error types, RBAC map, layout shells (public + admin), middleware stub.

**Phase 1 — Identity**  
User model, password hashing, login/logout, protected `/admin`, seed super-admin script (local only).

**Phase 2 — Content platform**  
Settings + Page + Media upload (public images) + Service CRUD + public Services listing/detail + ISR tags. This unlocks the pattern for everything else.

**Phase 3 — Remaining catalog**  
Solutions, Industries, Projects, Blog, Careers (jobs). Shared list/edit UI.

**Phase 4 — Public marketing composition**  
Home, About, legal pages, navigation, SEO metadata, sitemap, motion islands.

**Phase 5 — Leads**  
Enquiry + quote forms, admin Enquiries queue, notes, statuses, rate limit, honeypot.

**Phase 6 — Careers applications**  
Private upload, Application model, admin Applications, job `open` guard.

**Phase 7 — Testimonials + dashboard polish**  
Dashboard widgets, testimonials on home.

**Phase 8 — Hardening**  
Security headers, audit log, lockout, upload review, accessibility pass, performance pass.

**Phase 9 — Later**  
Email notifications, MFA, search, CRM, preview mode, TipTap, i18n.

Do not start Phase 5 before Phase 1–2: forms without a secure admin inbox create operational risk.

---

## 23. Final Architecture Summary

TechCore will be a **Next.js App Router modular monolith** with TypeScript, Tailwind, Mongoose/MongoDB, Zod, React Hook Form, and Framer Motion on the public site.

- **Public site:** server-rendered, cacheable, published-content only, SEO-first.
- **Intake:** three validated, rate-limited write paths (enquiry, quote, application).
- **Admin:** cookie sessions, RBAC, CMS workflows, PII-restricted lead desks.
- **Data:** document models with statuses, slugs, indexes, soft delete, audit, private vs public media.
- **APIs:** Server Actions as the primary contract; Route Handlers for auth, uploads, health.
- **MVP is deliberately smaller than the platform’s long-term ceiling** so the team can ship a maintainable production baseline.

### Assumptions (reasonable)

1. Single company, single locale, single brand — no multi-tenant.
2. Hosting supports Node.js (not static export).
3. Object storage will be used for files; MongoDB is not a blob store.
4. Auth.js or equivalent cookie sessions — not SPA token-in-localStorage.
5. Markdown is enough for MVP body content.
6. Email and MFA are phase-later unless launch policy requires them.
7. Traffic starts at marketing-site scale; ISR + indexes are sufficient.
8. Four fixed roles beat a custom ACL builder in v1.
9. Public JSON API is unnecessary until a second consumer exists.

---

## Approval gate

This architecture is **ready for review**.

**Do not begin implementation or generate application code until explicit approval is given** (for example: “Architecture approved — proceed with Phase 0” or requested changes to this document).

If review comments arrive, revise this specification first, then start the approved phase only.
