import "./load-env";
import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import { GET as getServices } from "@/app/api/services/route";
import { GET as getService } from "@/app/api/services/[slug]/route";
import { POST as postContact } from "@/app/api/contact/route";
import { POST as postEnquiry } from "@/app/api/enquiries/route";
import { GET as getJob } from "@/app/api/jobs/[id]/route";
import { Enquiry } from "@/modules/leads/enquiry.model";
import { POST as postApply } from "@/app/api/jobs/[id]/apply/route";
import { disconnectMongo } from "@/lib/db";
import { clearRateLimitsForTesting } from "@/lib/rate-limit";

function request(url: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set("x-test-client-key", "test-routes-suite");
  return new Request(url, { ...init, headers });
}

import { beforeEach } from "node:test";
describe("public API routes", () => {
  beforeEach(async () => { await clearRateLimitsForTesting("test-routes-suite"); });
  it("lists published services", async () => {
    const response = await getServices();
    const body = (await response.json()) as {
      success: boolean;
      data?: { slug: string }[];
    };
    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data?.some((item) => item.slug === "web-development"));
  });

  it("rejects an invalid service slug", async () => {
    const response = await getService(request("http://localhost/api/services/NOPE"), {
      params: Promise.resolve({ slug: "NOPE" }),
    });
    const body = (await response.json()) as { success: boolean; code?: string };
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
  });

  it("accepts loopback origin aliases in development", async () => {
    const response = await postContact(
      request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "http://127.0.0.1:3000",
        },
        body: JSON.stringify({}),
      }),
    );
    const body = (await response.json()) as { success: boolean; fields?: object };
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.ok(body.fields);
  });

  it("rejects contact posts from a foreign origin", async () => {
    const response = await postContact(
      request("http://localhost/api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://evil.example",
        },
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: "ada@techcore.example",
          subject: "Architecture review",
          message: "This message is long enough to pass the minimum length.",
          gdprConsent: true,
        }),
      }),
    );
    const body = (await response.json()) as { success: boolean; code?: string };
    assert.equal(response.status, 403);
    assert.equal(body.success, false);
    assert.equal(body.code, "FORBIDDEN");
  });

  it("rejects an empty contact submission", async () => {
    const response = await postContact(
      request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      }),
    );
    const body = (await response.json()) as { success: boolean; fields?: object };
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.ok(body.fields);
  });

  it("rejects a malformed email on contact", async () => {
    const response = await postContact(
      request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: "ada@",
          subject: "Hello there",
          message: "This message is long enough to pass the minimum length.",
          gdprConsent: true,
        }),
      }),
    );
    const body = (await response.json()) as { success: boolean };
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
  });

  it("rejects an invalid job id", async () => {
    const response = await getJob(request("http://localhost/api/jobs/NOT_VALID"), {
      params: Promise.resolve({ id: "NOT_VALID" }),
    });
    const body = (await response.json()) as { success: boolean };
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
  });

  it("rejects apply with an invalid identifier", async () => {
    const form = new FormData();
    form.set("name", "Ada Lovelace");
    form.set("email", "ada@techcore.example");
    form.set(
      "coverLetter",
      "I would like to join the engineering practice at TechCore.",
    );
    form.set("gdprConsent", "true");
    const response = await postApply(
      request("http://localhost/api/jobs/NOT_VALID/apply", {
        method: "POST",
        body: form,
      }),
      { params: Promise.resolve({ id: "NOT_VALID" }) },
    );
    const body = (await response.json()) as { success: boolean };
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
  });

  it("ignores a contact enquiry when honeypot is triggered", async () => {
    const email = `honeypot.contact.${Date.now()}@techcore.example`;
    const response = await postContact(
      request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Spam Bot",
          email,
          subject: "Architecture review",
          message: "This message is long enough to pass the minimum length.",
          gdprConsent: true,
          website: "http://spam.com",
        }),
      }),
    );
    const body = (await response.json()) as { success: boolean; data?: { id?: string } };
    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.ok(body.data?.id); // opaque id returned

    // Ensure not persisted
    const dbRecord = await Enquiry.findOne({ email });
    assert.strictEqual(dbRecord, null);
  });

  it("stores a valid contact enquiry", async () => {
    const response = await postContact(
      request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: `ada.${Date.now()}@techcore.example`,
          subject: "Architecture review",
          message: "This message is long enough to pass the minimum length.",
          gdprConsent: true,
        }),
      }),
    );
    const body = (await response.json()) as {
      success: boolean;
      data?: { id?: string };
    };
    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.ok(body.data?.id);
  });

  it("rejects a quote enquiry with a missing company", async () => {
    const response = await postEnquiry(
      request("http://localhost/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: "ada@techcore.example",
          service: "web-development",
          budget: "50-150k",
          timeline: "1-3-months",
          description: "We need a replacement for an internal operations portal.",
          gdprConsent: true,
        }),
      }),
    );
    const body = (await response.json()) as { success: boolean; fields?: object };
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.ok(body.fields);
  });

  it("rejects a quote enquiry with a package name instead of a service slug", async () => {
    const response = await postEnquiry(
      request("http://localhost/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: "ada@techcore.example",
          company: "Analytical Engines",
          service: "Launch",
          budget: "50-150k",
          timeline: "1-3-months",
          description: "We need a replacement for an internal operations portal.",
          gdprConsent: true,
        }),
      }),
    );
    const body = (await response.json()) as {
      success: boolean;
      fields?: Record<string, string>;
    };
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.ok(body.fields?.service);
  });

  it("rejects a quote enquiry for an unpublished service slug", async () => {
    const response = await postEnquiry(
      request("http://localhost/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: "ada@techcore.example",
          company: "Analytical Engines",
          service: "not-a-published-service",
          budget: "50-150k",
          timeline: "1-3-months",
          description: "We need a replacement for an internal operations portal.",
          gdprConsent: true,
        }),
      }),
    );
    const body = (await response.json()) as {
      success: boolean;
      fields?: Record<string, string>;
    };
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.ok(body.fields?.service);
  });

  it("rejects a quote enquiry when consent is a string", async () => {
    const response = await postEnquiry(
      request("http://localhost/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: "ada@techcore.example",
          company: "Analytical Engines",
          service: "web-development",
          budget: "50-150k",
          timeline: "1-3-months",
          description: "We need a replacement for an internal operations portal.",
          gdprConsent: "true",
        }),
      }),
    );
    const body = (await response.json()) as {
      success: boolean;
      fields?: Record<string, string>;
    };
    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.ok(body.fields?.gdprConsent);
  });

  it("ignores a quote enquiry when honeypot is triggered", async () => {
    const email = `honeypot.quote.${Date.now()}@techcore.example`;
    const response = await postEnquiry(
      request("http://localhost/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Spam Bot",
          email,
          company: "Analytical Engines",
          service: "web-development",
          budget: "50-150k",
          timeline: "1-3-months",
          description: "We need a replacement for an internal operations portal.",
          gdprConsent: true,
          website: "http://spam.com",
        }),
      }),
    );
    const body = (await response.json()) as { success: boolean; data?: { id?: string } };
    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.ok(body.data?.id);

    // Ensure not persisted
    const dbRecord = await Enquiry.findOne({ email });
    assert.strictEqual(dbRecord, null);
  });

  it("stores a valid quote enquiry", async () => {
    const response = await postEnquiry(
      request("http://localhost/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Ada Lovelace",
          email: `quote.${Date.now()}@techcore.example`,
          company: "Analytical Engines",
          service: "web-development",
          budget: "50-150k",
          timeline: "1-3-months",
          description: "We need a replacement for an internal operations portal.",
          gdprConsent: true,
        }),
      }),
    );
    const body = (await response.json()) as { success: boolean };
    assert.equal(response.status, 201);
    assert.equal(body.success, true);
  });

  it("rejects a duplicate job application", async () => {
    const email = `apply.${Date.now()}@techcore.example`;
    const payload = () => {
      const form = new FormData();
      form.set("name", "Ada Lovelace");
      form.set("email", email);
      form.set(
        "coverLetter",
        "I would like to join the engineering practice at TechCore.",
      );
      form.set("gdprConsent", "true");
      return form;
    };
    const first = await postApply(
      request("http://localhost/api/jobs/frontend-developer/apply", {
        method: "POST",
        body: payload(),
      }),
      { params: Promise.resolve({ id: "frontend-developer" }) },
    );
    const firstBody = (await first.json()) as { success: boolean };
    assert.equal(first.status, 201);
    assert.equal(firstBody.success, true);

    const second = await postApply(
      request("http://localhost/api/jobs/frontend-developer/apply", {
        method: "POST",
        body: payload(),
      }),
      { params: Promise.resolve({ id: "frontend-developer" }) },
    );
    const secondBody = (await second.json()) as { success: boolean; code?: string };
    assert.equal(second.status, 409);
    assert.equal(secondBody.success, false);
    assert.equal(secondBody.code, "CONFLICT");
  });

  after(async () => {
    await disconnectMongo();
  });
});

import { GET as getResume } from "@/app/api/admin/applications/[id]/resume/route";
import { User } from "@/modules/identity/user.model";
import { Media } from "@/modules/media/media.model";
import { Application } from "@/modules/careers/application.model";
import { createSession } from "@/modules/identity/session.service";
import { Types } from "mongoose";
import { mock } from "node:test";

describe("admin resume API", () => {
  let adminCookie: string;
  let nonAdminCookie: string;
  let appAId: string;
  let appBId: string;
  let deletedAppId: string;
  let legacyAppId: string;
  let noResumeAppId: string;
  let mediaAUrl: string;
  let mediaBUrl: string;
  let legacyMediaUrl: string;

  beforeEach(async () => {
    await clearRateLimitsForTesting("test-routes-suite-resumes");
  });

  after(async () => {
    await User.deleteMany({ email: { $in: ["resume-admin@techcore.example", "resume-user@techcore.example"] } });
    await Application.deleteMany({ email: { $in: ["appA@example.com", "appB@example.com", "deleted@example.com", "legacy@example.com", "no-resume@example.com"] } });
    await Media.deleteMany({ filename: { $in: ["resumeA.pdf", "resumeB.pdf", "legacy-resume.pdf"] } });
    mock.restoreAll();
  });

  it("sets up test data", async () => {
    const admin = await User.create({
      name: "Resume Admin",
      email: "resume-admin@techcore.example",
      role: "super_admin",
      status: "active",
      passwordHash: "fake",
    });

    const adminSessionToken = await createSession({
      userId: String(admin._id),
      userAgent: "Test",
      ip: "127.0.0.1",
    });
    adminCookie = `session=${adminSessionToken}`;

    const user = await User.create({
      name: "Resume User",
      email: "resume-user@techcore.example",
      role: "viewer",
      status: "active",
      passwordHash: "fake",
    });

    const userSessionToken = await createSession({
      userId: String(user._id),
      userAgent: "Test",
      ip: "127.0.0.1",
    });
    nonAdminCookie = `session=${userSessionToken}`;

    mediaAUrl = "https://example.com/blob/A.pdf";
    const mediaA = await Media.create({
      filename: "resumeA.pdf",
      url: mediaAUrl,
      mimeType: "application/pdf",
      access: "private",
    });

    mediaBUrl = "https://example.com/blob/B.pdf";
    const mediaB = await Media.create({
      filename: "resumeB.pdf",
      url: mediaBUrl,
      mimeType: "application/pdf",
      access: "private",
    });

    legacyMediaUrl = "https://example.com/blob/legacy.pdf";
    const legacyMedia = await Media.create({
      filename: "legacy-resume.pdf",
      url: legacyMediaUrl,
      mimeType: "application/pdf",
      access: "public",
    });

    const appA = await Application.create({
      jobId: new Types.ObjectId(),
      jobTitleSnapshot: "Engineer",
      name: "App A",
      email: "appA@example.com",
      resumeAssetId: mediaA._id,
      status: "new",
      source: "careers_page",
      gdprConsent: true,
    });
    appAId = String(appA._id);

    const appB = await Application.create({
      jobId: new Types.ObjectId(),
      jobTitleSnapshot: "Engineer",
      name: "App B",
      email: "appB@example.com",
      resumeAssetId: mediaB._id,
      status: "new",
      source: "careers_page",
      gdprConsent: true,
    });
    appBId = String(appB._id);

    const deletedApp = await Application.create({
      jobId: new Types.ObjectId(),
      jobTitleSnapshot: "Engineer",
      name: "Deleted Applicant",
      email: "deleted@example.com",
      resumeAssetId: mediaA._id,
      status: "new",
      source: "careers_page",
      gdprConsent: true,
      deletedAt: new Date(),
    });
    deletedAppId = String(deletedApp._id);

    const legacyApp = await Application.create({
      jobId: new Types.ObjectId(),
      jobTitleSnapshot: "Engineer",
      name: "Legacy Applicant",
      email: "legacy@example.com",
      resumeAssetId: legacyMedia._id,
      status: "new",
      source: "careers_page",
      gdprConsent: true,
    });
    legacyAppId = String(legacyApp._id);

    const noResumeApp = await Application.create({
      jobId: new Types.ObjectId(),
      jobTitleSnapshot: "Engineer",
      name: "No Resume Applicant",
      email: "no-resume@example.com",
      status: "new",
      source: "careers_page",
      gdprConsent: true,
    });
    noResumeAppId = String(noResumeApp._id);
  });

  const getResumeCall = (id: string, cookie?: string, query?: string) => {
    const headers: Record<string, string> = {};
    if (cookie) headers["cookie"] = cookie;
    const url = `http://localhost/api/admin/applications/${id}/resume${query ? `?${query}` : ""}`;
    return getResume(
      request(url, { headers }),
      { params: Promise.resolve({ id }) } as any
    );
  };

  const createMockStream = (content: string) => {
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(content));
        controller.close();
      }
    });
  };

  it("1. unauthenticated request denied", async () => {
    const res = await getResumeCall(appAId);
    assert.equal(res.status, 401);
  });

  it("2. authenticated user without required permission denied", async () => {
    const res = await getResumeCall(appAId, nonAdminCookie);
    assert.equal(res.status, 403);
  });

  it("3. authorized private resume streamed correctly", async () => {
    const blobModule = require("@/modules/media/blob").blobClient;
    const getMock = mock.method(blobModule, "get", async (url: string, options: any) => {
      assert.equal(url, mediaAUrl);
      assert.equal(options.access, "private");
      return {
        stream: createMockStream("TEST RESUME CONTENT"),
        blob: { contentType: "application/pdf" }
      };
    });

    const res = await getResumeCall(appAId, adminCookie);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("Content-Type"), "application/pdf");
    assert.match(res.headers.get("Content-Disposition") || "", /attachment; filename="resumeA.pdf"/);
    assert.equal(res.headers.get("Cache-Control"), "private, no-store, max-age=0, must-revalidate");

    const bodyText = await res.text();
    assert.equal(bodyText, "TEST RESUME CONTENT");

    getMock.mock.restore();
  });

  it("4. invalid ObjectId denied", async () => {
    const res = await getResumeCall("not-an-id", adminCookie);
    assert.equal(res.status, 400);
  });

  it("5. nonexistent application denied", async () => {
    const res = await getResumeCall(new Types.ObjectId().toString(), adminCookie);
    assert.equal(res.status, 404);
  });

  it("6. soft-deleted application denied", async () => {
    const res = await getResumeCall(deletedAppId, adminCookie);
    assert.equal(res.status, 404);
  });

  it("7. application without resume denied", async () => {
    const res = await getResumeCall(noResumeAppId, adminCookie);
    assert.equal(res.status, 404);
  });

  it("8. real object-boundary / IDOR test", async () => {
    const blobModule = require("@/modules/media/blob").blobClient;
    let calledUrl = "";
    const getMock = mock.method(blobModule, "get", async (url: string, options: any) => {
      calledUrl = url;
      return {
        stream: createMockStream("BLOB CONTENT FOR: " + url),
        blob: { contentType: "application/pdf" }
      };
    });

    const res = await getResumeCall(appBId, adminCookie, `url=${mediaAUrl}`);
    assert.equal(res.status, 200);

    const bodyText = await res.text();

    assert.equal(calledUrl, mediaBUrl);
    assert.equal(bodyText, "BLOB CONTENT FOR: " + mediaBUrl);

    getMock.mock.restore();
  });

  it("9. legacy public resume streams correctly", async () => {
    const blobModule = require("@/modules/media/blob").blobClient;
    const getMock = mock.method(blobModule, "get", async (url: string, options: any) => {
      assert.equal(url, legacyMediaUrl);
      assert.equal(options.access, "public");
      return {
        stream: createMockStream("LEGACY PUBLIC RESUME CONTENT"),
        blob: { contentType: "application/pdf" }
      };
    });

    const res = await getResumeCall(legacyAppId, adminCookie);
    assert.equal(res.status, 200);
    const bodyText = await res.text();
    assert.equal(bodyText, "LEGACY PUBLIC RESUME CONTENT");

    getMock.mock.restore();
  });

  it("10. Blob returns null -> 404", async () => {
    const blobModule = require("@/modules/media/blob").blobClient;
    const getMock = mock.method(blobModule, "get", async () => {
      return null;
    });

    const res = await getResumeCall(appAId, adminCookie);
    assert.equal(res.status, 404);

    const json = await res.json() as any;
    assert.equal(json.success, false);
    assert.equal(json.code, "NOT_FOUND");

    getMock.mock.restore();
  });

  it("11. Blob throws -> safe error", async () => {
    const blobModule = require("@/modules/media/blob").blobClient;
    const getMock = mock.method(blobModule, "get", async () => {
      throw new Error("Secret provider credential failure 0xDEADBEEF");
    });

    const res = await getResumeCall(appAId, adminCookie);
    assert.equal(res.status, 500);

    const json = await res.json() as any;
    assert.equal(json.success, false);
    assert.equal(json.code, "INTERNAL_ERROR");
    assert.ok(!JSON.stringify(json).includes("0xDEADBEEF"));

    getMock.mock.restore();
  });
});
