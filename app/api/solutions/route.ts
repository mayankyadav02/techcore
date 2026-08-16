import { getHandler } from "@/lib/api/handlers";
import { listPublicSolutionsApi } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export const GET = getHandler(listPublicSolutionsApi);
