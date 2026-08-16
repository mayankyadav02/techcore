import { getHandler } from "@/lib/api/handlers";
import { listPublicProjectsApi } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export const GET = getHandler(listPublicProjectsApi);
