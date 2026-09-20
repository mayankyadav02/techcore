# Roadmap

## CURRENTLY IMPLEMENTED

### Public Website
- Dynamic routing for Services, Solutions, Industries, Projects, and Blog posts.
- Complete SEO optimization (Metadata, Sitemap, Robots, OpenGraph).
- Vercel Blob optimized images.
- System/Light/Dark mode theming.
- Public Search using MongoDB `$text`.
- Careers portal and job applications.
- Contact and Quote enquiry pipelines.

### Admin CMS
- Secure, custom session-based Authentication.
- Granular Role-Based Access Control (RBAC).
- Complete CRUD operations for all public content models.
- Media management library.
- Global Settings configuration (Single-Tenant).
- Immutable Audit Logs.

### Infrastructure & Security
- MongoDB distributed rate limiting.
- Zod validation and silent honeypots.
- Resend transactional emails.
- Private Applicant Resume Storage (secured via `access: "private"` and authenticated proxy endpoints).

## FUTURE (NOT IMPLEMENTED)

### Multi-Tenancy (SaaS Architecture)
- **Multi-tenancy is NOT currently implemented.** TechCore is strictly a single-tenant application.
- **Future Architectural Direction**: If TechCore transitions to a SaaS model, substantial database schema changes will be required. Every model will need a `tenantId`, the `Settings` model will need to scope beyond the `global` key, and the authentication system will need to handle tenant isolation and user-to-tenant mapping.
- **Billing & Subscriptions**: Currently non-existent. Would require Stripe/Paddle integration alongside multi-tenant boundaries.

### Advanced Analytics
- Built-in analytics dashboard beyond basic counts.
