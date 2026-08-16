import "./load-env";
import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import { GET as getServices } from "@/app/api/services/route";
import { GET as getService } from "@/app/api/services/[slug]/route";
import { GET as getJobs } from "@/app/api/jobs/route";
import { connectMongo, disconnectMongo } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { Service } from "@/modules/catalog/service.model";
import {
  getPublishedService,
  listPublishedServices,
} from "@/modules/catalog/public.service";
import { listPublishedSolutions } from "@/modules/catalog/public.service";
import { listPublishedIndustries } from "@/modules/catalog/public.service";
import { listPublishedProjects } from "@/modules/work/public.service";
import { listPublishedPosts } from "@/modules/insights/public.service";
import { listOpenJobs } from "@/modules/careers/public.service";
import { listPublishedTestimonials } from "@/modules/social-proof/public.service";

const probeSlug = "cms-sync-probe";

describe("admin CMS to public Mongo visibility", () => {
  it("returns published catalogue counts from Atlas", async () => {
    const [services, solutions, industries, projects, posts, jobs, testimonials] =
      await Promise.all([
        listPublishedServices(),
        listPublishedSolutions(),
        listPublishedIndustries(),
        listPublishedProjects(),
        listPublishedPosts(),
        listOpenJobs(),
        listPublishedTestimonials(),
      ]);
    assert.ok(services.length > 0, "expected published services");
    assert.ok(solutions.length > 0, "expected published solutions");
    assert.ok(industries.length > 0, "expected published industries");
    assert.ok(projects.length > 0, "expected published projects");
    assert.ok(posts.length > 0, "expected published posts");
    assert.ok(jobs.length > 0, "expected open jobs");
    assert.ok(testimonials.length > 0, "expected published testimonials");
    assert.ok(!("applicationsCount" in (jobs[0] ?? {})));
    assert.ok(!("createdBy" in (services[0] ?? {})));
    assert.ok(!("passwordHash" in (services[0] ?? {})));
  });

  it("hides a service from the public list after it is unpublished", async () => {
    await connectMongo();
    await Service.findOneAndUpdate(
      { slug: probeSlug },
      {
        title: "CMS Sync Probe",
        slug: probeSlug,
        summary: "Temporary document used to verify public visibility rules.",
        body: "Temporary document used to verify public visibility rules.",
        status: "published",
        deletedAt: null,
        featured: false,
        sortOrder: 999,
      },
      { upsert: true, setDefaultsOnInsert: true },
    );

    const published = await listPublishedServices();
    assert.ok(published.some((row) => row.slug === probeSlug));
    await getPublishedService(probeSlug);

    const listResponse = await getServices();
    const listBody = (await listResponse.json()) as {
      success: boolean;
      data?: { slug: string; createdBy?: unknown; applicationsCount?: unknown }[];
    };
    assert.equal(listResponse.status, 200);
    assert.ok(listBody.data?.some((item) => item.slug === probeSlug));
    assert.ok(listBody.data?.every((item) => item.createdBy === undefined));

    await Service.updateOne({ slug: probeSlug }, { status: "draft" });

    const afterUnpublish = await listPublishedServices();
    assert.equal(
      afterUnpublish.some((row) => row.slug === probeSlug),
      false,
    );
    await assert.rejects(
      () => getPublishedService(probeSlug),
      (error: unknown) => error instanceof AppError && error.code === "NOT_FOUND",
    );

    const unpublished = await getService(new Request("http://localhost/api/services/cms-sync-probe"), {
      params: Promise.resolve({ slug: probeSlug }),
    });
    assert.equal(unpublished.status, 404);

    await Service.updateOne(
      { slug: probeSlug },
      { status: "published", deletedAt: new Date() },
    );
    const afterDelete = await listPublishedServices();
    assert.equal(
      afterDelete.some((row) => row.slug === probeSlug),
      false,
    );
  });

  it("does not expose application counts on the public jobs API", async () => {
    const response = await getJobs();
    const body = (await response.json()) as {
      success: boolean;
      data?: Record<string, unknown>[];
    };
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data?.every((job) => !("applicationsCount" in job)));
    assert.ok(body.data?.every((job) => !("createdBy" in job)));
  });

  after(async () => {
    await connectMongo();
    await Service.deleteOne({ slug: probeSlug });
    await disconnectMongo();
  });
});
