import { test, describe, before, after, mock } from "node:test";
import assert from "node:assert";
import "./load-env"; // must be first
import { connectMongo, disconnectMongo } from "@/lib/db";
import { User } from "@/modules/identity/user.model";
import { Session } from "@/modules/identity/session.model";
import { createSessionToken, hashSessionToken } from "@/modules/identity/session.service";
import { Media } from "@/modules/media/media.model";
import { deleteMediaAction } from "@/modules/media/actions";
import { Service } from "@/modules/catalog/service.model";
import { cookies } from "next/headers";

describe("Media Deletion (Phase 5C)", () => {
  let superAdminId: string;
  let regularUserId: string;
  let superAdminToken: string;
  let regularUserToken: string;

  before(async () => {
    process.env.BLOB_READ_WRITE_TOKEN = "test-token";
    await connectMongo();
    await User.deleteMany({ email: { $in: ["media-del-super@test.com", "media-del-regular@test.com"] } });
    await Media.deleteMany({ filename: /test-delete/ });
    await Service.deleteMany({ title: /Test Service Ref/ });
    
    const superAdmin = await User.create({
      name: "Media Super",
      email: "media-del-super@test.com",
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
      email: "media-del-regular@test.com",
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
    await User.deleteMany({ email: { $in: ["media-del-super@test.com", "media-del-regular@test.com"] } });
    await Session.deleteMany({ userId: { $in: [superAdminId, regularUserId] } });
    await Media.deleteMany({ filename: /test-delete/ });
    await Service.deleteMany({ title: /Test Service Ref/ });
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

  test("rejects unauthenticated delete", async () => {
    mockCookies();
    const res = await deleteMediaAction("507f1f77bcf86cd799439011");
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.error, "Unauthorized");
    mock.restoreAll();
  });

  test("rejects unauthorized delete (site:write required)", async () => {
    mockCookies(regularUserToken);
    const res = await deleteMediaAction("507f1f77bcf86cd799439011");
    assert.strictEqual(res.success, false);
    assert.match(res.error || "", /You do not have access to this resource/);
    mock.restoreAll();
  });

  test("rejects invalid/nonexistent Media ID", async () => {
    mockCookies(superAdminToken);
    const res = await deleteMediaAction("507f1f77bcf86cd799439011"); // valid format, doesnt exist
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.error, "Media not found");
    mock.restoreAll();
  });

  test("rejects referenced media and preserves records", async () => {
    mockCookies(superAdminToken);
    const media = await Media.create({
      filename: "test-delete-ref.jpg",
      url: "https://test.public.blob.vercel-storage.com/test-delete-ref.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 1024,
      uploadedBy: superAdminId,
    });

    const service = await Service.create({
      title: "Test Service Ref",
      slug: "test-service-ref",
      summary: "Test",
      body: "Test",
      status: "draft",
      heroImageId: media._id,
    });

    const res = await deleteMediaAction(media._id.toString());
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.error, "This media is currently in use and cannot be deleted.");

    const stillExists = await Media.findById(media._id);
    assert.ok(stillExists);

    mock.restoreAll();
  });

  test("unreferenced media deletes Mongo record", async () => {
    mockCookies(superAdminToken);
    const media = await Media.create({
      filename: "test-delete-success.jpg",
      url: "https://test.public.blob.vercel-storage.com/test-delete-success.jpg",
      mimeType: "image/jpeg",
      sizeBytes: 1024,
      uploadedBy: superAdminId,
    });

    const res = await deleteMediaAction(media._id.toString());
    assert.strictEqual(res.success, true);
    
    const checkExists = await Media.findById(media._id);
    assert.strictEqual(checkExists, null);

    mock.restoreAll();
  });
});
