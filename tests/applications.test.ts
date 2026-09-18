import { test, describe, before, after, beforeEach } from "node:test";
import assert from "node:assert";
import "./load-env"; // must be first
import { connectMongo, disconnectMongo } from "@/lib/db";
import { Job } from "@/modules/careers/job.model";
import { Application } from "@/modules/careers/application.model";
import { Media } from "@/modules/media/media.model";
import { POST as postApply } from "@/app/api/jobs/[id]/apply/route";
import { clearRateLimitsForTesting } from "@/lib/rate-limit";

describe("Applications API (Phase 17)", () => {
  let jobId: string;
  let testAppUrl: string;

  beforeEach(async () => { await clearRateLimitsForTesting("test-applications-suite"); });

  before(async () => {
    process.env.BLOB_READ_WRITE_TOKEN = "test-token";
    await connectMongo();
    await Job.deleteMany({ title: "Test Job Resume" });
    await Application.deleteMany({ email: /resume-test/ });

    const job = await Job.create({
      title: "Test Job Resume",
      slug: "test-job-resume",
      department: "Engineering",
      location: "Remote",
      employmentType: "Full-time",
      description: "Test",
      status: "open",
    });
    jobId = job._id.toString();
    testAppUrl = `http://localhost:3000/api/jobs/${jobId}/apply`;
  });

  after(async () => {
    await Job.deleteMany({ title: "Test Job Resume" });
    await Application.deleteMany({ email: /resume-test/ });
    await Media.deleteMany({ altText: "Applicant Resume" });
    await disconnectMongo();
  });

  test("1) Application without resume succeeds", async () => {
    const formData = new FormData();
    formData.append("name", "Test User");
    formData.append("email", "resume-test1@example.com");
    formData.append("coverLetter", "This is a cover letter of sufficient length.");
    formData.append("gdprConsent", "true");

    const req = new Request(testAppUrl, { method: "POST", body: formData, headers: { "x-test-client-key": "test-applications-suite" } });
    const res = await postApply(req, { params: Promise.resolve({ id: jobId }) });

    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);

    const app = await Application.findOne({ email: "resume-test1@example.com" });
    assert.ok(app);
    assert.ok(!app.resumeAssetId);
  });

  test("2) & 3) Valid PDF resume succeeds and resumeAssetId is persisted", async () => {
    const formData = new FormData();
    formData.append("name", "Test User 2");
    formData.append("email", "resume-test2@example.com");
    formData.append("coverLetter", "This is a cover letter of sufficient length.");
    formData.append("gdprConsent", "true");

    const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a]);
    const file = new File([pdfBuffer], "resume.pdf", { type: "application/pdf" });
    formData.append("resume", file);

    const req = new Request(testAppUrl, { method: "POST", body: formData, headers: { "x-test-client-key": "test-applications-suite" } });
    const res = await postApply(req, { params: Promise.resolve({ id: jobId }) });

    assert.strictEqual(res.status, 201);

    const app = await Application.findOne({ email: "resume-test2@example.com" });
    assert.ok(app);
    assert.ok(app.resumeAssetId);

    const media = await Media.findById(app.resumeAssetId);
    assert.ok(media);
    assert.strictEqual(media.mimeType, "application/pdf");
    assert.ok(media.url.includes("test.public.blob.vercel-storage.com"));
  });

  test("4) Valid DOC resume succeeds", async () => {
    const formData = new FormData();
    formData.append("name", "Test User Doc");
    formData.append("email", "resume-test-doc@example.com");
    formData.append("coverLetter", "This is a cover letter of sufficient length.");
    formData.append("gdprConsent", "true");

    const docBuffer = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    const file = new File([docBuffer], "resume.doc", { type: "application/msword" });
    formData.append("resume", file);

    const req = new Request(testAppUrl, { method: "POST", body: formData, headers: { "x-test-client-key": "test-applications-suite" } });
    const res = await postApply(req, { params: Promise.resolve({ id: jobId }) });

    assert.strictEqual(res.status, 201);
    const app = await Application.findOne({ email: "resume-test-doc@example.com" });
    assert.ok(app?.resumeAssetId);
  });

  test("5) Valid DOCX resume succeeds", async () => {
    const formData = new FormData();
    formData.append("name", "Test User Docx");
    formData.append("email", "resume-test-docx@example.com");
    formData.append("coverLetter", "This is a cover letter of sufficient length.");
    formData.append("gdprConsent", "true");

    const zipBuffer = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
    const wordBuffer = Buffer.from("word/document.xml");
    const docxBuffer = Buffer.concat([zipBuffer, wordBuffer]);

    const file = new File([docxBuffer], "resume.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    formData.append("resume", file);

    const req = new Request(testAppUrl, { method: "POST", body: formData, headers: { "x-test-client-key": "test-applications-suite" } });
    const res = await postApply(req, { params: Promise.resolve({ id: jobId }) });

    assert.strictEqual(res.status, 201);
    const app = await Application.findOne({ email: "resume-test-docx@example.com" });
    assert.ok(app?.resumeAssetId);
  });

  test("6) Invalid extension/MIME is rejected", async () => {
    const formData = new FormData();
    formData.append("name", "Test User 3");
    formData.append("email", "resume-test3@example.com");
    formData.append("coverLetter", "This is a cover letter of sufficient length.");
    formData.append("gdprConsent", "true");

    const invalidBuffer = Buffer.from("<html><script>alert(1)</script></html>");
    const file = new File([invalidBuffer], "resume.html", { type: "text/html" });
    formData.append("resume", file);

    const req = new Request(testAppUrl, { method: "POST", body: formData, headers: { "x-test-client-key": "test-applications-suite" } });
    const res = await postApply(req, { params: Promise.resolve({ id: jobId }) });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.message.includes("Resume must be a PDF, DOC, or DOCX"));
  });

  test("7) Fake PDF with incorrect magic bytes is rejected", async () => {
    const formData = new FormData();
    formData.append("name", "Test User 4");
    formData.append("email", "resume-test4@example.com");
    formData.append("coverLetter", "This is a cover letter of sufficient length.");
    formData.append("gdprConsent", "true");

    const fakeBuffer = Buffer.from("just some random text");
    const file = new File([fakeBuffer], "fake.pdf", { type: "application/pdf" });
    formData.append("resume", file);

    const req = new Request(testAppUrl, { method: "POST", body: formData, headers: { "x-test-client-key": "test-applications-suite" } });
    const res = await postApply(req, { params: Promise.resolve({ id: jobId }) });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.message.includes("Invalid resume file content"));
  });

  test("8) Resume larger than 4MB is rejected", async () => {
    const formData = new FormData();
    formData.append("name", "Test User Big");
    formData.append("email", "resume-test-big@example.com");
    formData.append("coverLetter", "This is a cover letter of sufficient length.");
    formData.append("gdprConsent", "true");

    const bigBuffer = Buffer.alloc(4 * 1024 * 1024 + 10);
    const file = new File([bigBuffer], "resume.pdf", { type: "application/pdf" });
    formData.append("resume", file);

    const req = new Request(testAppUrl, { method: "POST", body: formData, headers: { "x-test-client-key": "test-applications-suite" } });
    const res = await postApply(req, { params: Promise.resolve({ id: jobId }) });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.message.includes("Resume must be 4MB or smaller"));
  });

  test("9) Existing text validation still works", async () => {
    const formData = new FormData();
    formData.append("name", "X"); // Too short
    formData.append("email", "not-an-email");
    formData.append("gdprConsent", "false");

    const req = new Request(testAppUrl, { method: "POST", body: formData, headers: { "x-test-client-key": "test-applications-suite" } });
    const res = await postApply(req, { params: Promise.resolve({ id: jobId }) });

    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.ok(body.fields.name);
    assert.ok(body.fields.email);
  });

  test("10) Honeypot behavior is preserved", async () => {
    const formData = new FormData();
    formData.append("name", "Spammer");
    formData.append("email", "resume-test-spam@example.com");
    formData.append("coverLetter", "This is a cover letter of sufficient length.");
    formData.append("gdprConsent", "true");
    formData.append("website", "http://spam.com"); // Honeypot filled

    const req = new Request(testAppUrl, { method: "POST", body: formData, headers: { "x-test-client-key": "test-applications-suite" } });
    const res = await postApply(req, { params: Promise.resolve({ id: jobId }) });

    assert.strictEqual(res.status, 201);

    // Ensure no application was actually created
    const app = await Application.findOne({ email: "resume-test-spam@example.com" });
    assert.strictEqual(app, null);
  });

  test("11) Same-origin protection is preserved", async () => {
    const formData = new FormData();
    formData.append("name", "Cross Origin");

    // In test environments, NODE_ENV="test", so assertSameOrigin might pass if origin is not checked properly?
    // Wait, let's mock headers
    const req = new Request(testAppUrl, {
      method: "POST",
      body: formData,
      headers: {
        "Origin": "http://evil.com",
        "x-test-client-key": "test-applications-suite"
      }
    });

    // In lib/api/request.ts, if origin matches expected origin, it succeeds.
    // If not, it fails.
    const res = await postApply(req, { params: Promise.resolve({ id: jobId }) });
    assert.strictEqual(res.status, 403);
  });

  test("12) Blob/upload failure cleans up correctly", async () => {
    const formData = new FormData();
    formData.append("name", "Test User Fail");
    // Use an email that causes a duplicate error in createApplication
    formData.append("email", "resume-test2@example.com"); // Created in test 2
    formData.append("coverLetter", "This is a cover letter of sufficient length.");
    formData.append("gdprConsent", "true");

    const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a]);
    const file = new File([pdfBuffer], "resume-dup.pdf", { type: "application/pdf" });
    formData.append("resume", file);

    const initialMediaCount = await Media.countDocuments({ altText: "Applicant Resume" });

    const req = new Request(testAppUrl, { method: "POST", body: formData, headers: { "x-test-client-key": "test-applications-suite" } });
    const res = await postApply(req, { params: Promise.resolve({ id: jobId }) });

    assert.strictEqual(res.status, 409); // CONFLICT

    // Verify media was rolled back
    const finalMediaCount = await Media.countDocuments({ altText: "Applicant Resume" });
    assert.strictEqual(finalMediaCount, initialMediaCount);
  });
});
