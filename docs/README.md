# TechCore Documentation

Welcome to the TechCore project documentation.

## What is TechCore?
TechCore is a single-tenant, full-stack Next.js web application encompassing a public-facing website and an internal Administrative Content Management System (CMS). It provides a complete digital presence solution with content management, job applications, lead generation, and dynamic theming.

## Current Architecture
TechCore is built using the Next.js App Router. It follows a modular architecture separating public routes from administrative routes, and grouping business logic into domain-specific modules. 

## Technology Stack
- **Framework:** Next.js 16.3.1 (App Router)
- **Frontend:** React 19, Tailwind CSS 4, Framer Motion
- **Database:** MongoDB via Mongoose 9.9.2
- **Authentication:** Custom session-based cookie authentication
- **Storage:** Vercel Blob
- **Email:** Resend
- **Validation:** Zod
- **Testing:** Node.js native test runner (`tsx --test`)

## Documentation Map

### Getting Started & Overview
- [Project Overview](./PROJECT_OVERVIEW.md)
- [Development Guide](./DEVELOPMENT.md)
- [AI Context (For Agents)](./AI_CONTEXT.md)

### Architecture
- [Architecture Details](./ARCHITECTURE.md)
- [Directory Structure](./DIRECTORY_STRUCTURE.md)
- [Database Models](./DATABASE.md)
- [API & Server Actions](./API.md)

### Features & Systems
- [Features Inventory](./FEATURES.md)
- [Admin CMS Guide](./ADMIN_CMS.md)
- [Authentication & RBAC](./AUTH_RBAC.md)
- [Search System](./SEARCH.md)
- [Media & Storage](./MEDIA_STORAGE.md)
- [Email & Notifications](./EMAIL.md)

### Operations & Quality
- [Security Architecture](./SECURITY.md)
- [SEO Implementation](./SEO.md)
- [Performance & Caching](./PERFORMANCE.md)
- [Testing](./TESTING.md)
- [Environment Variables](./ENVIRONMENT.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Future Roadmap](./ROADMAP.md)
