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

before(async () => {
  await connectMongo();
  
  await Service.syncIndexes();
  await Job.syncIndexes();
  await BlogPost.syncIndexes();
  await Project.syncIndexes();
  await Solution.syncIndexes();
  await Industry.syncIndexes();

  await Service.deleteMany({ title: new RegExp(UNIQUE_TERM) });
  await Job.deleteMany({ title: new RegExp(UNIQUE_TERM) });
  await BlogPost.deleteMany({ title: new RegExp(UNIQUE_TERM) });

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
    category: "Technology",
    authorName: "John Doe",
    status: "published"
  });

  await BlogPost.create({
    title: `Draft ${UNIQUE_TERM} Blog`,
    slug: `draft-blog-${UNIQUE_TERM.toLowerCase()}`,
    excerpt: `Draft ${UNIQUE_TERM}.`,
    body: "Draft.",
    category: "Technology",
    authorName: "John Doe",
    status: "draft"
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
    assert.strictEqual(blogs.length, 1);
    assert.strictEqual(blogs[0].title, `Published ${UNIQUE_TERM} Blog`);
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
});
