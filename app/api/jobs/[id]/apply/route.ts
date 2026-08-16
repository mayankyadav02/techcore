import { handleRouteError, jsonSuccess } from "@/lib/api/http";
import { opaqueRecordId } from "@/lib/api/ids";
import {
  assertSameOrigin,
  clientKey,
  parseSchema,
  readFormData,
} from "@/lib/api/request";
import { enforceRateLimit } from "@/lib/rate-limit";
import { applicationApiSchema } from "@/modules/leads/schema";
import { createApplication } from "@/modules/careers/application.service";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit("apply", clientKey(request));
    const { id } = await context.params;
    const form = await readFormData(request);
    const consent = form.get("gdprConsent");
    const input = parseSchema(applicationApiSchema, {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      coverLetter: String(form.get("coverLetter") ?? ""),
      website: String(form.get("website") ?? ""),
      gdprConsent: consent === "true" || consent === "on",
    });

    if (input.website) {
      return jsonSuccess(
        { id: opaqueRecordId() },
        "Thank you. Your application has been received.",
        201,
      );
    }

    const data = await createApplication(id, input);
    return jsonSuccess(
      data,
      "Thank you. Your application has been received.",
      201,
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
