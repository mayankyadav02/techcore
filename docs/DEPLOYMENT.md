# Deployment Architecture

## Target Environment
TechCore is optimized for deployment on **Vercel**, taking full advantage of Next.js serverless functions, Edge caching (ISR), and Vercel Blob storage.

## Build Process
1. `npm install`: Installs dependencies.
2. `npm run build`: Executes the Next.js production build (`next build`). This creates optimized production bundles and static assets.

## Runtime Dependencies
To successfully run in production, TechCore requires:
1. **MongoDB**: A hosted MongoDB cluster (e.g., MongoDB Atlas) accessible via the `MONGODB_URI`.
2. **Vercel Blob**: A configured Vercel Blob store linked to the Vercel project for media uploads.
3. **Resend**: A valid `RESEND_API_KEY` for email notifications.

## Environment Configuration
All variables listed in `ENVIRONMENT.md` must be configured in the production environment (e.g., Vercel Project Settings) prior to deployment. `APP_URL` must accurately reflect the production domain.

## Production Considerations
- **Cold Starts**: Database connections are pooled in `lib/db.ts` to mitigate serverless cold start issues with MongoDB.
- **Cache Invalidation**: The CMS relies on Server Actions triggering `revalidateTag` to update the Edge Cache. Ensure Vercel's caching layer is operating normally.
