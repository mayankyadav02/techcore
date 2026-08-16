import { handleRouteError, jsonSuccess } from "@/lib/api/http";
import { listPublicPostsApi } from "@/lib/public-api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const category = new URL(request.url).searchParams.get("category") ?? undefined;
    const data = await listPublicPostsApi(category || undefined);
    return jsonSuccess(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
