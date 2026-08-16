# TechCore

TechCore is a fictional IT services company site: a public marketing website, lead and job-application intake, and an authenticated admin CMS. Content lives in MongoDB. The product is a single Next.js App Router application (modular monolith), not a set of microservices.

See `ARCHITECTURE.md` for the original design contract. Enquiry statuses in this codebase are `new | contacted | qualified | in_progress | converted | closed` (not a separate spec vocabulary).

## Tech stack

- Next.js 16 (App Router; `proxy.ts` instead of `middleware.ts`)
- TypeScript, React 19, Tailwind CSS 4
- MongoDB + Mongoose
- Zod, React Hook Form
- Framer Motion (isolated islands such as `HeroVisual`, not page-wide wrappers)
- bcryptjs sessions (httpOnly cookies)

## Architecture overview

- **Public routes** (`app/(public)`) render marketing pages from published CMS documents. If Mongo is unavailable at request time, catalogue pages fail closed (empty/not found) rather than showing static demo copy as live content. `generateStaticParams` may still use static slugs so production builds succeed without Mongo.
- **Public APIs** (`app/api/*` except admin) accept contact, quote, and job applications with Zod validation, honeypots, rate limits, and same-origin checks.
- **Admin** (`app/(admin)/admin/(console)`) is session-gated in `proxy.ts`. Mutations go through server actions in `modules/*/actions.ts`.
- **Domain modules** live under `modules/` (catalog, work, insights, careers, leads, identity, content, social-proof). Shared models are re-exported from `modules/models.ts`.

## Features

- Public catalogue: services, solutions, industries, projects, careers, blog
- Contact and quote forms → enquiries
- Job applications (form fields only; resumes are not stored)
- Admin CRUD, publish workflow, enquiry/application queues, testimonials, settings
- SEO: canonical URLs from `APP_URL`, sitemap, robots, Open Graph, JSON-LD
- Audit log persisted in Mongo (`AuditLog`)

## Folder structure

```
app/                 App Router pages and API routes
components/          UI (marketing, admin, forms)
lib/                 env, auth helpers, SEO, rate limit, audit
modules/             domain models, schemas, services, actions
scripts/             seed and seed:admin
tests/               Node test runner suites
proxy.ts             Admin session gate (Next.js 16)
```

## Environment variables

Copy `.env.example` to `.env.local`. Do not commit secrets.

| Variable | Required | Notes |
| --- | --- | --- |
| `NODE_ENV` | yes | `development`, `test`, or `production` |
| `MONGODB_URI` | production | Mongo connection string |
| `AUTH_SECRET` | production | Min 32 characters. Used as session-hash pepper |
| `APP_URL` | production | Public origin, e.g. `https://www.example.com`. Local default `http://localhost:3000` |
| `ADMIN_EMAIL` | seed:admin only | First admin account |
| `ADMIN_PASSWORD` | seed:admin only | Min 12 characters |
| `ADMIN_NAME` | optional | Defaults to TechCore Admin |

In development and test, `MONGODB_URI` and `AUTH_SECRET` may be omitted so `next build` and unit tests can run. `next build` itself sets `NODE_ENV=production` but is not treated as a live boot. **`next start` / a running production process fails immediately** if `MONGODB_URI`, `AUTH_SECRET` (≥32 characters), or `APP_URL` are missing.

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database

MongoDB 6+ (local or Atlas). Create a database (example name `techcore`) and set `MONGODB_URI` in `.env.local`. A real Atlas URI in the environment is always used; development does not fall back to localhost when `MONGODB_URI` is set.

**Atlas IP access list:** `MongooseServerSelectionError` / “Could not connect to any servers” almost always means this machine’s public IP is not on the cluster Network Access list. In Atlas: Network Access → IP Access List → Add Current IP Address. Code cannot whitelist the IP for you. Do not open `0.0.0.0/0` unless you explicitly accept that risk.

### Seed

```bash
npm run seed
```

Loads fictional catalogue, jobs, posts, and settings. Safe to re-run (upserts).

```bash
npm run seed:admin
```

Creates or updates the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local`.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run lint
npm test
npm run build
npm start            # after build
```

## Production build and deployment

1. Set `NODE_ENV=production`, `MONGODB_URI`, `AUTH_SECRET` (≥32 chars), and `APP_URL` (https origin).
2. `npm run build` then `npm start`, or use a Node host that runs `next start`.
3. Put TLS in front of the app. `Strict-Transport-Security` is set in `next.config.ts` (browsers ignore HSTS on plain HTTP).
4. Run `npm run seed` and `npm run seed:admin` against the production database once.
5. Sign in at `/admin/login`.

The app is a single Node process. Serverless/multi-instance deploys work for pages and Mongo, but **in-memory rate limiting is per instance**.

## Admin setup

1. Seed an admin (`super_admin` from `seed:admin`).
2. Open `/admin/login`.
3. Roles (`super_admin`, `admin`, `editor`, `viewer`) are defined in `lib/rbac.ts`.

## Security notes

- Passwords are hashed with bcrypt. Session tokens are hashed with SHA-256 plus `AUTH_SECRET`.
- Admin pages and `/api/admin` require a session cookie (`proxy.ts`).
- Mutating public and auth POSTs require `Origin` matching the request origin, or `Sec-Fetch-Site: same-origin` / `none`. Missing `Origin` is allowed in development/test so automated tests can run.
- Content-Security-Policy and related headers are set in `next.config.ts`. JSON-LD uses inline scripts, so `script-src` includes `'unsafe-inline'`.
- JSON-LD is serialized with `<`, `>`, and `&` escaped to Unicode.
- Honeypot fields return a plausible opaque id (same shape as real records) and do not persist the bot payload.
- Enquiry delete is a **soft delete** (`deletedAt`); lists and the dashboard hide those rows.
- Do not log passwords, session tokens, or resume bodies. Audit metadata is stripped of secret-like keys.

## Known limitations

- **In-memory rate limit:** not shared across processes or serverless instances. Replace with Redis only if you add that dependency later.
- **Resume storage:** job applications store form fields only. File upload was removed so the UI does not imply a CV is kept.
- **Trusted client IP:** production rate limiting may use `x-real-ip` / `x-forwarded-for`. Those headers are only trustworthy behind a proxy that overwrites them.
- **Multi-instance:** session store is Mongo (fine); rate-limit buckets are not.
- **`AUTH_SECRET`:** optional in development/test; **required in production**.
- **Audit log:** written to Mongo; failures are logged without failing the user action.
- **Public GET JSON APIs** (`/api/services`, etc.) remain for the site and tests; they are not a partner API.
- **Media DAM / S3** is out of scope for this MVP.

## Tests

`npm test` covers auth (login/invalid/logout/session/unauthenticated admin API), public form validation, route behaviour (including foreign Origin), invalid ids, and public content mapping. Tests do not print secrets.
