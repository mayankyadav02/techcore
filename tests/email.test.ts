import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";

process.env.RESEND_API_KEY ??= "test_resend_key";
process.env.EMAIL_FROM ??= "TechCore <noreply@example.com>";
process.env.ADMIN_EMAIL ??= "admin@example.com";

const sendCalls: Array<{ to: string[] | string; subject: string }> = [];
let mockFailures: Array<Error | { message: string }> = [];

const sendMock = async (payload: { to: string[] | string; subject: string }) => {
  sendCalls.push(payload);

  const failure = mockFailures.shift();
  if (failure) {
    if (failure instanceof Error) {
      throw failure;
    }
    return { data: null, error: failure };
  }

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
  let originalSetTimeout: typeof global.setTimeout;

  before(async () => {
    emailService = await import("../modules/notifications/email.service");
    originalSetTimeout = global.setTimeout;
    (global.setTimeout as any) = (cb: Function) => originalSetTimeout(cb, 0);
  });

  afterEach(() => {
    sendCalls.length = 0;
    mockFailures = [];
  });

  after(() => {
    global.setTimeout = originalSetTimeout;
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

  it("retries transient failures up to 3 times and succeeds", async () => {
    mockFailures = [new Error("fetch failed"), new Error("timeout")];
    const result = await emailService.sendPasswordResetOtpEmail({
      to: "test@example.com",
      userName: "Test",
      otp: "123456",
    });
    assert.equal(result.success, true);
    assert.equal(sendCalls.length, 3);
  });

  it("fails gracefully after maximum retries for transient errors", async () => {
    mockFailures = [
      new Error("fetch failed"),
      new Error("fetch failed"),
      new Error("fetch failed"),
    ];
    
    const result = await emailService.sendPasswordResetOtpEmail({
      to: "test@example.com",
      userName: "Test",
      otp: "123456",
    });
    
    assert.equal(result.success, false);
    assert.equal(sendCalls.length, 3);
  });

  it("does not retry non-transient configuration/validation errors", async () => {
    mockFailures = [{ message: "invalid_to_address" }];
    const result = await emailService.sendPasswordResetOtpEmail({
      to: "test@example.com",
      userName: "Test",
      otp: "123456",
    });
    assert.equal(result.success, false);
    assert.equal(sendCalls.length, 1);
  });

  it("does not retry generic errors that are not explicitly transient", async () => {
    mockFailures = [new Error("Generic exception that is not a timeout")];
    const result = await emailService.sendPasswordResetOtpEmail({
      to: "test@example.com",
      userName: "Test",
      otp: "123456",
    });
    assert.equal(result.success, false);
    assert.equal(sendCalls.length, 1);
  });
});
