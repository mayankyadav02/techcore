import { describe, it } from "node:test";
import assert from "node:assert";
import { formatAuditAction } from "../lib/admin/audit-format";

describe("formatAuditAction", () => {
  it("formats known actions correctly", () => {
    assert.strictEqual(formatAuditAction("content.update"), "Updated content");
    assert.strictEqual(formatAuditAction("email.test"), "Sent test email");
    assert.strictEqual(formatAuditAction("user.create"), "Created user");
  });

  it("provides a reasonable fallback for unknown actions", () => {
    assert.strictEqual(formatAuditAction("unknown.action"), "Unknown Action");
    assert.strictEqual(formatAuditAction("something.new.happened"), "Something New Happened");
    assert.strictEqual(formatAuditAction("singleword"), "Singleword");
  });
});
