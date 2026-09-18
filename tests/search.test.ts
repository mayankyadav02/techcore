import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import mongoose from "mongoose";
import { searchPublicContent } from "../modules/search/public.service";
import { Service } from "../modules/catalog/service.model";
import { Job } from "../modules/careers/job.model";
import { BlogPost } from "../modules/insights/blog-post.model";
import { Project } from "../modules/work/project.model";
import { Solution } from "../modules/catalog/solution.model";
import { Industry } from "../modules/catalog/industry.model";

const UNIQUE_TERM = "XYZABC123";

import { connectMongo } from "../lib/db";
import { htmlToSearchText } from "../modules/insights/blog-search-text";

before(async () => {
  await connectMongo();

  
  try { await mongoose.connection.collection("services").dropIndex("service_text_idx"); } catch (e) {}
  try { await mongoose.connection.collection("jobs").dropIndex("job_text_idx"); } catch (e) {}
  try { await mongoose.connection.collection("posts").dropIndex("blog_post_text_idx"); } catch (e) {}
  try { await mongoose.connection.collection("projects").dropIndex("project_text_idx"); } catch (e) {}
  try { await mongoose.connection.collection("solutions").dropIndex("solution_text_idx"); } catch (e) {}
  try { await mongoose.connection.collection("industries").dropIndex("industry_text_idx"); } catch (e) {}


  await Service.syncIndexes();
  await Job.syncIndexes();
  await BlogPost.syncIndexes();
  await Project.syncIndexes();
  await Solution.syncIndexes();
  await Industry.syncIndexes();

  await Service.deleteMany({ title: new RegExp(UNIQUE_TERM) });
  await Job.deleteMany({ title: new RegExp(UNIQUE_TERM) });
  await BlogPost.deleteMany({ title: new RegExp(UNIQUE_TERM) });
  await Service.deleteMany({ slug: "crossmodel-service" });
  await BlogPost.deleteMany({ slug: "crossmodel-blog" });
  await BlogPost.deleteMany({ slug: /weighttest/ });

  await Service.create({
    title: `Published ${UNIQUE_TERM} Service`,
    slug: `pub-srv-${UNIQUE_TERM.toLowerCase()}`,
    summary: `Summary with ${UNIQUE_TERM}`,
    body: "Body",
    status: "published",
    sortOrder: 1
  });

  await Service.create({
    title: `Draft ${UNIQUE_TERM} Service`,
    slug: `draft-srv-${UNIQUE_TERM.toLowerCase()}`,
    summary: `Draft with ${UNIQUE_TERM}`,
    body: "Draft.",
    status: "draft",
    sortOrder: 2
  });

  await Service.create({
    title: `Deleted ${UNIQUE_TERM} Service`,
    slug: `del-srv-${UNIQUE_TERM.toLowerCase()}`,
    summary: `Deleted with ${UNIQUE_TERM}`,
    body: "Deleted.",
    status: "published",
    deletedAt: new Date(),
    sortOrder: 3
  });

  await Job.create({
    title: `Open ${UNIQUE_TERM} Job`,
    slug: `open-job-${UNIQUE_TERM.toLowerCase()}`,
    department: "Engineering",
    location: "Remote",
    description: `Looking for ${UNIQUE_TERM} expert.`,
    status: "open",
    employmentType: "Full-time"
  });

  await Job.create({
    title: `Closed ${UNIQUE_TERM} Job`,
    slug: `closed-job-${UNIQUE_TERM.toLowerCase()}`,
    department: "Engineering",
    location: "Remote",
    description: `Closed ${UNIQUE_TERM}.`,
    status: "closed",
    employmentType: "Full-time"
  });

  await BlogPost.create({
    title: `Published ${UNIQUE_TERM} Blog`,
    slug: `pub-blog-${UNIQUE_TERM.toLowerCase()}`,
    excerpt: `Blog ${UNIQUE_TERM}.`,
    body: "Body",
    plainTextBody: "Body",
    category: "Technology",
    authorName: "John Doe",
    status: "published"
  });

  await BlogPost.create({
    title: `Draft ${UNIQUE_TERM} Blog`,
    slug: `draft-blog-${UNIQUE_TERM.toLowerCase()}`,
    excerpt: `Draft ${UNIQUE_TERM}.`,
    body: "Draft.",
    plainTextBody: "Draft.",
    category: "Technology",
    authorName: "John Doe",
    status: "draft"
  });

  
  await Service.create({ title: 'Service Title', slug: 'crossmodel-service', summary: 'Service Summary', body: 'Service body with CROSSMODEL123 inside it.', status: 'published', sortOrder: 10 });
  await BlogPost.create({ title: 'Blog Title CROSSMODEL123', slug: 'crossmodel-blog', excerpt: 'Blog Excerpt', body: 'Body', plainTextBody: 'Body', category: 'Technology', authorName: 'John Doe', status: 'published' });
  await BlogPost.create({ title: 'Blog Title WEIGHTTEST123', slug: 'weighttest-blog-a', excerpt: 'Blog Excerpt A', body: 'Body A', plainTextBody: 'Body A', category: 'Technology', authorName: 'John Doe', status: 'published' });
  await BlogPost.create({ title: 'Blog Title B', slug: 'weighttest-blog-b', excerpt: 'Blog Excerpt B', body: 'Body B with WEIGHTTEST123', plainTextBody: 'Body B with WEIGHTTEST123', category: 'Technology', authorName: 'John Doe', status: 'published' });

  const htmlBody = '<div class="hidden-attr-unique-123">\\n  <a href="https://fakedomain.com/some-path">\\n    Visible Search Text\\n  </a>\\n</div>\\n<h2>React Development</h2>\\n<p>Hello</p>\\n<p>World</p>';
  await BlogPost.create({
    title: `HTML ${UNIQUE_TERM} Blog`,
    slug: `html-blog-${UNIQUE_TERM.toLowerCase()}`,
    excerpt: `HTML Blog ${UNIQUE_TERM}.`,
    body: htmlBody,
    plainTextBody: htmlToSearchText(htmlBody),
    category: "Technology",
    authorName: "John Doe",
    status: "published"
  });
});

after(async () => {
  await Service.deleteMany({ title: new RegExp(UNIQUE_TERM) });
  await Job.deleteMany({ title: new RegExp(UNIQUE_TERM) });
  await BlogPost.deleteMany({ title: new RegExp(UNIQUE_TERM) });
  await mongoose.disconnect();
});

describe("Public Search Service", () => {
  it("should return empty array for blank query", async () => {
    const results = await searchPublicContent("   ");
    assert.strictEqual(results.length, 0);
  });

  it("should truncate long queries", async () => {
    const longQuery = "a".repeat(200);
    const results = await searchPublicContent(longQuery);
    assert.ok(Array.isArray(results));
  });

  it("should find published Service and exclude draft/deleted", async () => {
    const results = await searchPublicContent(UNIQUE_TERM);

    const services = results.filter(r => r.type === "service");
    assert.strictEqual(services.length, 1);
    assert.strictEqual(services[0].title, `Published ${UNIQUE_TERM} Service`);
  });

  it("should find open Job and exclude closed", async () => {
    const results = await searchPublicContent(UNIQUE_TERM);

    const jobs = results.filter(r => r.type === "job");
    assert.strictEqual(jobs.length, 1);
    assert.strictEqual(jobs[0].title, `Open ${UNIQUE_TERM} Job`);
  });

  it("should find published BlogPost and exclude draft", async () => {
    const results = await searchPublicContent(UNIQUE_TERM);

    const blogs = results.filter(r => r.type === "blog");
    assert.strictEqual(blogs.length, 2);
    assert.ok(blogs.some(b => b.title === `Published ${UNIQUE_TERM} Blog`));
  });

  it("should normalize result shape", async () => {
    const results = await searchPublicContent(UNIQUE_TERM);
    const result = results[0];

    assert.ok(result.type);
    assert.ok(result.title);
    assert.ok(result.slug);
    assert.ok(result.description);
    assert.ok(result.href);
  });

  it("should NOT find blog post by HTML tags or attributes", async () => {
    const r1 = await searchPublicContent("hidden-attr-unique-123");
    assert.strictEqual(r1.filter(r => r.slug === `html-blog-${UNIQUE_TERM.toLowerCase()}`).length, 0);

    const r2 = await searchPublicContent("fakedomain");
    assert.strictEqual(r2.filter(r => r.slug === `html-blog-${UNIQUE_TERM.toLowerCase()}`).length, 0);

    const r3 = await searchPublicContent("href");
    assert.strictEqual(r3.filter(r => r.slug === `html-blog-${UNIQUE_TERM.toLowerCase()}`).length, 0);

    const r4 = await searchPublicContent("div");
    assert.strictEqual(r4.filter(r => r.slug === `html-blog-${UNIQUE_TERM.toLowerCase()}`).length, 0);

    const r5 = await searchPublicContent("class");
    assert.strictEqual(r5.filter(r => r.slug === `html-blog-${UNIQUE_TERM.toLowerCase()}`).length, 0);
  });

  it("should find blog post by visible text", async () => {
    const results = await searchPublicContent("Visible Search Text");
    assert.ok(results.some(r => r.slug === `html-blog-${UNIQUE_TERM.toLowerCase()}`));
  });

  it("should find blog post by heading text", async () => {
    const results = await searchPublicContent("React Development");
    assert.ok(results.some(r => r.slug === `html-blog-${UNIQUE_TERM.toLowerCase()}`));
  });

  it("should find blog post by paragraph boundaries independently", async () => {
    const r1 = await searchPublicContent("Hello");
    assert.ok(r1.some(r => r.slug === `html-blog-${UNIQUE_TERM.toLowerCase()}`));

    const r2 = await searchPublicContent("World");
    assert.ok(r2.some(r => r.slug === `html-blog-${UNIQUE_TERM.toLowerCase()}`));

    const r3 = await searchPublicContent("HelloWorld");
    assert.strictEqual(r3.filter(r => r.slug === `html-blog-${UNIQUE_TERM.toLowerCase()}`).length, 0);
  });

  it("should enforce global cross-model ordering by score", async () => {
    const results = await searchPublicContent("CROSSMODEL123");
    assert.ok(results.length >= 2, "Should find at least two results");
    
    // The blog with title match (weight 10) should appear before the service with body match (weight 1)
    const blogIndex = results.findIndex(r => r.slug === "crossmodel-blog");
    const serviceIndex = results.findIndex(r => r.slug === "crossmodel-service");
    
    assert.ok(blogIndex !== -1, "Blog should be found");
    assert.ok(serviceIndex !== -1, "Service should be found");
    assert.ok(blogIndex < serviceIndex, "Blog (title match) should be ranked before Service (body match)");
  });

  it("should rank title matches higher than body matches within same model", async () => {
    const results = await searchPublicContent("WEIGHTTEST123");
    assert.ok(results.length >= 2, "Should find at least two results");
    
    const indexA = results.findIndex(r => r.slug === "weighttest-blog-a");
    const indexB = results.findIndex(r => r.slug === "weighttest-blog-b");
    
    assert.ok(indexA !== -1, "Blog A should be found");
    assert.ok(indexB !== -1, "Blog B should be found");
    assert.ok(indexA < indexB, "Blog A (title match) should be ranked before Blog B (body match)");
  });

  it("should not expose internal score properties in public SearchResult", async () => {
    const results = await searchPublicContent(UNIQUE_TERM);
    assert.ok(results.length > 0);
    const result = results[0];
    
    assert.strictEqual((result as any).score, undefined, "score should not be exposed");
    assert.strictEqual((result as any)._internalScore, undefined, "_internalScore should not be exposed");
  });
});
