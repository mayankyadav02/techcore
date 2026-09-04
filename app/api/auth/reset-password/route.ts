import { z } from "zod";
import { handleRouteError, jsonSuccess } from "@/lib/api/http";
import { assertSameOrigin, clientKey, readJson } from "@/lib/api/request";
import { enforceRateLimit } from "@/lib/rate-limit";
import { adminPasswordSchema } from "@/modules/identity/schema";
import { resetPasswordWithOtp } from "@/modules/identity/password-reset.service";

export const dynamic = "force-dynamic";

const schema = z.object({
  email: z.string().email("Enter a valid email address").toLowerCase(),
  otp: z
    .string()
    .length(6, "Enter the 6-digit code")
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
  newPassword: adminPasswordSchema,
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit("reset_password", clientKey(request));

    const body = await readJson(request, schema);

    await resetPasswordWithOtp({
      email: body.email,
      otp: body.otp,
      newPassword: body.newPassword,
    });

    return jsonSuccess({}, "Password reset successfully. Please sign in.");
  } catch (error) {
    return handleRouteError(error);
  }
}
