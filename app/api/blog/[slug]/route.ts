import { getByParamHandler } from "@/lib/api/handlers";
import { getPublicPostApi } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export const GET = getByParamHandler(getPublicPostApi, "slug");
