"use server";

import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sendTestEmail } from "./email.service";
import { writeAuditLog } from "@/lib/audit";

export async function sendTestEmailAction() {
  try {
    const user = await getSession();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    if (!hasPermission(user.role, "site:write")) {
      return { success: false, error: "Permission denied" };
    }

    const userId = user.id;
    const userEmail = user.email;

    if (!userEmail) {
      return { success: false, error: "Your account does not have an email address." };
    }

    try {
      await enforceRateLimit("test_email", userId);
    } catch (error) {
      return { success: false, error: "Too many test emails sent. Please wait before trying again." };
    }

    const result = await sendTestEmail({ to: userEmail });

    if (result.success) {
      await writeAuditLog({
        actorId: userId,
        action: "email.test",
        resourceType: "Email",
        resourceId: userId,
        metadata: {
          to: userEmail,
          providerId: result.providerId ?? null,
        },
      });
      return { success: true };
    }

    return { success: false, error: "Failed to send test email. Please check your configuration." };
  } catch (error) {
    console.error("sendTestEmailAction error", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
