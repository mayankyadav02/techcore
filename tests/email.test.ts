import assert from "node:assert/strict";
import { afterEach, before, describe, it } from "node:test";

process.env.RESEND_API_KEY ??= "test_resend_key";
process.env.EMAIL_FROM ??= "TechCore <noreply@example.com>";
process.env.ADMIN_EMAIL ??= "admin@example.com";

const sendCalls: Array<{ to: string[] | string; subject: string }> = [];
const sendMock = async (payload: { to: string[] | string; subject: string }) => {
  sendCalls.push(payload);
  return {
    data: { id: `resend_${Array.isArray(payload.to) ? payload.to.join("-") : payload.to}` },
    error: null,
  };
};

(globalThis as typeof globalThis & {
  __techcoreResendClient?: { emails: { send: typeof sendMock } };
}).__techcoreResendClient = {
  emails: { send: sendMock },
};

let emailService: typeof import("../modules/notifications/email.service");

describe("transactional email service", () => {
  before(async () => {
    emailService = await import("../modules/notifications/email.service");
  });

  afterEach(() => {
    sendCalls.length = 0;
  });

  it("sends a customer confirmation and admin alert for a contact enquiry", async () => {
    const result = await emailService.sendContactEnquiryEmails({
      customerName: "Ada Lovelace",
      customerEmail: "ada@example.com",
      subject: "Website question",
      message: "I would like a quick product walkthrough.",
    });

    assert.equal(result.success, true);
    assert.equal(sendCalls.length, 2);
    const recipients = sendCalls
      .map((payload) => (Array.isArray(payload.to) ? payload.to : [payload.to]))
      .flat();
    assert.deepEqual(recipients, ["ada@example.com", "admin@example.com"]);
  });

  it("sends a customer confirmation and admin alert for a quote enquiry", async () => {
    const result = await emailService.sendQuoteEnquiryEmails({
      customerName: "Grace Hopper",
      customerEmail: "grace@example.com",
      company: "Hopper Systems",
      serviceName: "Web Development",
      budgetRange: "50-150k",
      timeline: "1-3-months",
    });

    assert.equal(result.success, true);
    assert.equal(sendCalls.length, 2);
  });

  it("sends confirmation and admin notification for a job application", async () => {
    const result = await emailService.sendApplicationEmails({
      applicantName: "Linus Torvalds",
      applicantEmail: "linus@example.com",
      jobTitle: "Senior Engineer",
    });

    assert.equal(result.success, true);
    assert.equal(sendCalls.length, 2);
  });
});
