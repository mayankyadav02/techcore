# Directory Structure

## Overview
```
techcore/
├── app/             # Next.js App Router (Routing & Layouts)
├── components/      # Reusable React UI Components
├── lib/             # Shared Utilities (Auth, DB, Security)
├── modules/         # Domain-Driven Business Logic & Models
├── public/          # Static Assets
├── scripts/         # Utility/Seed Scripts
├── tests/           # Test Suite
└── types/           # Global TypeScript Declarations
```

## `app/`
**Purpose**: Defines the routing structure, layouts, pages, and API endpoints of the application using the Next.js App Router.
- **What belongs here**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`.
- **What should NOT be placed here**: Complex business logic, database queries, or reusable UI components.
- **Important files**: `app/layout.tsx` (Global layout, theme injection), `app/(admin)/admin/layout.tsx` (CMS shell, auth enforcement).

## `components/`
**Purpose**: Contains reusable React components.
- **What belongs here**: UI primitives (Buttons, Inputs), complex interactive islands, layout shells (Navbar, Footer, Sidebar).
- **What should NOT be placed here**: Direct database access or domain-specific business logic.

## `lib/`
**Purpose**: Core application infrastructure and cross-cutting utilities.
- **What belongs here**: Database connection logic, authentication helpers, authorization (RBAC) maps, rate limiting logic, error classes.
- **Important files**: `auth.ts`, `rbac.ts`, `db.ts`, `rate-limit.ts`.

## `modules/`
**Purpose**: The heart of the application. Business logic grouped by domain.
- **What belongs here**: Mongoose models (`*.model.ts`), service functions for data fetching/mutation (`*.service.ts`), Server Actions (`actions.ts`).
- **What should NOT be placed here**: React UI components or Next.js route handlers.
- **Important Domains**:
  - `identity/`: User, Session, Authentication logic.
  - `content/`: Pages, Settings, SEO.
  - `leads/`: Contact & Quote Enquiries.
  - `careers/`: Jobs & Applications.
  - `notifications/`: Email service and templates.

## `tests/`
**Purpose**: Application test suite using the native Node.js test runner.
- **What belongs here**: Unit tests, integration tests (`*.test.ts`).
- **Important files**: `auth.test.ts`, `routes.test.ts`, `validation.test.ts`.
