# Database Models

TechCore uses MongoDB via Mongoose. All schemas are defined in `modules/`. TechCore is a Single-Tenant application; models do not have tenant scoping.

## Identity Models
- **User** (`modules/identity/user.model.ts`): Admin accounts. Fields: email (unique), name, passwordHash, role, status.
- **Session** (`modules/identity/session.model.ts`): Active login sessions.
- **PasswordReset** (`modules/identity/password-reset.model.ts`): OTPs for password recovery.
- **Lockout** (`modules/identity/lockout.model.ts`): Tracks failed login attempts for brute-force protection.

## Catalog Models
- **Service** (`modules/catalog/service.model.ts`): Offered services. Fields: title, slug, summary, content, status.
- **Solution** (`modules/catalog/solution.model.ts`): Packaged solutions.
- **Industry** (`modules/catalog/industry.model.ts`): Target industries.

## Work Models
- **Project** (`modules/work/project.model.ts`): Portfolio items / case studies.

## Content Models
- **About** (`modules/content/about.model.ts`): About page content.
- **Home** (`modules/content/home.model.ts`): Homepage content.
- **LegalPage** (`modules/content/legal-page.model.ts`): Privacy policy, terms, etc.
- **Settings** (`modules/content/settings.model.ts`): Global site configuration. Fields: companyName, theme, defaultSeo. *Unique Key: "global"*.
- **PageContent** & **PageSeo**: Shared structures for dynamic pages.

## Insights Models
- **BlogPost** (`modules/insights/blog-post.model.ts`): Articles and news.

## Careers Models
- **Job** (`modules/careers/job.model.ts`): Open positions.
- **Application** (`modules/careers/application.model.ts`): Submitted applications. Fields: jobId, applicant info, `resumeAssetId` (Ref: Media), `gdprConsent`.

## Leads Models
- **Enquiry** (`modules/leads/enquiry.model.ts`): Submitted contact and quote forms. Fields: type ('contact', 'quote'), email, message, `honeypotCaught`, `gdprConsent`.

## Media Models
- **Media** (`modules/media/media.model.ts`): Records of uploaded assets in Vercel Blob.

## Shared/System Models
- **AuditLog** (`modules/shared/audit-log.model.ts`): Immutable log of system actions.
- **RateLimit** (`modules/shared/rate-limit.model.ts`): Distributed rate limiting tracking. Fields: key, count, expiresAt.
- **Testimonial** (`modules/social-proof/testimonial.model.ts`): Customer quotes.
