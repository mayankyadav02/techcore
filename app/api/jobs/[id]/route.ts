import { getByParamHandler } from "@/lib/api/handlers";
import { getPublicJobApi } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export const GET = getByParamHandler(getPublicJobApi, "id");
