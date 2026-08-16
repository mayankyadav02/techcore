import { getHandler } from "@/lib/api/handlers";
import { listPublicServicesApi } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export const GET = getHandler(listPublicServicesApi);
