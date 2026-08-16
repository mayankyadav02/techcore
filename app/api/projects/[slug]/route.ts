import { getByParamHandler } from "@/lib/api/handlers";
import { getPublicProjectApi } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export const GET = getByParamHandler(getPublicProjectApi, "slug");
