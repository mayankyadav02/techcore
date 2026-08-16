import { getHandler } from "@/lib/api/handlers";
import { listPublicIndustriesApi } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export const GET = getHandler(listPublicIndustriesApi);
