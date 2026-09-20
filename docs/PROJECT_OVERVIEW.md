# Project Overview

## Product Purpose
TechCore is a comprehensive digital platform designed to serve as both a public marketing presence and a back-office administration tool for a single organization. It streamlines content delivery, lead generation, and applicant tracking into one unified system.

## Target Use Case
TechCore is ideal for agencies, consultancies, and mid-sized enterprises that need a customizable marketing website coupled with a powerful, custom-built CMS to manage their digital assets, inbound leads, and hiring pipeline.

## Current Capabilities

### Public Website
- Dynamic routing for Services, Solutions, Industries, Projects, and Blog posts.
- Careers portal with live job listings and application submission forms.
- Contact and Quote request pipelines.
- Site-wide search functionality using weighted MongoDB text search.
- SEO-optimized with dynamic metadata and OpenGraph images.
- Theming support (Light/Dark mode) with database-driven brand colors.

### Admin CMS
- Secure, role-based dashboard for managing all platform data.
- CRUD interfaces for Catalog items (Services, Solutions, Industries).
- Content management for Blog, Projects, and Testimonials.
- Applicant tracking system for reviewing Job Applications and Resumes.
- Lead management system for incoming Enquiries (Contact/Quote).
- Global site settings configuration (Logo, Navigation, Colors).

### Business Systems
- **Notifications**: Automated transactional emails (Resend) for lead and applicant submissions, notifying both the user and the system administrators.
- **Media Management**: Centralized asset library backed by Vercel Blob.

### Security Systems
- Robust Session-based Authentication.
- Granular Role-Based Access Control (RBAC).
- Zod schema validation.
- MongoDB-backed distributed rate limiting to prevent abuse.
- Form honeypots to deter automated spam.

### Infrastructure
- Next.js App Router on Vercel.
- MongoDB database for structured data and relationships.
- Vercel Blob for object storage.

## Current Architectural Status
**TechCore is currently a SINGLE-TENANT application.** 
All data, settings, and users belong to a single organization. The architecture is modular and clean, allowing for future expansion, but it does not currently support multi-tenancy, SaaS subscriptions, or isolated workspaces for multiple distinct companies.
