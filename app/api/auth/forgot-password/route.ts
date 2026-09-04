import { z } from "zod";
import { handleRouteError, jsonSuccess } from "@/lib/api/http";
import { assertSameOrigin, clientKey, readJson } from "@/lib/api/request";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createPasswordResetOtp } from "@/modules/identity/password-reset.service";
import { sendPasswordResetOtpEmail } from "@/modules/notifications/email.service";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email("Enter a valid email address").toLowerCase(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit("forgot_password", clientKey(request));

    const body = await readJson(request, schema);

    // Attempt to create OTP — returns null if user not found/ineligible
    const result = await createPasswordResetOtp(body.email);

    // Send OTP email if user was found; otherwise skip silently
    if (result) {
      await sendPasswordResetOtpEmail({
        to: body.email,
        userName: result.userName,
        otp: result.otp,
      });
    }

    // Always return identical response to prevent account enumeration
    return jsonSuccess(
      {},
      "If that email is registered, a reset code has been sent.",
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
