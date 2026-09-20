# Search Architecture

## Public Search
TechCore provides a global search functionality on the public website via the `/search` route. 

## Implementation Details
The search logic is located in `modules/search/public.service.ts`.

### Mechanism
It utilizes MongoDB's native `$text` index search capabilities. 

### Indexed Models
The search concurrently queries the following collections:
- `Service`
- `Solution`
- `Industry`
- `Project`
- `BlogPost`
- `Job` (Only returns jobs with `status: "open"`)

For other models, it applies a `status: "published"` and `deletedAt: null` filter to ensure only live content is searchable.

### Ranking and Sorting
- Results are scored using MongoDB's `$meta: "textScore"`.
- It limits results to **10 per model** to prevent payload bloat.
- After fetching from all collections, results are aggregated into a uniform `SearchResult` array.
- The final array is sorted globally by the `textScore` descending.
- A fallback sort by `slug` ascending is applied for identical scores.

### Validation & Security
- Query length is capped to prevent ReDoS or abuse.
- MongoDB errors are caught and a safe empty array is returned to the user, preventing internal error leakage.
