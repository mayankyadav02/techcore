import { getHandler } from "@/lib/api/handlers";
import { listPublicJobsApi } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export const GET = getHandler(listPublicJobsApi);
