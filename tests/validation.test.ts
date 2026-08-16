import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applicationApiSchema,
  contactApiSchema,
  enquiryApiSchema,
} from "@/modules/leads/schema";
import { parseSlug, parseObjectId, opaqueRecordId } from "@/lib/api/ids";
import { jsonLd } from "@/lib/json-ld";
import { AppError } from "@/lib/errors";

describe("contact validation", () => {
  it("rejects an empty payload", () => {
    const result = contactApiSchema.safeParse({});
    assert.equal(result.success, false);
  });

  it("rejects a malformed email", () => {
    const result = contactApiSchema.safeParse({
      name: "Ada Lovelace",
      email: "not-an-email",
      subject: "Hello there",
      message: "This message is long enough to pass the minimum length.",
      gdprConsent: true,
    });
    assert.equal(result.success, false);
  });

  it("accepts a valid contact payload", () => {
    const result = contactApiSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@techcore.example",
      phone: "+1 555 010 2040",
      subject: "Architecture review",
      message: "This message is long enough to pass the minimum length.",
      gdprConsent: true,
    });
    assert.equal(result.success, true);
  });
});

describe("quote validation", () => {
  it("rejects missing fields", () => {
    const result = enquiryApiSchema.safeParse({ email: "ada@techcore.example" });
    assert.equal(result.success, false);
  });

  it("accepts a valid quote payload", () => {
    const result = enquiryApiSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@techcore.example",
      company: "Analytical Engines",
      service: "web-development",
      budget: "50-150k",
      timeline: "1-3-months",
      description: "We need a replacement for an internal operations portal.",
      gdprConsent: true,
    });
    assert.equal(result.success, true);
  });
});

describe("application validation", () => {
  it("rejects an empty submission", () => {
    const result = applicationApiSchema.safeParse({});
    assert.equal(result.success, false);
  });

  it("rejects missing consent", () => {
    const result = applicationApiSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@techcore.example",
      coverLetter: "I would like to join the engineering practice at TechCore.",
      gdprConsent: false,
    });
    assert.equal(result.success, false);
  });
});

describe("identifiers", () => {
  it("rejects invalid slugs", () => {
    assert.throws(() => parseSlug("INVALID SLUG"), AppError);
  });

  it("rejects invalid object ids", () => {
    assert.throws(() => parseObjectId("not-an-id"), AppError);
  });

  it("returns opaque 24-character hex ids", () => {
    assert.match(opaqueRecordId(), /^[a-f0-9]{24}$/);
  });
});

describe("json-ld", () => {
  it("escapes HTML-sensitive characters", () => {
    const encoded = jsonLd({ name: "A <script> & B" });
    assert.equal(encoded.includes("<"), false);
    assert.equal(encoded.includes(">"), false);
    assert.ok(encoded.includes("\\u003c"));
    assert.ok(encoded.includes("\\u0026"));
  });
});
