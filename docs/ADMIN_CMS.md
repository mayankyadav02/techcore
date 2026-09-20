# Admin CMS Guide

## Route Structure
The Admin CMS is isolated under the `app/(admin)/admin` route group.
- **Login**: `app/(admin)/admin/login/page.tsx`
- **Dashboard**: `app/(admin)/admin/(console)/dashboard/page.tsx`
- **Modules**: `app/(admin)/admin/(console)/[module]/...`

## Core Concepts
The CMS provides a secure interface for managing the platform's data. Access to specific modules is governed by granular permissions mapped to the user's role.

## Modules

### Dashboard
- **Capabilities**: View high-level metrics and recent activity.
- **Permissions**: `dashboard:read`

### Content Management (Blog, Projects, Services, Solutions, Industries, Legal, Testimonials)
- **Capabilities**: Create, read, update, delete, publish, and unpublish content.
- **Permissions**: `content:read`, `content:write`, `content:publish`, `testimonials:read`, `testimonials:write`.
- **Related Models**: `BlogPost`, `Project`, `Service`, `Solution`, `Industry`, `LegalPage`, `Testimonial`.

### Careers & Applications
- **Capabilities**: Manage Job postings and review submitted Applications.
- **Permissions**: Requires appropriate content/lead permissions (mapped internally).
- **Security**: Applications contain PII and Resume blobs.

### Enquiries
- **Capabilities**: View and manage Contact and Quote submissions.
- **Permissions**: `leads:read`, `leads:write`.
- **Related Models**: `Enquiry`.

### Media
- **Capabilities**: Upload and delete generic assets from Vercel Blob.
- **Permissions**: Mapped to content writing permissions.
- **Related Models**: `Media`.

### Users
- **Capabilities**: Manage admin accounts, roles, and status (Active/Suspended).
- **Permissions**: `users:read`, `users:write`, `users:delete` (Typically `super_admin` only).
- **Related Models**: `User`.

### Settings
- **Capabilities**: Modify global site configuration, theme colors, navigation, and footer.
- **Permissions**: `settings:read`, `settings:write`, `site:write`.
- **Related Models**: `Settings`.

### Audit Logs
- **Capabilities**: View immutable system action logs.
- **Permissions**: `audit_logs:read`.
- **Related Models**: `AuditLog`.
