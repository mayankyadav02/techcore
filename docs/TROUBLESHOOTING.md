# Troubleshooting

## MongoDB Connection Issues
- **Symptoms**: Application crashes on startup or requests return `INTERNAL_ERROR`.
- **Cause**: Invalid `MONGODB_URI` or the database cluster is unreachable/firewalled.
- **Resolution**: Verify the connection string in `.env.local` or Vercel Environment Variables. Ensure network access is allowed (e.g., MongoDB Atlas IP Whitelist).

## Vercel Blob Issues
- **Symptoms**: Media uploads fail, or images fail to render.
- **Cause**: Vercel Blob is not configured, or the Blob project is not linked.
- **Resolution**: Ensure Vercel Blob is provisioned for the project. For image rendering issues, verify that `*.public.blob.vercel-storage.com` is configured in `next.config.ts` under `images.remotePatterns`.

## Email Delivery Failures
- **Symptoms**: Forms submit successfully, but no emails are received by the customer or admin.
- **Cause**: Missing `RESEND_API_KEY`, unverified `EMAIL_FROM` domain in Resend, or transient network errors.
- **Resolution**: Check the server logs. The `email.service.ts` catches email errors silently to prevent crashing the form submission. Verify Resend domain verification and API key validity. Use the Admin CMS "Test Email" feature to isolate the issue.

## Missing Caching / Stale Content
- **Symptoms**: Content updated in the CMS does not appear on the public website.
- **Cause**: Next.js ISR cache is not invalidating.
- **Resolution**: This can occur in local development due to Next.js treating `localhost` and `127.0.0.1` differently, causing 403s on internal invalidation endpoints. Ensure `allowedDevOrigins` in `next.config.ts` includes your local IP. In production, check Vercel logs for `revalidateTag` errors.
