import { handleRouteError, jsonSuccess } from "@/lib/api/http";
import { assertSameOrigin, clientKey, readJson } from "@/lib/api/request";
import { enforceRateLimit } from "@/lib/rate-limit";
import { contactApiSchema } from "@/modules/leads/schema";
import { createContactEnquiry } from "@/modules/leads/enquiry.service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit("contact", clientKey(request));
    const body = await readJson(request, contactApiSchema);
    const data = await createContactEnquiry(body);
    return jsonSuccess(
      data,
      "Thank you. Your message has been received.",
      201,
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
