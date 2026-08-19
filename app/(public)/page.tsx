import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Accordion } from "@/components/ui/accordion";
import { Section } from "@/components/marketing/section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { HeroVisual } from "@/components/marketing/hero-visual";
// import { HomeHeroBackdrop } from "@/components/marketing/home-hero-backdrop";
import { CtaBand } from "@/components/marketing/cta-band";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { PackageCards } from "@/components/marketing/package-cards";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { IndustryGrid } from "@/components/marketing/industry-grid";
import { SolutionCard } from "@/components/marketing/solution-card";
import { TechStack } from "@/components/marketing/tech-stack";
import { TestimonialGrid } from "@/components/marketing/testimonial-grid";
import { ServiceCard } from "@/components/catalog/service-card";
import { ProjectTile } from "@/components/work/project-tile";
import { FadeIn } from "@/components/motion/fade-in";
import { Card } from "@/components/ui/card";
import { jsonLd } from "@/lib/json-ld";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { homeFaqs, reasons } from "@/lib/content/home";
import { EmptyState } from "@/components/ui/empty-state";
import {
  featuredThenFill,
  loadHomeTestimonials,
  loadPublicIndustries,
  loadPublicJobs,
  loadPublicPosts,
  loadPublicProjects,
  loadPublicServices,
  loadPublicSolutions,
} from "@/lib/public-content";
import { formatCountStat, StatsStrip } from "@/components/marketing/stats-strip";
import { getPublicCompany } from "@/modules/content/public.service";
import { CoverMedia } from "@/components/marketing/cover-media";
import { catalogImage } from "@/lib/public-images";
import Link from "next/link";
import Image from "next/image";

export const metadata = pageMetadata({
  title: "IT Services and Solutions",
  description: site.description,
  path: "/",
});

export default async function HomePage() {
  const [company, services, industries, projects, testimonials, solutions, posts, jobs] =
    await Promise.all([
      getPublicCompany(),
      loadPublicServices(),
      loadPublicIndustries(),
      loadPublicProjects(),
      loadHomeTestimonials(),
      loadPublicSolutions(),
      loadPublicPosts(),
      loadPublicJobs(),
    ]);

  const shownServices = featuredThenFill(services, 8);
  const shownIndustries = featuredThenFill(industries, 12);
  const shownProjects = featuredThenFill(projects, 4);
  const shownTestimonials = testimonials;
  const shownSolutions = featuredThenFill(solutions, 6);
  const shownPosts = featuredThenFill(posts, 3);
  // const homeHeroImages = ["hero-01", "hero-02", "hero-03"]
  //   .map((slug) => catalogImage("home", slug))
  //   .filter((src): src is string => Boolean(src));
  const aboutImage = catalogImage("home", "digital-transformation");
  const servicesImage = catalogImage("home", "software-development");
  const technologyImage = catalogImage("home", "technology");
  const catalogueStats = [
    { label: "Services", value: services.length },
    { label: "Solutions", value: solutions.length },
    { label: "Projects", value: projects.length },
    { label: "Industries", value: industries.length },
    { label: "Articles", value: posts.length },
    { label: "Open roles", value: jobs.length },
  ];
  const publicStats = [
    formatCountStat(services.length, "Service", "Services"),
    formatCountStat(solutions.length, "Solution", "Solutions"),
    formatCountStat(projects.length, "Project", "Projects"),
    formatCountStat(industries.length, "Industry", "Industries"),
    formatCountStat(posts.length, "Article", "Articles"),
    formatCountStat(jobs.length, "Open role", "Open roles"),
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: company.name,
            description: company.description,
            url: siteUrl,
            email: company.email,
            telephone: company.phone,
            address: company.address,
          }),
        }}
      />

<section
  className="
    relative isolate overflow-hidden
    bg-surface text-ink
    dark:bg-navy-950 dark:text-white
  "
  style={{
    backgroundImage: "url('/images/hero.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* =========================================================
      LIGHT MODE
      Soft green/white atmosphere while keeping hero image visible
      ========================================================= */}

  {/* Light base wash */}
  <div
    className="
      absolute inset-0
      bg-white/65
      dark:hidden
    "
    aria-hidden="true"
  />

  {/* Light green readability gradient */}
  <div
    className="
      pointer-events-none absolute inset-0
      bg-gradient-to-br
      from-white/75
      via-emerald-50/55
      to-emerald-100/35
      dark:hidden
    "
    aria-hidden="true"
  />

  {/* Light subtle left readability */}
  <div
    className="
      pointer-events-none absolute inset-0
      bg-gradient-to-r
      from-white/55
      via-white/15
      to-transparent
      dark:hidden
    "
    aria-hidden="true"
  />

  {/* =========================================================
      DARK MODE
      Transparent dark overlay so background image remains visible
      ========================================================= */}

  {/* Dark base overlay */}
  <div
    className="
      absolute inset-0 hidden
      bg-navy-950/18
      dark:block
    "
    aria-hidden="true"
  />

  {/* Dark readability gradient */}
  <div
    className="
      pointer-events-none absolute inset-0 hidden
      bg-gradient-to-r
      from-navy-950/55
      via-navy-950/25
      to-transparent
      dark:block
    "
    aria-hidden="true"
  />

  {/* =========================================================
      ATMOSPHERIC GLOW
      ========================================================= */}

  {/* Light green glow */}
  <div
    className="
      pointer-events-none absolute
      -right-32 top-1/2
      h-96 w-96
      -translate-y-1/2
      rounded-full
      bg-brand/10
      blur-3xl
      dark:hidden
    "
    aria-hidden="true"
  />

  {/* Dark emerald glow */}
  <div
    className="
      pointer-events-none absolute
      -right-32 top-1/2
      hidden h-96 w-96
      -translate-y-1/2
      rounded-full
      bg-brand/10
      blur-3xl
      dark:block
    "
    aria-hidden="true"
  />

  {/* =========================================================
      CONTENT
      ========================================================= */}

  <Container
    className="
      relative grid items-center gap-8
      pt-[calc(var(--header-height)+2.25rem)]
      pb-12
      sm:gap-12 sm:pb-16
      lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]
      lg:pb-24
    "
  >
    <div className="min-w-0">
      {/* Eyebrow */}
      <p
        className="
          text-xs font-medium
          tracking-[0.18em]
          text-brand-dark
          uppercase
          dark:text-brand-bright
        "
      >
        IT services &amp; software
      </p>

      {/* Main heading */}
      <h1
        className="
          font-heading text-hero
          mt-4 max-w-3xl
          font-semibold
          tracking-tight
          break-words
          text-navy-950
          dark:text-white
        "
      >
        Digital Solutions Built for Businesses That Want to Grow.
      </h1>

      {/* Description */}
      <p
        className="
          mt-5 max-w-xl
          text-base leading-7
          text-ink-muted
          sm:mt-6 sm:text-lg
          dark:text-white/70
        "
      >
        TechCore designs and develops modern websites, applications and
        software solutions that help businesses build stronger digital
        experiences.
      </p>

      {/* CTA Buttons */}
      <div
        className="
          mt-8 flex flex-col gap-3
          sm:mt-10 sm:flex-row sm:flex-wrap
        "
      >
        <ButtonLink
          href="/quote"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
        >
          Request a Quote
        </ButtonLink>

        <ButtonLink
          href="/services"
          variant="inverse"
          size="lg"
          className="
            w-full sm:w-auto
            border-navy-950/20
            bg-white/35
            text-navy-950
            hover:bg-white/55
            dark:border-white/20
            dark:bg-transparent
            dark:text-white
            dark:hover:bg-white/8
          "
        >
          Explore Services
        </ButtonLink>

        <ButtonLink
          href="/projects"
          variant="inverse"
          size="lg"
          className="
            w-full sm:w-auto
            border-navy-950/20
            bg-white/35
            text-navy-950
            hover:bg-white/55
            dark:border-white/20
            dark:bg-transparent
            dark:text-white
            dark:hover:bg-white/8
          "
        >
          View Projects
        </ButtonLink>
      </div>
    </div>

    <HeroVisual stats={catalogueStats} />
  </Container>
</section>

      <TrustStrip />
      <StatsStrip items={publicStats} />

<Section>
  <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 xl:gap-20">
    {/* Left — About Content */}
    <div className="order-1">
      <SectionHeading
        eyebrow="About"
        title="Technology should solve business problems, not create new ones."
        description="TechCore is a technology practice for organisations that need websites, applications, and operational software they can actually run. We listen first, then design systems around how the work happens."
      />

      {/* Mobile image — stays inside About content */}
      <div className="mt-8 lg:hidden">
        {aboutImage ? (
          <CoverMedia
            src={aboutImage}
            alt="Digital transformation"
            className="w-full max-w-none"
          />
        ) : null}
      </div>

      <div className="mt-7">
        <p className="max-w-2xl text-sm leading-7 text-ink-muted sm:text-base">
          Who we are: a delivery team spanning product engineering, design,
          cloud, and assurance. Why it matters: growth stalls when digital
          work is treated as decoration. We stay until the first release is
          usable — and document how the next one should land.
        </p>

        <Link
          href="/about"
          className="mt-6 inline-flex min-h-11 items-center text-sm font-medium text-brand-dark transition-colors hover:text-brand hover:underline"
        >
          Know More About TechCore
        </Link>
      </div>
    </div>

    {/* Right — Desktop About Image */}
    <div className="order-2 hidden lg:block">
      {aboutImage ? (
        <CoverMedia
          src={aboutImage}
          alt="Digital transformation"
          className="w-full max-w-none"
        />
      ) : null}
    </div>
  </Container>
</Section>      

<Section tone="muted">
  <Container>
    {/* Services intro + image */}
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-12">
      
      {/* LEFT — Heading + description */}
      <div className="min-w-0">
        <SectionHeading
          eyebrow="Services"
          title="What we build for growing businesses."
          description="Eight practices under one engineering standard. Each can stand alone or form a programme."
        />
      </div>

      {/* RIGHT — Service image */}
      {servicesImage ? (
        <div className="w-full lg:pt-0">
          <CoverMedia
            src={servicesImage}
            alt="Software development"
            className="w-full"
          />
        </div>
      ) : null}
    </div>

    {/* Services cards */}
    {shownServices.length === 0 ? (
      <div className="mt-12">
        <EmptyState
          title="No published services"
          description="Published services will appear here once they are released from the CMS."
        />
      </div>
    ) : (
      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {shownServices.map((service, index) => (
          <ServiceCard
            key={service.slug}
            service={service}
            index={index}
            featured={false}
          />
        ))}
      </div>
    )}
  </Container>
</Section>      

<Section>
  <Container>
    <div className="relative">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Solutions"
          title="Software shaped by how the work actually runs."
          description="Sector patterns we see repeatedly. Each page describes the problem, the approach, and the kind of system that follows."
        />

        <Link
          href="/solutions"
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-brand/20 bg-brand/5 px-5 text-sm font-medium text-brand-dark transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand/10 hover:shadow-[0_8px_24px_rgb(0_200_120_/_0.10)]"
        >
          View Solutions
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>

      <div className="mt-8 h-px bg-gradient-to-r from-brand/20 via-ink/10 to-transparent" />
    </div>

    {shownSolutions.length === 0 ? (
      <p className="mt-10 text-sm text-ink-muted">
        No published solutions yet.
      </p>
    ) : (
      <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shownSolutions.map((item) => (
          <li key={item.slug} className="min-w-0">
            <SolutionCard item={item} />
          </li>
        ))}
      </ul>
    )}
  </Container>
</Section>      

      <Section>
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="Packages"
              title="Start with the shape of the work, not a catalogue price."
              description="These packages describe typical engagement shapes. They are not live offers with published fees — a Custom Quote follows a real brief."
            />
            <PackageCards />
          </FadeIn>
        </Container>
      </Section>

<Section tone="muted">
  <Container>
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <SectionHeading
        eyebrow="Projects"
        title="Featured programmes."
        description="ShopFlow, CarePlus, FleetPro, LearnHub, EstatePro, FinServe, GymCore, and FoodHub are fictional cases used to show how TechCore would structure delivery. They are not live client brands."
      />

      <Link
        href="/projects"
        className="group inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-xl border border-ink/10 bg-surface px-5 text-sm font-medium text-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:bg-brand/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      >
        View Projects
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </div>

    {shownProjects.length === 0 ? (
      <div className="mt-12">
        <EmptyState
          title="No published projects"
          description="Published case studies will appear here once they are released from the CMS."
        />
      </div>
    ) : (
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-7">
        {shownProjects.map((project) => (
          <div
            key={project.slug}
            className="transition-transform duration-300 hover:-translate-y-1"
          >
            <ProjectTile project={project} />
          </div>
        ))}
      </div>
    )}
  </Container>
      </Section>
      

<Section>
  <Container>
    <SectionHeading
      eyebrow="Why TechCore"
      title="What you should expect from us."
    />

    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {reasons.map((item, index) => (
        <div
          key={item.title}
          className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-elevated p-6 shadow-[var(--shadow-sm)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-[var(--shadow-md)]"
        >
          {/* subtle hover accent */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand transition-transform duration-300 group-hover:scale-x-100"
          />

          <p className="font-heading text-2xl font-semibold tracking-tight text-brand-dark transition-transform duration-300 group-hover:translate-x-0.5">
            {String(index + 1).padStart(2, "0")}
          </p>

          <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
            {item.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-ink-muted">
            {item.body}
          </p>
        </div>
      ))}
    </div>
  </Container>
      </Section>
      

      <Section tone="muted">
        <Container>
          <FadeIn>
            <SectionHeading
              eyebrow="Process"
              title="How a programme typically runs."
              description="From the first conversation through support after launch."
            />
            <ProcessSteps />
          </FadeIn>
        </Container>
      </Section>

<Section>
  <Container>
    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <SectionHeading
        eyebrow="Industries"
        title="Context before tooling."
        description="We do not claim to operate these businesses. We claim to listen to how they run before we write software."
      />

      <Link
        href="/industries"
        className="group inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-xl border border-ink/10 bg-elevated px-5 text-sm font-medium text-ink shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:bg-brand/5 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      >
        View all industries
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </div>

    {shownIndustries.length === 0 ? (
      <div className="mt-12">
        <EmptyState
          title="No published industries"
          description="Published industry pages will appear here once they are released from the CMS."
        />
      </div>
    ) : (
      <IndustryGrid
        industries={shownIndustries}
        className="mt-12"
      />
    )}
  </Container>
      </Section>
      

<Section tone="muted">
  <Container>
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14">
      
      {/* Left: heading + description + image */}
      <div className="min-w-0">
        <SectionHeading
          eyebrow="Technology"
          title="A stack we can stand behind."
          description="Tools chosen for delivery quality and long-term ownership — not a logo wall."
        />

        {technologyImage ? (
          <CoverMedia
            src={technologyImage}
            alt="Technology"
            className="mt-8 w-full max-w-xl"
          />
        ) : null}
      </div>

      {/* Right: technology cards */}
      <div className="min-w-0">
        <TechStack />
      </div>

    </div>
  </Container>
      </Section>
      

<Section>
  <Container>
    <FadeIn>
      <SectionHeading
        eyebrow="Testimonials"
        title="What a serious buyer would say."
        description="These quotations are fictional and labelled as such. They illustrate tone, not named client results."
      />

      {shownTestimonials.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            title="No published testimonials"
            description="Published testimonials will appear here once they are released from the CMS."
          />
        </div>
      ) : (
        <TestimonialGrid items={shownTestimonials} />
      )}
    </FadeIn>
  </Container>
      </Section>
      

<Section tone="muted">
  <Container>
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <SectionHeading
        eyebrow="Insights"
        title="Writing for people who have to ship."
        description="Short pieces on delivery and architecture from the practice."
      />

      <Link
        href="/blog"
        className="
          group inline-flex min-h-11 shrink-0 items-center gap-2
          text-sm font-medium text-brand-dark
        "
      >
        <span>View Blog</span>
        <span
          className="
            transition-transform duration-300
            group-hover:translate-x-1
          "
          aria-hidden="true"
        >
          →
        </span>
      </Link>
    </div>

    {shownPosts.length === 0 ? (
      <p className="mt-10 text-sm text-ink-muted">
        No published articles yet.
      </p>
    ) : (
      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {shownPosts.map((post) => (
          <li key={post.slug}>
            <Card
              interactive
              className="
                group relative flex h-full min-w-0 flex-col
                overflow-hidden p-0
                transition-all duration-300
                hover:-translate-y-1
              "
            >
              {/* Premium top accent */}
              <div
                className="
                  h-1 w-full origin-left scale-x-0
                  bg-gradient-to-r from-brand to-teal
                  transition-transform duration-500
                  group-hover:scale-x-100
                "
                aria-hidden="true"
              />

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                {/* Category + date */}
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="
                      rounded-full border border-brand/20
                      bg-brand/8 px-3 py-1
                      text-[0.65rem] font-medium
                      tracking-[0.12em] text-brand-dark uppercase
                    "
                  >
                    {post.category}
                  </span>

                  <span className="text-xs text-ink-subtle">
                    {post.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-6 text-xl font-semibold leading-snug text-ink">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="
                      transition-colors duration-300
                      hover:text-brand-dark
                    "
                  >
                    {post.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="mt-4 flex-1 text-sm leading-7 text-ink-muted">
                  {post.excerpt}
                </p>

                {/* Read action */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="
                    mt-7 inline-flex min-h-11 items-center gap-2
                    text-sm font-medium text-brand-dark
                  "
                >
                  <span>Read Article</span>

                  <span
                    className="
                      transition-transform duration-300
                      group-hover:translate-x-1
                    "
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </div>

              {/* Subtle hover glow */}
              <div
                className="
                  pointer-events-none absolute -right-16 -bottom-16
                  h-32 w-32 rounded-full
                  bg-brand/10 blur-3xl
                  opacity-0 transition-opacity duration-500
                  group-hover:opacity-100
                "
                aria-hidden="true"
              />
            </Card>
          </li>
        ))}
      </ul>
    )}
  </Container>
      </Section>
      

<Section>
  <Container className="max-w-4xl">
    <FadeIn>
      <div className="text-center">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions we expect."
          align="center"
        />
      </div>

      <div
        className="
          relative mt-10 overflow-hidden
          rounded-[var(--radius-xl)]
          border border-line
          bg-elevated/80
          p-3
          shadow-[var(--shadow-sm)]
          sm:mt-12 sm:p-4
        "
      >
        {/* Subtle emerald background glow */}
        <div
          className="
            pointer-events-none absolute -right-24 -top-24
            h-56 w-56 rounded-full
            bg-brand/8 blur-3xl
          "
          aria-hidden="true"
        />

        <div className="relative">
          <Accordion items={homeFaqs} />
        </div>
      </div>
    </FadeIn>
  </Container>
      </Section>
      
      <CtaBand />
    </>
  );
}
