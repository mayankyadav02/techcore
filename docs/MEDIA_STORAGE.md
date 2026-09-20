# Media & Storage

## Vercel Blob Integration
TechCore utilizes Vercel Blob for all object storage. The integration is wrapped in `modules/media/blob.ts`. 

## Media Model
Every uploaded file is recorded in the MongoDB `Media` collection (`modules/media/media.model.ts`). This allows the CMS to display a media library, track usage, and manage deletions.

## Public Media
- **Usage**: Images for Blog Posts, Services, Logos, and generic site assets.
- **Upload Flow**: Admins upload via the CMS Media Library. A `Media` record is created, and the file is stored in Vercel Blob with public access.
- **Access**: Publicly accessible via Vercel Blob URLs. The `next.config.ts` allows `*.public.blob.vercel-storage.com` for Next.js Image optimization.

## Private Applicant Resumes
- **Usage**: PDF/DOC/DOCX resumes uploaded by applicants via the Careers page.
- **Upload Flow**: Uploaded via the public `/api/jobs/[id]/apply` route.
- **Storage Strategy**: Resumes are explicitly uploaded using Vercel Blob's `access: "private"` configuration. The raw Blob URL is not publicly accessible. The blob is linked to the `Application` record via `resumeAssetId`.
- **Admin Access**: Admin access is mediated through a secure, authenticated proxy route: `app/api/admin/applications/[id]/resume/route.ts`.
- **Authorization**: The proxy route enforces the `requirePermission("leads:read")` check.
- **Retrieval Mechanism**: The server securely fetches the private Blob using its internal token and streams the file directly to the authorized client as an attachment. Signed URLs are NOT used, as the proxy strictly handles the security boundary.

## Deletion
When a `Media` record is deleted from the CMS, the corresponding asset in Vercel Blob should also be deleted via the `del` method in the Blob wrapper.
