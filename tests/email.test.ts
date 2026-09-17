import assert from "node:assert/strict";
import { after, afterEach, before, describe, it, mock } from "node:test";

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
    mockFailures = [new Error("Generic exception that is not explicitly transient")];
    const result = await emailService.sendPasswordResetOtpEmail({
      to: "test@example.com",
      userName: "Test",
      otp: "123456",
    });
    assert.equal(result.success, false);
    assert.equal(sendCalls.length, 1);
  });
});

describe("test email server action", () => {
  let actions: typeof import("../modules/notifications/actions");
  let emailService: typeof import("../modules/notifications/email.service");
  let { connectMongo, disconnectMongo } = require("../lib/db");
  let { User } = require("../modules/identity/user.model");
  let { Session } = require("../modules/identity/session.model");
  let { createSessionToken, hashSessionToken } = require("../modules/identity/session.service");

  let superAdminId: string;
  let superAdminToken: string;
  let unverifiedUserId: string;
  let unverifiedUserToken: string;

  before(async () => {
    actions = await import("../modules/notifications/actions");
    emailService = await import("../modules/notifications/email.service");
    
    await connectMongo();
    await User.deleteMany({ email: { $in: ["email-test-super@test.com", "email-test-regular@test.com", "email-test-noemail@test.com"] } });
    await User.deleteMany({ name: "No Email Admin", email: null });
    
    const superAdmin = await User.create({
      name: "Super Admin",
      email: "email-test-super@test.com",
      passwordHash: "test",
      role: "super_admin",
      status: "active",
    });
    superAdminId = superAdmin._id.toString();
    superAdminToken = createSessionToken();
    await Session.create({
      userId: superAdminId,
      tokenHash: hashSessionToken(superAdminToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      lastSeenAt: new Date(),
    });

    const unverifiedUserObj = {
      name: "No Email Admin",
      email: null,
      passwordHash: "test",
      role: "super_admin",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const unverifiedUser = await User.collection.insertOne(unverifiedUserObj);
    unverifiedUserId = unverifiedUser.insertedId.toString();
    unverifiedUserToken = createSessionToken();
    await Session.create({
      userId: unverifiedUserId,
      tokenHash: hashSessionToken(unverifiedUserToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      lastSeenAt: new Date(),
    });
  });

  afterEach(() => {
    sendCalls.length = 0;
    mockFailures = [];
    if (mock && mock.restoreAll) {
      mock.restoreAll();
    }
  });

  after(async () => {
    await User.deleteMany({ email: { $in: ["email-test-super@test.com", "email-test-regular@test.com", "email-test-noemail@test.com"] } });
    await Session.deleteMany({ userId: { $in: [superAdminId, unverifiedUserId].filter(Boolean) } });
    await User.deleteMany({ name: "No Email Admin", email: null });
    await disconnectMongo();
  });

  function mockCookies(token?: string) {
    const headers = require("next/headers");
    mock.method(headers, "cookies", () => ({
      get: () => (token ? { value: token } : undefined),
      set: () => {},
      delete: () => {},
    }));
  }

  it("sends a test email using the authenticated user's email", async () => {
    mockCookies(superAdminToken);

    const result = await actions.sendTestEmailAction();
    assert.equal(result.success, true);
    assert.equal(sendCalls.length, 1);
    const recipients = sendCalls
      .map((payload) => (Array.isArray(payload.to) ? payload.to : [payload.to]))
      .flat();
    assert.deepEqual(recipients, ["email-test-super@test.com"]);
  });

  it("fails gracefully if the user is unauthenticated", async () => {
    mockCookies();

    const result = await actions.sendTestEmailAction();
    assert.equal(result.success, false);
    assert.equal(result.error, "Unauthorized");
    assert.equal(sendCalls.length, 0);
  });

  it("fails gracefully if the user has no email", async () => {
    mockCookies(unverifiedUserToken);

    const result = await actions.sendTestEmailAction();
    assert.equal(result.success, false);
    assert.equal(result.error, "Your account does not have an email address.");
    assert.equal(sendCalls.length, 0);
  });

  it("enforces rate limits", async () => {
    mockCookies(superAdminToken);

    // Send up to the limit (which is 3, but we already sent 1 in the first test)
    // Wait, the first test was sent by superAdmin, so 1 is already sent.
    await actions.sendTestEmailAction(); // 2nd
    await actions.sendTestEmailAction(); // 3rd
    
    // The 4th should fail
    const result = await actions.sendTestEmailAction();
    assert.equal(result.success, false);
    assert.equal(result.error, "Too many test emails sent. Please wait before trying again.");
  });
});

describe("email templates interpolation", () => {
  it("interpolates company name and otp successfully", async () => {
    const templates = await import("../modules/notifications/templates");
    const email = templates.buildPasswordResetOtpEmail({
      companyName: "Acme",
      userName: "Alice",
      otp: "123",
    });
    assert.ok(email.subject.includes("Acme CMS"));
    assert.ok(!email.subject.includes("input.companyName"));
    assert.ok(email.text.includes("Acme CMS account."));
    assert.ok(email.text.includes("code is: 123"));
  });
});
