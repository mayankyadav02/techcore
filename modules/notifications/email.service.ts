import { Resend } from "resend";
import { env } from "@/lib/env";
import {
  buildApplicationAdminEmail,
  buildApplicationCustomerEmail,
  buildContactAdminEmail,
  buildContactCustomerEmail,
  buildPasswordResetOtpEmail,
  buildQuoteAdminEmail,
  buildQuoteCustomerEmail,
} from "@/modules/notifications/templates";

type ResendClient = {
  emails: {
    send: (payload: {
      from: string;
      to: string[];
      subject: string;
      text: string;
      html: string;
    }) => Promise<{ data?: { id?: string } | null; error?: { message?: string } | null }>;
  };
};

declare global {
  var __techcoreResendClient: ResendClient | undefined;
}

function getResendClient(): ResendClient | undefined {
  if (globalThis.__techcoreResendClient) {
    return globalThis.__techcoreResendClient;
  }

  if (!env.RESEND_API_KEY) {
    return undefined;
  }

  return new Resend(env.RESEND_API_KEY) as unknown as ResendClient;
}

export type EmailSendResult = {
  success: boolean;
  skipped?: boolean;
  providerId?: string;
  error?: string;
};

function logEmailFailure(context: string, error: unknown) {
  const detail = error instanceof Error ? error.message : "Unknown email error";
  console.error(
    JSON.stringify({
      level: "error",
      code: "EMAIL_SEND_FAILED",
      context,
      message: detail,
    }),
  );
}

async function sendEmail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
  context: string;
}): Promise<EmailSendResult> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    console.warn(
      JSON.stringify({
        level: "warn",
        code: "EMAIL_NOT_CONFIGURED",
        context: input.context,
      }),
    );
    return { success: false, skipped: true, error: "Email provider not configured." };
  }

  try {
    const resend = getResendClient();
    if (!resend) {
      return {
        success: false,
        skipped: true,
        error: "Email provider not configured.",
      };
    }

    const response = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [input.to],
      subject: input.subject,
      text: input.text,
      html: input.html,
    });

    if (response.error) {
      throw new Error(response.error.message || "Resend rejected the message.");
    }

    return {
      success: true,
      providerId: response.data?.id,
    };
  } catch (error) {
    logEmailFailure(input.context, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    };
  }
}

export async function sendContactEnquiryEmails(input: {
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
}): Promise<EmailSendResult> {
  const customer = buildContactCustomerEmail(input);
  const admin = buildContactAdminEmail(input);
  const adminEmail = env.ADMIN_EMAIL;

  const results = await Promise.all([
    sendEmail({
      to: input.customerEmail,
      subject: customer.subject,
      text: customer.text,
      html: customer.html,
      context: "contact.customer",
    }),
    adminEmail
      ? sendEmail({
          to: adminEmail,
          subject: admin.subject,
          text: admin.text,
          html: admin.html,
          context: "contact.admin",
        })
      : { success: false, skipped: true, error: "Admin email not configured." },
  ]);

  const deliverySucceeded = results.some((result) => result.success);
  return {
    success: deliverySucceeded,
    skipped: results.every((result) => result.skipped),
    error: deliverySucceeded ? undefined : results.map((result) => result.error).filter(Boolean).join("; ") || undefined,
  };
}

export async function sendQuoteEnquiryEmails(input: {
  customerName: string;
  customerEmail: string;
  company: string;
  serviceName: string;
  budgetRange: string;
  timeline: string;
}): Promise<EmailSendResult> {
  const customer = buildQuoteCustomerEmail(input);
  const admin = buildQuoteAdminEmail(input);
  const adminEmail = env.ADMIN_EMAIL;

  const results = await Promise.all([
    sendEmail({
      to: input.customerEmail,
      subject: customer.subject,
      text: customer.text,
      html: customer.html,
      context: "quote.customer",
    }),
    adminEmail
      ? sendEmail({
          to: adminEmail,
          subject: admin.subject,
          text: admin.text,
          html: admin.html,
          context: "quote.admin",
        })
      : { success: false, skipped: true, error: "Admin email not configured." },
  ]);

  const deliverySucceeded = results.some((result) => result.success);
  return {
    success: deliverySucceeded,
    skipped: results.every((result) => result.skipped),
    error: deliverySucceeded ? undefined : results.map((result) => result.error).filter(Boolean).join("; ") || undefined,
  };
}

export async function sendApplicationEmails(input: {
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
}): Promise<EmailSendResult> {
  const customer = buildApplicationCustomerEmail(input);
  const admin = buildApplicationAdminEmail(input);
  const adminEmail = env.ADMIN_EMAIL;

  const results = await Promise.all([
    sendEmail({
      to: input.applicantEmail,
      subject: customer.subject,
      text: customer.text,
      html: customer.html,
      context: "application.customer",
    }),
    adminEmail
      ? sendEmail({
          to: adminEmail,
          subject: admin.subject,
          text: admin.text,
          html: admin.html,
          context: "application.admin",
        })
      : { success: false, skipped: true, error: "Admin email not configured." },
  ]);

  const deliverySucceeded = results.some((result) => result.success);
  return {
    success: deliverySucceeded,
    skipped: results.every((result) => result.skipped),
    error: deliverySucceeded ? undefined : results.map((result) => result.error).filter(Boolean).join("; ") || undefined,
  };
}

export async function sendPasswordResetOtpEmail(input: {
  to: string;
  userName: string;
  otp: string;
}): Promise<EmailSendResult> {
  const email = buildPasswordResetOtpEmail({
    userName: input.userName,
    otp: input.otp,
  });
  return sendEmail({
    to: input.to,
    subject: email.subject,
    text: email.text,
    html: email.html,
    context: "auth.password_reset",
  });
}
