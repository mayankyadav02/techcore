import { Resend } from "resend";
import { env } from "@/lib/env";
import { getPublicCompany } from "@/modules/content/public.service";
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

function logEmailFailure(context: string, error: unknown, attempt?: number) {
  const detail = error instanceof Error ? error.message : "Unknown email error";
  console.error(
    JSON.stringify({
      level: "error",
      code: "EMAIL_SEND_FAILED",
      context,
      attempt,
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

  const resend = getResendClient();
  if (!resend) {
    return {
      success: false,
      skipped: true,
      error: "Email provider not configured.",
    };
  }

  const MAX_ATTEMPTS = 3;
  let lastError: unknown;
  let attempt = 1;

  for (; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
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
      lastError = error;
      const errorMessage = error instanceof Error ? error.message.toLowerCase() : "";
      
      const isTransient =
        errorMessage.includes("timeout") ||
        errorMessage.includes("fetch failed") ||
        errorMessage.includes("econnreset") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("429") ||
        errorMessage.includes("500") ||
        errorMessage.includes("502") ||
        errorMessage.includes("503") ||
        errorMessage.includes("504");

      if (!isTransient || attempt === MAX_ATTEMPTS) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }

  logEmailFailure(input.context, lastError, attempt);
  return {
    success: false,
    error: lastError instanceof Error ? lastError.message : "Unknown email error",
  };
}

async function dispatchCustomerAndAdminEmails(
  customerInput: { to: string; subject: string; text: string; html: string; context: string },
  adminInput: { to?: string; subject: string; text: string; html: string; context: string },
): Promise<EmailSendResult> {
  const results = await Promise.all([
    sendEmail(customerInput),
    adminInput.to
      ? sendEmail({ ...adminInput, to: adminInput.to })
      : { success: false, skipped: true, error: "Admin email not configured." },
  ]);

  const deliverySucceeded = results.some((result) => result.success);
  return {
    success: deliverySucceeded,
    skipped: results.every((result) => result.skipped),
    error: deliverySucceeded
      ? undefined
      : results.map((result) => result.error).filter(Boolean).join("; ") || undefined,
  };
}

export async function sendContactEnquiryEmails(input: {
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  adminEmail?: string;
}): Promise<EmailSendResult> {
  const company = await getPublicCompany();
  const companyName = company.name;
  const customer = buildContactCustomerEmail({ ...input, companyName });
  const admin = buildContactAdminEmail({ ...input, companyName });
  const adminEmail = input.adminEmail || env.ADMIN_EMAIL;

  return dispatchCustomerAndAdminEmails(
    {
      to: input.customerEmail,
      subject: customer.subject,
      text: customer.text,
      html: customer.html,
      context: "contact.customer",
    },
    {
      to: adminEmail,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
      context: "contact.admin",
    },
  );
}

export async function sendQuoteEnquiryEmails(input: {
  customerName: string;
  customerEmail: string;
  company: string;
  serviceName: string;
  budgetRange: string;
  timeline: string;
  adminEmail?: string;
}): Promise<EmailSendResult> {
  const comp = await getPublicCompany();
  const companyName = comp.name;
  const customer = buildQuoteCustomerEmail({ ...input, companyName });
  const admin = buildQuoteAdminEmail({ ...input, companyName });
  const adminEmail = input.adminEmail || env.ADMIN_EMAIL;

  return dispatchCustomerAndAdminEmails(
    {
      to: input.customerEmail,
      subject: customer.subject,
      text: customer.text,
      html: customer.html,
      context: "quote.customer",
    },
    {
      to: adminEmail,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
      context: "quote.admin",
    },
  );
}

export async function sendApplicationEmails(input: {
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  adminEmail?: string;
}): Promise<EmailSendResult> {
  const comp = await getPublicCompany();
  const companyName = comp.name;
  const customer = buildApplicationCustomerEmail({ ...input, companyName });
  const admin = buildApplicationAdminEmail({ ...input, companyName });
  const adminEmail = input.adminEmail || env.ADMIN_EMAIL;

  return dispatchCustomerAndAdminEmails(
    {
      to: input.applicantEmail,
      subject: customer.subject,
      text: customer.text,
      html: customer.html,
      context: "application.customer",
    },
    {
      to: adminEmail,
      subject: admin.subject,
      text: admin.text,
      html: admin.html,
      context: "application.admin",
    },
  );
}

export async function sendPasswordResetOtpEmail(input: {
  to: string;
  userName: string;
  otp: string;
}): Promise<EmailSendResult> {
  const comp = await getPublicCompany();
  const companyName = comp.name;
  const email = buildPasswordResetOtpEmail({
    userName: input.userName,
    otp: input.otp,
    companyName,
  });
  return sendEmail({
    to: input.to,
    subject: email.subject,
    text: email.text,
    html: email.html,
    context: "auth.password_reset",
  });
}

export async function sendTestEmail(input: {
  to: string;
}): Promise<EmailSendResult> {
  const comp = await getPublicCompany();
  const companyName = comp.name;
  return sendEmail({
    to: input.to,
    subject: `${companyName} Email Configuration Test`,
    text: `This is a test email from the ${companyName} admin panel. If you are receiving this, your email configuration is working correctly.`,
    html: `<p>This is a test email from the ${companyName} admin panel. If you are receiving this, your email configuration is working correctly.</p>`,
    context: "admin.test_email",
  });
}
