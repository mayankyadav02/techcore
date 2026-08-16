import { getByParamHandler } from "@/lib/api/handlers";
import { getPublicIndustryApi } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export const GET = getByParamHandler(getPublicIndustryApi, "slug");
