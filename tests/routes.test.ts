import "./load-env";
import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import { GET as getServices } from "@/app/api/services/route";
import { GET as getService } from "@/app/api/services/[slug]/route";
import { POST as postContact } from "@/app/api/contact/route";
import { POST as postEnquiry } from "@/app/api/enquiries/route";
import { GET as getJob } from "@/app/api/jobs/[id]/route";
import { POST as postApply } from "@/app/api/jobs/[id]/apply/route";
import { disconnectMongo } from "@/lib/db";

function request(url: string, init?: RequestInit) {
  return new Request(url, init);
}

describe("public API routes", () => {
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
