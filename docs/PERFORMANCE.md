# Performance Architecture

## Next.js Caching & ISR
TechCore heavily utilizes Next.js App Router caching mechanisms for public-facing content. 

- **Incremental Static Regeneration (ISR)**: Public pages are statically rendered where possible. 
- **Cache Tags**: `lib/cache-tags.ts` defines constants for cache tagging (e.g., `services`, `settings`, `media`).
- **Revalidation**: When content is modified via a CMS Server Action, `revalidatePublic()` is called with the appropriate tags. This utilizes `revalidateTag` and `revalidatePath` to instantly purge the stale cache, ensuring visitors see updated content without requiring a full rebuild.

## Image Optimization
- Next.js `<Image />` component is used for optimizing assets.
- `next.config.ts` allows external image optimization directly from the `*.public.blob.vercel-storage.com` domain.

## Database Querying
- Public queries use `.lean()` in Mongoose (e.g., in `modules/search/public.service.ts`) to bypass Mongoose document hydration overhead when only plain JSON data is needed for rendering.
- Indexes are heavily utilized on query paths (e.g., `status`, `deletedAt`, `$text`).
