import "./load-env";
import assert from "node:assert/strict";
import { createHash, createHmac } from "node:crypto";
import { after, afterEach, before, describe, it } from "node:test";
import { POST as postForgotPassword } from "@/app/api/auth/forgot-password/route";
import { POST as postResetPassword } from "@/app/api/auth/reset-password/route";
import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { connectMongo, disconnectMongo } from "@/lib/db";
import { AuditLog } from "@/modules/shared/audit-log.model";
import { PasswordReset } from "@/modules/identity/password-reset.model";
import { hashPassword, verifyPassword } from "@/modules/identity/password";
import {
  createPasswordResetOtp,
  hashOtp,
  resetPasswordWithOtp,
} from "@/modules/identity/password-reset.service";
import { createSession } from "@/modules/identity/session.service";
import { Session } from "@/modules/identity/session.model";
import { User } from "@/modules/identity/user.model";

const OLD_PASSWORD = "OldPassword123!";
const NEW_PASSWORD = "NewPassword123!";
const TEN_MINUTES_MS = 10 * 60 * 1000;

let userCounter = 0;
let createdUserIds: string[] = [];

function request(url: string, init?: RequestInit) {
  return new Request(url, init);
}

async function createUser(input?: {
  role?: "super_admin" | "admin" | "editor" | "viewer";
  status?: "active" | "disabled";
}) {
  userCounter += 1;
  const role = input?.role ?? "super_admin";
  const email = `password-reset-${Date.now()}-${userCounter}@techcore.example`;
  const user = await new User({
    email,
    name: "Password Reset Tester",
    passwordHash: await hashPassword(OLD_PASSWORD),
    role,
    status: input?.status ?? "active",
  }).save();
  const id = String(user._id);
  createdUserIds.push(id);
  return { id, email };
}

async function assertUnauthorized(action: () => Promise<unknown>, message?: RegExp) {
  await assert.rejects(
    action,
    (error) =>
      error instanceof AppError &&
      error.code === "UNAUTHORIZED" &&
      (!message || message.test(error.message)),
  );
}

describe("password reset OTP security", () => {
  before(async () => {
    await connectMongo();
  });

  afterEach(async () => {
    if (createdUserIds.length === 0) return;

    await PasswordReset.deleteMany({ userId: { $in: createdUserIds } });
    await Session.deleteMany({ userId: { $in: createdUserIds } });
    await AuditLog.deleteMany({ resourceId: { $in: createdUserIds } });
    await User.deleteMany({ _id: { $in: createdUserIds } });
    createdUserIds = [];
  });

  after(async () => {
    await disconnectMongo();
  });

  it("keeps forgot-password responses generic without exposing the OTP", async () => {
    const previousResendClient = globalThis.__techcoreResendClient;
    let emailText = "";

    globalThis.__techcoreResendClient = {
      emails: {
        send: async (payload) => {
          emailText = payload.text;
          return { data: { id: "password-reset-test" } };
        },
      },
    };

    try {
      const user = await createUser();
      const response = await postForgotPassword(
        request("http://localhost/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            origin: "http://localhost",
          },
          body: JSON.stringify({ email: user.email }),
        }),
      );
      const body = (await response.json()) as {
        data?: unknown;
        message?: string;
      };
      const serializedBody = JSON.stringify(body);
      const emailedOtp = emailText.match(/\b\d{6}\b/)?.[0];

      assert.equal(response.status, 200);
      assert.deepEqual(body.data, {});
      assert.equal(serializedBody.includes("otp"), false);
      assert.equal(serializedBody.includes("tokenHash"), false);
      assert.equal(serializedBody.includes("passwordHash"), false);
      assert.equal(serializedBody.includes("token"), false);
      assert.ok(emailedOtp);
      assert.equal(serializedBody.includes(emailedOtp), false);
    } finally {
      globalThis.__techcoreResendClient = previousResendClient;
    }
  });

  it("rejects non six-digit OTP payloads at the route boundary", async () => {
    const response = await postResetPassword(
      request("http://localhost/api/auth/reset-password", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "http://localhost",
        },
        body: JSON.stringify({
          email: "reset-route@example.com",
          otp: "12345",
          newPassword: NEW_PASSWORD,
        }),
      }),
    );
    const body = (await response.json()) as {
      code?: string;
      fields?: Record<string, string>;
    };

    assert.equal(response.status, 400);
    assert.equal(body.code, "VALIDATION_ERROR");
    assert.equal(body.fields?.otp, "Enter the 6-digit code");
  });

  it("creates six-digit HMAC OTP records only for active super admins", async () => {
    const authSecret = env.AUTH_SECRET;
    assert.ok(authSecret);

    const admin = await createUser({ role: "admin" });
    assert.equal(await createPasswordResetOtp(admin.email), null);
    assert.equal(await PasswordReset.countDocuments({ userId: admin.id }), 0);

    const superAdmin = await createUser();
    const beforeCreate = Date.now();
    const result = await createPasswordResetOtp(
      ` ${superAdmin.email.toUpperCase()} `,
    );
    assert.ok(result);
    assert.match(result.otp, /^\d{6}$/);

    const record = await PasswordReset.findOne({
      userId: superAdmin.id,
    }).lean();
    assert.ok(record);
    assert.equal(record.tokenHash, hashOtp(result.otp));
    assert.equal(
      record.tokenHash,
      createHmac("sha256", authSecret).update(result.otp).digest("hex"),
    );
    assert.notEqual(record.tokenHash, result.otp);
    assert.notEqual(
      record.tokenHash,
      createHash("sha256").update(result.otp).digest("hex"),
    );
    assert.equal(record.attempts, 0);
    assert.equal(record.used, false);
    assert.ok(record.expiresAt.getTime() >= beforeCreate + TEN_MINUTES_MS - 1000);
    assert.ok(record.expiresAt.getTime() <= beforeCreate + TEN_MINUTES_MS + 5000);

    const auditLog = await AuditLog.findOne({
      resourceId: superAdmin.id,
      action: "password_reset_requested",
    }).lean();
    assert.deepEqual(auditLog?.metadata, { email: superAdmin.email });
  });

  it("rejects expired OTP records without consuming attempts", async () => {
    const user = await createUser();
    const result = await createPasswordResetOtp(user.email);
    assert.ok(result);

    await PasswordReset.updateOne(
      { userId: user.id },
      { expiresAt: new Date(Date.now() - 1000) },
    );

    await assertUnauthorized(() =>
      resetPasswordWithOtp({
        email: user.email,
        otp: result.otp,
        newPassword: NEW_PASSWORD,
      }),
    );

    const record = await PasswordReset.findOne({ userId: user.id }).lean();
    assert.equal(record?.attempts, 0);
    assert.equal(record?.used, false);
  });

  it("locks an OTP after max failed attempts", async () => {
    const user = await createUser();
    const result = await createPasswordResetOtp(user.email);
    assert.ok(result);
    const wrongOtp = result.otp === "000000" ? "000001" : "000000";

    for (let attempt = 1; attempt < 5; attempt += 1) {
      await assertUnauthorized(() =>
        resetPasswordWithOtp({
          email: user.email,
          otp: wrongOtp,
          newPassword: NEW_PASSWORD,
        }),
      );
      const record = await PasswordReset.findOne({ userId: user.id }).lean();
      assert.equal(record?.attempts, attempt);
      assert.equal(record?.used, false);
    }

    await assertUnauthorized(
      () =>
        resetPasswordWithOtp({
          email: user.email,
          otp: wrongOtp,
          newPassword: NEW_PASSWORD,
        }),
      /Too many failed attempts/,
    );

    const lockedRecord = await PasswordReset.findOne({ userId: user.id }).lean();
    assert.equal(lockedRecord?.attempts, 5);
    assert.equal(lockedRecord?.used, true);

    await assertUnauthorized(() =>
      resetPasswordWithOtp({
        email: user.email,
        otp: result.otp,
        newPassword: NEW_PASSWORD,
      }),
    );
  });

  it("uses a valid OTP once, updates the password, and revokes sessions", async () => {
    const user = await createUser();
    await createSession({ userId: user.id, ip: "127.0.0.1", userAgent: "test" });
    assert.equal(await Session.countDocuments({ userId: user.id }), 1);

    const result = await createPasswordResetOtp(user.email);
    assert.ok(result);

    await resetPasswordWithOtp({
      email: user.email,
      otp: result.otp,
      newPassword: NEW_PASSWORD,
    });

    const usedRecord = await PasswordReset.findOne({ userId: user.id }).lean();
    assert.equal(usedRecord?.used, true);
    assert.equal(usedRecord?.attempts, 1);
    assert.equal(await Session.countDocuments({ userId: user.id }), 0);

    const storedUser = await User.findById(user.id)
      .select("+passwordHash passwordChangedAt")
      .lean();
    assert.ok(storedUser?.passwordHash);
    assert.equal(await verifyPassword(NEW_PASSWORD, storedUser.passwordHash), true);
    assert.equal(await verifyPassword(OLD_PASSWORD, storedUser.passwordHash), false);
    assert.ok(storedUser.passwordChangedAt);

    await assertUnauthorized(() =>
      resetPasswordWithOtp({
        email: user.email,
        otp: result.otp,
        newPassword: "AnotherPassword123!",
      }),
    );

    const auditLogs = await AuditLog.find({ resourceId: user.id }).lean();
    const serializedLogs = JSON.stringify(auditLogs);
    assert.equal(serializedLogs.includes(result.otp), false);
    assert.equal(serializedLogs.includes(NEW_PASSWORD), false);
    assert.equal(serializedLogs.includes(storedUser.passwordHash), false);
  });
});
