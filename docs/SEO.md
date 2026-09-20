# SEO Implementation

## Next.js Metadata API
TechCore leverages the native Next.js Metadata API for SEO optimization. 
- **Global Layout**: `app/layout.tsx` generates default metadata (Title, Description) dynamically sourced from the `Settings` collection in the database.

## PageSeo Model
A dedicated `PageSeo` subdocument/model is used across content types (Services, Blog Posts, Custom Pages) to allow CMS administrators to override default SEO settings per page.

## OpenGraph
Dynamic OpenGraph image generation is implemented using Next.js `ImageResponse` via `app/opengraph-image.tsx`. This generates standardized social sharing images based on the site's brand settings.

## Sitemap and Robots
- `app/sitemap.ts`: Dynamically generates `sitemap.xml` by querying published content from MongoDB, ensuring search engines index all active public pages.
- `app/robots.ts`: Dynamically generates `robots.txt`, allowing crawling of public routes and explicitly disallowing the `/admin` path.

## Canonical URLs
Base canonical URLs are generated using the `APP_URL` environment variable.
