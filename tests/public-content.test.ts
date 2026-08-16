import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AppError } from "@/lib/errors";
import { staticParamsFrom } from "@/lib/public-load";
import {
  asStringArray,
  isIconName,
  mapJob,
  mapPost,
  mapProject,
  mapService,
  mapTestimonial,
} from "@/lib/public-mappers";
import { relatedProjectList } from "@/lib/content/projects";
import { projectFilterTags, projectMatchesFilter } from "@/lib/work/portfolio-filters";

describe("public content mapping", () => {
  it("maps a published service document onto the public view model", () => {
    const view = mapService({
      slug: "web-development",
      title: "Web Development",
      summary: "Secure web platforms.",
      body: "Overview from CMS.",
      highlights: ["Portals", "Dashboards"],
      features: ["Accessible UI"],
      icon: "web",
      featured: true,
    });
    assert.equal(view.overview, "Overview from CMS.");
    assert.deepEqual(view.capabilities, ["Portals", "Dashboards"]);
    assert.equal(view.icon, "web");
    assert.equal(view.featured, true);
  });

  it("does not copy private job or identity fields onto the public view", () => {
    const view = mapJob({
      id: "64b000000000000000000001",
      slug: "frontend-developer",
      title: "Frontend Developer",
      department: "Engineering",
      location: "Hybrid",
      employmentType: "Full-time",
      experience: "4+ years",
      description: "Build interfaces.",
      applicationsCount: 42,
      createdBy: "64b000000000000000000099",
      passwordHash: "not-a-hash",
    });
    assert.equal("applicationsCount" in view, false);
    assert.equal("createdBy" in view, false);
    assert.equal("passwordHash" in view, false);
  });

  it("drops catalogue rows that cannot render a card", async () => {
    const { mapPublicServices, featuredThenFill } = await import("@/lib/public-mappers");
    const rows = mapPublicServices([
      { slug: "", title: "Missing slug", summary: "x" },
      { slug: "web-development", title: "Web Development", summary: "Sites." },
    ]);
    assert.equal(rows.length, 1);
    assert.equal(rows[0]?.slug, "web-development");
    assert.deepEqual(
      featuredThenFill(
        [
          { title: "A", featured: false },
          { title: "B", featured: true },
          { title: "C", featured: false },
        ],
        2,
      ).map((item) => item.title),
      ["B", "A"],
    );
  });

  it("splits job requirements stored as a single CMS string", () => {
    const view = mapJob({
      id: "64b000000000000000000001",
      slug: "frontend-developer",
      title: "Frontend Developer",
      department: "Engineering",
      location: "Hybrid",
      employmentType: "Full-time",
      experience: "4+ years",
      description: "Build interfaces.",
      requirements: "• TypeScript\n• React",
      responsibilities: ["Ship UI"],
      skills: ["Next.js"],
    });
    assert.equal(view.id, "64b000000000000000000001");
    assert.deepEqual(view.requirements, ["TypeScript", "React"]);
  });

  it("turns blog body markdown into paragraphs", () => {
    const view = mapPost({
      slug: "a-practical-path-to-production-ai",
      title: "A practical path",
      excerpt: "Start small.",
      category: "AI",
      body: "First paragraph.\n\nSecond paragraph.",
      publishedAt: "2026-03-04T00:00:00.000Z",
      readTime: "7 min",
    });
    assert.equal(view.body.length, 2);
    assert.equal(view.category, "AI");
  });

  it("maps testimonials for the home page", () => {
    const view = mapTestimonial({
      quote: "Finished work.",
      authorName: "A. Rahman",
      authorRole: "Operations Director",
      company: "Fictional logistics group",
    });
    assert.equal(view.name, "A. Rahman");
    assert.match(view.role, /Operations Director/);
  });

  it("recognises known service icons only", () => {
    assert.equal(isIconName("web"), true);
    assert.equal(isIconName("sparkles"), false);
  });

  it("normalises mixed list values", () => {
    assert.deepEqual(asStringArray("• One\nTwo"), ["One", "Two"]);
    assert.deepEqual(asStringArray([" A ", ""]), ["A"]);
  });

  it("maps project metrics and merges fictional presentation fields by slug", () => {
    const view = mapProject({
      slug: "shopflow",
      title: "ShopFlow",
      sector: "Retail operations",
      summary: "Merchandising workspace.",
      overview: "Fictional retail ops.",
      challenge: "Split stock views.",
      solution: "One catalogue record.",
      features: ["Shared catalogue"],
      technology: ["Next.js"],
      results: ["Demo outcome: shared catalogue."],
      metrics: [{ label: "Demo outcome", value: "Shared catalogue truth" }],
    });
    assert.equal(view.kind, "Demo Project");
    assert.ok(view.approach);
    assert.ok((view.timeline ?? []).length > 0);
    assert.equal(view.metrics?.[0]?.value, "Shared catalogue truth");
    assert.ok(view.serviceSlugs?.includes("web-development"));
  });
});

describe("portfolio listing filters", () => {
  it("maps CMS sector and services onto listing chips without new DB categories", () => {
    const shopflow = mapProject({
      slug: "shopflow",
      title: "ShopFlow",
      sector: "Retail operations",
      summary: "Catalogue and checkout operations.",
      overview: "Inventory workspace.",
      challenge: "x",
      solution: "y",
      technology: ["Next.js"],
    });
    const tags = projectFilterTags(shopflow);
    assert.ok(tags.includes("E-commerce"));
    assert.ok(tags.includes("Web"));
    assert.equal(projectMatchesFilter(shopflow, "Mobile"), false);
  });

  it("ranks related programmes by sector and shared services", () => {
    const related = relatedProjectList(
      [
        {
          slug: "shopflow",
          sector: "Retail operations",
          serviceSlugs: ["web-development"],
        },
        {
          slug: "foodhub",
          sector: "Hospitality operations",
          serviceSlugs: ["custom-software"],
        },
        {
          slug: "estatepro",
          sector: "Retail operations",
          serviceSlugs: ["web-development"],
        },
      ],
      "shopflow",
      2,
    );
    assert.equal(related[0]?.slug, "estatepro");
  });
});

describe("public load fallbacks", () => {
  it("returns empty lists when Mongo is unavailable", async () => {
    const { loadListOrEmpty } = await import("@/lib/public-load");
    const rows = await loadListOrEmpty(async () => {
      throw new Error("ECONNREFUSED");
    });
    assert.equal(rows.length, 0);
  });

  it("treats unpublished documents as missing, not as a crash", async () => {
    const { loadOneOrEmpty } = await import("@/lib/public-load");
    const missing = await loadOneOrEmpty(async () => {
      throw new AppError("NOT_FOUND", "Service not found.");
    });
    assert.equal(missing, undefined);
  });

  it("uses static slugs when generateStaticParams cannot reach Mongo", async () => {
    const params = await staticParamsFrom(async () => {
      throw new Error("MONGODB_URI is not configured.");
    }, [{ slug: "shopflow" }]);
    assert.deepEqual(params, [{ slug: "shopflow" }]);
  });
});

describe("public stats labels", () => {
  it("omits empty counts and uses a plus suffix from 10", async () => {
    const { formatCountStat } = await import("@/components/marketing/stats-strip");
    assert.equal(formatCountStat(0, "Project", "Projects"), null);
    assert.deepEqual(formatCountStat(1, "Project", "Projects"), {
      value: "1",
      label: "Project",
    });
    assert.deepEqual(formatCountStat(12, "Project", "Projects"), {
      value: "12+",
      label: "Projects",
    });
  });

  it("resolves slug-named webp files and catalogue aliases", async () => {
    const { catalogImage, listPublicImages, publicAssetIfExists } = await import(
      "@/lib/public-images"
    );
    assert.equal(catalogImage("home", "hero-01"), "/images/home/hero-01.webp");
    assert.equal(catalogImage("home", "hero-02"), "/images/home/hero-02.webp");
    assert.equal(catalogImage("home", "hero-03"), "/images/home/hero-03.webp");
    assert.equal(
      catalogImage("home", "software-development"),
      "/images/home/software-development.webp",
    );
    assert.equal(catalogImage("solutions", "healthcare"), "/images/solutions/healthcare.webp");
    assert.equal(catalogImage("solutions", "e-commerce"), "/images/solutions/ecommerce.webp");
    assert.equal(catalogImage("solutions", "finance"), "/images/solutions/fintech.webp");
    assert.equal(catalogImage("industries", "healthcare"), "/images/industries/healthcare.webp");
    assert.equal(catalogImage("industries", "retail"), "/images/industries/ecommerce.webp");
    assert.equal(catalogImage("industries", "finance"), "/images/industries/finance.webp");
    assert.ok(listPublicImages("images/home").includes("/images/home/hero-01.webp"));
    assert.equal(publicAssetIfExists("images/missing.png"), null);
    assert.ok(publicAssetIfExists("logo.light.png"));
  });
});
