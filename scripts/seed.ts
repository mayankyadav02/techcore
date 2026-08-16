import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(name: string) {
  const filePath = resolve(process.cwd(), name);
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env.example");

function seo(
  title: string | undefined,
  description: string | undefined,
  fallbackTitle: string,
  fallbackDescription: string,
) {
  return {
    title: (title ?? fallbackTitle).slice(0, 120),
    description: (description ?? fallbackDescription).slice(0, 320),
  };
}

async function seed() {
  const { connectMongo, disconnectMongo } = await import("@/lib/db");
  const { site } = await import("@/lib/site");
  const { services } = await import("@/lib/content/services");
  const { solutions } = await import("@/lib/content/solutions");
  const { industries } = await import("@/lib/content/industries");
  const { projects } = await import("@/lib/content/projects");
  const { posts } = await import("@/lib/content/posts");
  const { jobs } = await import("@/lib/content/jobs");
  const { testimonials } = await import("@/lib/content/home");
  const { Service } = await import("@/modules/catalog/service.model");
  const { Solution } = await import("@/modules/catalog/solution.model");
  const { Industry } = await import("@/modules/catalog/industry.model");
  const { Project } = await import("@/modules/work/project.model");
  const { BlogPost } = await import("@/modules/insights/blog-post.model");
  const { Job } = await import("@/modules/careers/job.model");
  const { Testimonial } = await import("@/modules/social-proof/testimonial.model");
  const { Settings } = await import("@/modules/content/settings.model");

  await connectMongo();

  const now = new Date();
  const published = {
    status: "published" as const,
    publishedAt: now,
    deletedAt: null,
  };

  const solutionIndustrySlug: Record<string, string> = {
    healthcare: "healthcare",
    education: "education",
    "e-commerce": "retail",
    finance: "finance",
    "real-estate": "real-estate",
    logistics: "logistics",
  };

  try {
    for (const [index, item] of services.entries()) {
      await Service.findOneAndUpdate(
        { slug: item.slug },
        {
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          body: item.overview,
          icon: item.icon,
          highlights: item.capabilities,
          features: item.features,
          technologies: item.technologies,
          benefits: item.benefits,
          process: item.process,
          faqs: item.faqs,
          seo: seo(
            item.seoTitle,
            item.seoDescription,
            item.title,
            item.summary,
          ),
          sortOrder: index,
          featured: index < 4,
          ...published,
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );
    }

    for (const [index, item] of solutions.entries()) {
      const approach = [item.approach, item.implementation]
        .filter(Boolean)
        .join("\n\n");
      await Solution.findOneAndUpdate(
        { slug: item.slug },
        {
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          body: approach,
          problem: item.problem,
          approach,
          outcomes: item.benefits,
          features: item.features,
          technology: item.technology,
          seo: seo(
            item.seoTitle,
            item.seoDescription,
            `${item.title} solutions`,
            item.summary,
          ),
          sortOrder: index,
          featured: true,
          ...published,
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );
    }

    for (const [index, item] of industries.entries()) {
      await Industry.findOneAndUpdate(
        { slug: item.slug },
        {
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          body: item.body,
          focus: item.focus,
          seo: seo(
            item.seoTitle,
            item.seoDescription,
            item.title,
            item.summary,
          ),
          sortOrder: index,
          featured: index < 6,
          ...published,
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );
    }

    for (const [index, item] of projects.entries()) {
      await Project.findOneAndUpdate(
        { slug: item.slug },
        {
          title: item.title,
          slug: item.slug,
          clientName: "Fictional programme",
          sector: item.sector,
          summary: item.summary,
          overview: item.overview,
          challenge: item.challenge,
          solution: item.solution,
          results: item.results,
          features: item.features,
          technology: item.technology,
          metrics: item.metrics ?? [],
          // approach, timeline, kind, mockupLayout are presentation-only in lib/content/projects.ts
          // and merged at map time — they are not Project schema fields.
          galleryUrls: [],
          year: 2026,
          seo: seo(
            item.seoTitle,
            item.seoDescription,
            item.title,
            item.summary,
          ),
          sortOrder: index,
          featured: index < 4,
          ...published,
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );
    }

    for (const [index, item] of posts.entries()) {
      await BlogPost.findOneAndUpdate(
        { slug: item.slug },
        {
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          body: item.body.join("\n\n"),
          authorName: item.authorName ?? "TechCore Practice",
          category: item.category,
          tags: item.tags?.length ? item.tags : [item.category],
          readTime: item.readTime,
          seo: seo(
            item.seoTitle,
            item.seoDescription,
            item.title,
            item.excerpt,
          ),
          featured: index === 0,
          status: "published",
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : now,
          deletedAt: null,
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );
    }

    for (const item of jobs) {
      await Job.findOneAndUpdate(
        { slug: item.slug },
        {
          title: item.title,
          slug: item.slug,
          department: item.department,
          location: item.location,
          employmentType: item.employmentType,
          experience: item.experience,
          description: item.description,
          requirements: item.requirements.map((line) => `• ${line}`).join("\n"),
          benefits:
            "Hybrid working, learning budget, and a delivery culture that prefers finished software over theatre. This listing is fictional.",
          responsibilities: item.responsibilities,
          skills: item.skills,
          status: "open",
          closesAt: item.closesAt ? new Date(item.closesAt) : undefined,
          applicationsCount: 0,
          seo: seo(
            item.seoTitle,
            item.seoDescription,
            item.title,
            item.description.slice(0, 300),
          ),
          deletedAt: null,
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );
    }

    for (const [index, item] of testimonials.entries()) {
      const company =
        "company" in item && typeof item.company === "string"
          ? item.company
          : "Fictional organisation";
      await Testimonial.findOneAndUpdate(
        { authorName: item.name },
        {
          quote: item.quote,
          authorName: item.name,
          authorRole: item.role,
          company,
          rating: 5,
          status: "published",
          featured: true,
          sortOrder: index,
          deletedAt: null,
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );
    }

    await Settings.findOneAndUpdate(
      { key: "global" },
      {
        key: "global",
        companyName: site.name,
        tagline: site.tagline,
        contactEmail: site.email,
        contactPhone: site.phone,
        address: site.address,
        footerText:
          "TechCore is a fictional IT services firm used to demonstrate this platform. Case studies, testimonials, and outcomes are illustrative.",
        socialLinks: {
          linkedin: "https://www.linkedin.com",
          x: "https://x.com",
        },
        defaultSeo: {
          title: "TechCore — Technology That Moves Business",
          description: site.description,
        },
        featureFlags: { careersOpen: true },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    const industryDocs = await Industry.find({ deletedAt: null }).lean();
    const solutionDocs = await Solution.find({ deletedAt: null }).lean();
    const serviceDocs = await Service.find({ deletedAt: null }).lean();
    const industryBySlug = new Map(
      industryDocs.map((doc) => [doc.slug, doc._id]),
    );
    const solutionBySlug = new Map(
      solutionDocs.map((doc) => [doc.slug, doc._id]),
    );
    const serviceBySlug = new Map(
      serviceDocs.map((doc) => [doc.slug, doc._id]),
    );

    for (const item of projects) {
      const industryId = item.industrySlug
        ? industryBySlug.get(item.industrySlug)
        : undefined;
      const solutionId = item.solutionSlug
        ? solutionBySlug.get(item.solutionSlug)
        : undefined;
      const serviceIds = (item.serviceSlugs ?? [])
        .map((slug) => serviceBySlug.get(slug))
        .filter((id): id is NonNullable<typeof id> => Boolean(id));
      await Project.updateOne(
        { slug: item.slug },
        {
          industryIds: industryId ? [industryId] : [],
          solutionIds: solutionId ? [solutionId] : [],
          serviceIds,
        },
      );
    }

    for (const solution of solutionDocs) {
      const industrySlug = solutionIndustrySlug[solution.slug] ?? solution.slug;
      const industryId = industryBySlug.get(industrySlug);
      if (industryId) {
        await Solution.updateOne(
          { _id: solution._id },
          { relatedIndustryIds: [industryId] },
        );
      }
    }

    for (const item of industries) {
      const relatedServiceIds = (item.relatedServiceSlugs ?? [])
        .map((slug) => serviceBySlug.get(slug))
        .filter((id): id is NonNullable<typeof id> => Boolean(id));
      await Industry.updateOne(
        { slug: item.slug },
        { relatedServiceIds },
      );
    }

    const { Enquiry } = await import("@/modules/leads/enquiry.model");
    const { Application } = await import("@/modules/careers/application.model");
    const { enquiryStatuses, applicationStatuses } = await import(
      "@/modules/shared/enums"
    );
    const { budgetValues, timelineValues } = await import(
      "@/modules/leads/schema"
    );

    if ((await Enquiry.countDocuments({ deletedAt: null })) === 0) {
      const serviceIds = [...serviceBySlug.values()];
      const fictionalEnquiries = Array.from({ length: 22 }, (_, index) => {
        const status = enquiryStatuses[index % enquiryStatuses.length];
        const type = (["contact", "quote", "general"] as const)[index % 3];
        const serviceId = serviceIds[index % Math.max(serviceIds.length, 1)];
        return {
          type,
          name: `Fictional contact ${index + 1}`,
          email: `lead${index + 1}@example.com`,
          company: "Fictional organisation",
          subject: "Demonstration enquiry",
          message:
            "This is a fictional enquiry seeded for dashboard charts and pagination. It does not represent a real client.",
          status,
          gdprConsent: true,
          sourcePage: type === "quote" ? "/quote" : "/contact",
          ...(type === "quote"
            ? {
                budgetRange: budgetValues[index % budgetValues.length],
                timeline: timelineValues[index % timelineValues.length],
                serviceInterestIds: serviceId ? [serviceId] : [],
              }
            : {}),
        };
      });
      await Enquiry.insertMany(fictionalEnquiries);
    }

    const jobDoc = await Job.findOne({ deletedAt: null, status: "open" });
    if (jobDoc && (await Application.countDocuments({ deletedAt: null })) === 0) {
      const fictionalApplications = Array.from({ length: 12 }, (_, index) => ({
        jobId: jobDoc._id,
        jobTitleSnapshot: jobDoc.title,
        name: `Fictional applicant ${index + 1}`,
        email: `applicant${index + 1}@example.com`,
        coverLetter:
          "Fictional application seeded for dashboard charts. Not a real candidate.",
        status: applicationStatuses[index % applicationStatuses.length],
        source: "careers_page" as const,
        gdprConsent: true,
      }));
      await Application.insertMany(fictionalApplications);
    }

    const [serviceCount, solutionCount, industryCount, projectCount, postCount, jobCount, testimonialCount, settingsCount, enquiryCount, applicationCount] =
      await Promise.all([
        Service.countDocuments({ deletedAt: null }),
        Solution.countDocuments({ deletedAt: null }),
        Industry.countDocuments({ deletedAt: null }),
        Project.countDocuments({ deletedAt: null }),
        BlogPost.countDocuments({ deletedAt: null, status: "published" }),
        Job.countDocuments({ deletedAt: null, status: "open" }),
        Testimonial.countDocuments({ deletedAt: null, status: "published" }),
        Settings.countDocuments({ key: "global" }),
        Enquiry.countDocuments({ deletedAt: null }),
        Application.countDocuments({ deletedAt: null }),
      ]);

    console.log("TechCore demo data seeded (fictional content).");
    console.log(
      [
        `services ${serviceCount}`,
        `solutions ${solutionCount}`,
        `industries ${industryCount}`,
        `projects ${projectCount}`,
        `posts ${postCount}`,
        `jobs ${jobCount}`,
        `testimonials ${testimonialCount}`,
        `enquiries ${enquiryCount}`,
        `applications ${applicationCount}`,
        `settings ${settingsCount}`,
      ].join(" | "),
    );
  } finally {
    await disconnectMongo();
  }
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
