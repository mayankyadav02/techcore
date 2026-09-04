import { env } from "@/lib/env";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatList(items: Array<[string, string]>) {
  return items
    .map(([label, value]) => `<li><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`)
    .join("");
}

export function buildContactCustomerEmail(input: {
  customerName: string;
  subject: string;
  message: string;
}) {
  const subject = `Thanks for contacting TechCore — ${input.subject}`;
  const text = [
    `Hi ${input.customerName},`,
    "",
    "Thanks for reaching out to TechCore.",
    "We have received your message and a member of the team will review it shortly.",
    "",
    `Subject: ${input.subject}`,
    "Message:",
    input.message,
    "",
    "Regards,",
    "The TechCore team",
    env.APP_URL || "https://localhost:3000",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 12px;">Thanks for contacting TechCore</h2>
      <p>Hi ${escapeHtml(input.customerName)},</p>
      <p>Thanks for reaching out. We have received your message and a member of the team will review it shortly.</p>
      <p><strong>Subject:</strong> ${escapeHtml(input.subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(input.message).replace(/\n/g, "<br />")}</p>
      <p>Regards,<br />The TechCore team</p>
    </div>
  `;

  return { subject, text, html };
}

export function buildContactAdminEmail(input: {
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
}) {
  const subject = `New contact enquiry: ${input.subject}`;
  const text = [
    "New contact enquiry received.",
    "",
    `Name: ${input.customerName}`,
    `Email: ${input.customerEmail}`,
    `Subject: ${input.subject}`,
    "",
    "Message:",
    input.message,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 12px;">New contact enquiry</h2>
      <ul style="padding-left: 18px; margin: 0 0 16px;">
        ${formatList([
          ["Name", input.customerName],
          ["Email", input.customerEmail],
          ["Subject", input.subject],
        ])}
      </ul>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(input.message).replace(/\n/g, "<br />")}</p>
    </div>
  `;

  return { subject, text, html };
}

export function buildQuoteCustomerEmail(input: {
  customerName: string;
  company: string;
  serviceName: string;
  budgetRange: string;
  timeline: string;
}) {
  const subject = `Thanks for your quote request`;
  const text = [
    `Hi ${input.customerName},`,
    "",
    "Thanks for requesting a quote from TechCore.",
    "We have received your enquiry and a member of the team will review the brief shortly.",
    "",
    `Company: ${input.company}`,
    `Service: ${input.serviceName}`,
    `Budget: ${input.budgetRange}`,
    `Timeline: ${input.timeline}`,
    "",
    "Regards,",
    "The TechCore team",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 12px;">Thanks for your quote request</h2>
      <p>Hi ${escapeHtml(input.customerName)},</p>
      <p>Thanks for requesting a quote from TechCore. We have received your enquiry and a member of the team will review the brief shortly.</p>
      <ul style="padding-left: 18px; margin: 0 0 16px;">
        ${formatList([
          ["Company", input.company],
          ["Service", input.serviceName],
          ["Budget", input.budgetRange],
          ["Timeline", input.timeline],
        ])}
      </ul>
      <p>Regards,<br />The TechCore team</p>
    </div>
  `;

  return { subject, text, html };
}

export function buildQuoteAdminEmail(input: {
  customerName: string;
  customerEmail: string;
  company: string;
  serviceName: string;
  budgetRange: string;
  timeline: string;
}) {
  const subject = `New quote enquiry: ${input.serviceName}`;
  const text = [
    "New quote enquiry received.",
    "",
    `Name: ${input.customerName}`,
    `Email: ${input.customerEmail}`,
    `Company: ${input.company}`,
    `Service: ${input.serviceName}`,
    `Budget: ${input.budgetRange}`,
    `Timeline: ${input.timeline}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 12px;">New quote enquiry</h2>
      <ul style="padding-left: 18px; margin: 0 0 16px;">
        ${formatList([
          ["Name", input.customerName],
          ["Email", input.customerEmail],
          ["Company", input.company],
          ["Service", input.serviceName],
          ["Budget", input.budgetRange],
          ["Timeline", input.timeline],
        ])}
      </ul>
    </div>
  `;

  return { subject, text, html };
}

export function buildApplicationCustomerEmail(input: {
  applicantName: string;
  jobTitle: string;
}) {
  const subject = `Application received for ${input.jobTitle}`;
  const text = [
    `Hi ${input.applicantName},`,
    "",
    "Thanks for applying to TechCore.",
    `We have received your application for ${input.jobTitle} and will review it shortly.`,
    "",
    "Regards,",
    "The TechCore team",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 12px;">Application received</h2>
      <p>Hi ${escapeHtml(input.applicantName)},</p>
      <p>Thanks for applying to TechCore. We have received your application for ${escapeHtml(input.jobTitle)} and will review it shortly.</p>
      <p>Regards,<br />The TechCore team</p>
    </div>
  `;

  return { subject, text, html };
}

export function buildApplicationAdminEmail(input: {
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
}) {
  const subject = `New job application: ${input.jobTitle}`;
  const text = [
    "New job application received.",
    "",
    `Name: ${input.applicantName}`,
    `Email: ${input.applicantEmail}`,
    `Role: ${input.jobTitle}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 12px;">New job application</h2>
      <ul style="padding-left: 18px; margin: 0 0 16px;">
        ${formatList([
          ["Name", input.applicantName],
          ["Email", input.applicantEmail],
          ["Role", input.jobTitle],
        ])}
      </ul>
    </div>
  `;

  return { subject, text, html };
}
