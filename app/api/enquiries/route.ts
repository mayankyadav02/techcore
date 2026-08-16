import { handleRouteError, jsonSuccess } from "@/lib/api/http";
import { assertSameOrigin, clientKey, readJson } from "@/lib/api/request";
import { enforceRateLimit } from "@/lib/rate-limit";
import { enquiryApiSchema } from "@/modules/leads/schema";
import { createQuoteEnquiry } from "@/modules/leads/enquiry.service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit("enquiry", clientKey(request));
    const body = await readJson(request, enquiryApiSchema);
    const data = await createQuoteEnquiry(body);
    return jsonSuccess(
      data,
      "Thank you. Your project enquiry has been received.",
      201,
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
