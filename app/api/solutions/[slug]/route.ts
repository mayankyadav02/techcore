import { getByParamHandler } from "@/lib/api/handlers";
import { getPublicSolutionApi } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export const GET = getByParamHandler(getPublicSolutionApi, "slug");
