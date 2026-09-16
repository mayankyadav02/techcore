import { describe, it } from "node:test";
import assert from "node:assert";
import { sanitizeHtml } from "../lib/sanitize";

describe("Server-side Sanitization", () => {
  it("preserves valid formatted HTML", () => {
    const input = "<p>This is <strong>bold</strong> and <em>italic</em>.</p>";
    assert.strictEqual(sanitizeHtml(input), input);
  });

  it("removes <script> tags", () => {
    const input = "<p>Hello</p><script>alert('xss')</script>";
    assert.strictEqual(sanitizeHtml(input), "<p>Hello</p>");
  });

  it("removes event handlers like onclick and onerror", () => {
    const input = "<a href='#' onclick='stealData()'>Click me</a><img src='x' onerror='alert(1)'>";
    assert.strictEqual(sanitizeHtml(input), "<a href=\"#\">Click me</a>");
  });

  it("makes javascript: links safe", () => {
    const input = "<a href='javascript:alert(1)'>Click me</a>";
    // DOMPurify removes the dangerous href entirely
    assert.strictEqual(sanitizeHtml(input), "<a>Click me</a>");
  });

  it("removes iframe, object, embed", () => {
    const input = "<iframe src='evil.com'></iframe><object></object><embed>";
    assert.strictEqual(sanitizeHtml(input), "");
  });

  it("leaves plain text safe", () => {
    const input = "Just some plain text.";
    assert.strictEqual(sanitizeHtml(input), "Just some plain text.");
  });

  it("handles empty content safely", () => {
    assert.strictEqual(sanitizeHtml(""), "");
    assert.strictEqual(sanitizeHtml(undefined), "");
  });
});
