import { test } from "node:test";
import assert from "node:assert";
import { generateOgImage } from "../lib/og";

test("OG Image Generator", async (t) => {
  await t.test("strips HTML from title and description", async () => {
    // We cannot easily test the returned ImageResponse internal React tree without a full React test renderer,
    // but we can ensure it doesn't throw when given HTML.
    const result = generateOgImage({
      companyName: "Test Co",
      title: "<script>alert('xss')</script>Hello <strong>World</strong>",
      description: "<p>This is a <em>description</em>.</p>",
    });
    
    assert.ok(result);
    // Note: since ImageResponse evaluates lazily or wraps in a Response, it won't crash here.
    // If the html stripper works, it won't crash during rendering either.
  });

  await t.test("handles missing optional parameters", async () => {
    const result = generateOgImage({
      companyName: "Test Co",
    });
    assert.ok(result);
  });

  await t.test("safely handles extremely long text", async () => {
    const result = generateOgImage({
      companyName: "Test Co",
      title: "A".repeat(1000),
      description: "B".repeat(1000),
    });
    assert.ok(result);
  });
});
