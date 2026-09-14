import { test, describe, before, after, mock } from "node:test";
import assert from "node:assert";
import "./load-env"; // must be first
import { connectMongo, disconnectMongo } from "@/lib/db";
import { User } from "@/modules/identity/user.model";
import { Session } from "@/modules/identity/session.model";
import { createSessionToken, hashSessionToken } from "@/modules/identity/session.service";
import { Media } from "@/modules/media/media.model";
import { uploadMediaAction } from "@/modules/media/actions";

describe("Media Upload (Phase 5C)", () => {
  let superAdminId: string;
  let regularUserId: string;
  let superAdminToken: string;
  let regularUserToken: string;

  before(async () => {
    process.env.BLOB_READ_WRITE_TOKEN = "test-token";
    await connectMongo();
    await User.deleteMany({ email: { $in: ["media-super@test.com", "media-regular@test.com"] } });
    await Media.deleteMany({ filename: /test-upload/ });
    
    const superAdmin = await User.create({
      name: "Media Super",
      email: "media-super@test.com",
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

    const regular = await User.create({
      name: "Media Regular",
      email: "media-regular@test.com",
      passwordHash: "test",
      role: "viewer",
      status: "active",
    });
    regularUserId = regular._id.toString();
    regularUserToken = createSessionToken();
    await Session.create({
      userId: regularUserId,
      tokenHash: hashSessionToken(regularUserToken),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      lastSeenAt: new Date(),
    });
  });

  after(async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN;
    await User.deleteMany({ email: { $in: ["media-super@test.com", "media-regular@test.com"] } });
    await Session.deleteMany({ userId: { $in: [superAdminId, regularUserId] } });
    await Media.deleteMany({ filename: /test-upload/ });
    await disconnectMongo();
  });

  function createMockFile(name: string, type: string, size: number, magicBytes?: number[]): File {
    const buffer = Buffer.alloc(size);
    if (magicBytes) {
      for (let i = 0; i < magicBytes.length; i++) {
        buffer[i] = magicBytes[i];
      }
    }
    return new File([buffer], name, { type });
  }

  function mockCookies(token?: string) {
    const headers = require("next/headers");
    mock.method(headers, "cookies", () => ({
      get: () => (token ? { value: token } : undefined),
      set: () => {},
      delete: () => {},
    }));
  }

  test("unauthenticated request rejected", async () => {
    mockCookies(undefined);
    
    const formData = new FormData();
    const result = await uploadMediaAction(formData);
    assert.strictEqual(result.success, false);
    assert.match(result.error as string, /Unauthorized/i);
    mock.restoreAll();
  });

  test("user without site:write rejected", async () => {
    mockCookies(regularUserToken);

    const formData = new FormData();
    const jpegMagic = [0xff, 0xd8, 0xff];
    formData.append("file", createMockFile("test-upload.jpg", "image/jpeg", 1000, jpegMagic));
    
    const result = await uploadMediaAction(formData).catch((e: any) => ({ success: false, error: e.message }));
    assert.strictEqual(result.success, false);
    assert.match(result.error as string, /Unauthorized|Forbidden|Permission denied/i);
    mock.restoreAll();
  });

  test(">4MB rejected", async () => {
    mockCookies(superAdminToken);

    const formData = new FormData();
    formData.append("file", createMockFile("test-upload.jpg", "image/jpeg", 5 * 1024 * 1024));
    const result = await uploadMediaAction(formData);
    assert.strictEqual(result.success, false);
    assert.match(result.error as string, /4MB/i);
    mock.restoreAll();
  });

  test("unsupported MIME rejected", async () => {
    mockCookies(superAdminToken);

    const formData = new FormData();
    formData.append("file", createMockFile("test-upload.pdf", "application/pdf", 1000));
    const result = await uploadMediaAction(formData);
    assert.strictEqual(result.success, false);
    assert.match(result.error as string, /Unsupported MIME/i);
    mock.restoreAll();
  });

  test("SVG rejected (fails MIME and signature)", async () => {
    mockCookies(superAdminToken);

    const formData = new FormData();
    formData.append("file", createMockFile("test-upload.svg", "image/svg+xml", 1000));
    const result = await uploadMediaAction(formData);
    assert.strictEqual(result.success, false);
    assert.match(result.error as string, /Unsupported MIME|Invalid file content/i);
    mock.restoreAll();
  });

  test("accepts valid JPEG", async () => {
    mockCookies(superAdminToken);

    const formData = new FormData();
    const jpegMagic = [0xff, 0xd8, 0xff];
    formData.append("file", createMockFile("test-upload-good.jpg", "image/jpeg", 1000, jpegMagic));

    const result = await uploadMediaAction(formData);
    assert.strictEqual(result.success, true);
    assert.ok(result.item);

    const dbRecord = await Media.findOne({ _id: (result.item as any)._id });
    assert.ok(dbRecord);
    assert.strictEqual(dbRecord.filename, "test-upload-good.jpg");

    mock.restoreAll();
  });
});
