# Feature Inventory

## Home
- **Purpose**: Landing page.
- **Availability**: Public.
- **Implementation**: `app/(public)/page.tsx`, `modules/content/home.model.ts`.

## About
- **Purpose**: Company information page.
- **Availability**: Public.
- **Implementation**: `app/(public)/about/page.tsx`, `modules/content/about.model.ts`.

## Services, Solutions, Industries, Projects
- **Purpose**: Catalog and portfolio presentation.
- **Availability**: Public (List & Detail views) & Admin (CRUD).
- **Implementation**: `modules/catalog/`, `modules/work/`, `app/(public)/[type]/`, `app/(admin)/admin/[type]/`.

## Blog
- **Purpose**: Content marketing and insights.
- **Availability**: Public (List & Detail views) & Admin (CRUD).
- **Implementation**: `modules/insights/blog-post.model.ts`.

## Careers & Applications
- **Purpose**: Job listings and applicant tracking.
- **Availability**: Public (Job Listings, Application Form) & Admin (Job CRUD, Application Review).
- **Implementation**: `modules/careers/job.model.ts`, `modules/careers/application.model.ts`.
- **Important Routes**: `app/api/jobs/[id]/apply/route.ts`.

## Contact & Quote (Enquiries)
- **Purpose**: Lead generation pipelines.
- **Availability**: Public (Forms) & Admin (Lead Management).
- **Implementation**: `modules/leads/enquiry.model.ts`.

## Search
- **Purpose**: Global site search.
- **Availability**: Public (`/search`).
- **Implementation**: `modules/search/public.service.ts`.

## Legal Pages
- **Purpose**: Privacy Policy, Terms of Service.
- **Availability**: Public & Admin (Edit).
- **Implementation**: `modules/content/legal-page.model.ts`.

## Testimonials
- **Purpose**: Social proof display.
- **Availability**: Public (Rendered on pages) & Admin (CRUD).
- **Implementation**: `modules/social-proof/testimonial.model.ts`.

## Settings & Theme
- **Purpose**: Global white-labeling and site configuration.
- **Availability**: Admin (Edit global settings).
- **Implementation**: `modules/content/settings.model.ts`, `lib/theme.ts`, `app/layout.tsx`.

## Media
- **Purpose**: Asset management.
- **Availability**: Admin (Upload/Delete). Public (View via Blob URL).
- **Implementation**: `modules/media/media.model.ts`, `modules/media/blob.ts`.

## Users
- **Purpose**: Admin account management.
- **Availability**: Admin (Super Admin only).
- **Implementation**: `modules/identity/user.model.ts`.

## Audit Logs
- **Purpose**: Security and action tracking.
- **Availability**: Admin (Read-only view).
- **Implementation**: `modules/shared/audit-log.model.ts`.

## Email
- **Purpose**: Transactional notifications.
- **Availability**: Internal Service.
- **Implementation**: `modules/notifications/email.service.ts`.

## SEO
- **Purpose**: Metadata management.
- **Availability**: System-wide.
- **Implementation**: `app/layout.tsx`, `modules/content/page-seo.model.ts`.
