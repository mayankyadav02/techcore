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
    assert.strictEqual(sanitizeHtml(input), "<a href=\"#\">Click me</a><img src=\"x\" />");
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

  it("preserves safe image HTML", () => {
    const input = '<img src="https://example.com/image.webp" alt="Example">';
    assert.strictEqual(sanitizeHtml(input), '<img src="https://example.com/image.webp" alt="Example" />');
  });

  it("removes dangerous image event handlers", () => {
    const input = '<img src="https://example.com/image.jpg" onerror="alert(1)" onload="evil()" onclick="bad()">';
    assert.strictEqual(sanitizeHtml(input), '<img src="https://example.com/image.jpg" />');
  });

  it("neutralizes javascript image sources", () => {
    const input = '<img src="javascript:alert(1)" alt="evil">';
    assert.strictEqual(sanitizeHtml(input), '<img alt="evil" />');
  });

  it("blocks data URL image sources", () => {
    const input = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="data">';
    // DOMPurify strips data URIs by default unless ADD_URI_SAFE_ATTR is configured for it
    assert.strictEqual(sanitizeHtml(input), '<img alt="data" />');
  });

  it("removes arbitrary attributes from images", () => {
    const input = '<img src="https://example.com/image.jpg" data-custom="123" style="width:100%">';
    assert.strictEqual(sanitizeHtml(input), '<img src="https://example.com/image.jpg" />');
  });
});
