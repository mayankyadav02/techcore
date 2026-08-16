import { Container } from "@/components/ui/container";
import { Section } from "@/components/marketing/section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ButtonLink } from "@/components/ui/button-link";

export function CtaBand({
  title = "Have a project in mind?",
  description = "Share a short brief. We work discovery-first, treat security as default, and will say honestly whether TechCore is the right team — then what a first release could look like.",
  primaryHref = "/quote",
  primaryLabel = "Request a Quote",
  secondaryHref = "/contact",
  secondaryLabel = "Talk to TechCore",
}: {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <Section
      tone="dark"
      className="
        relative overflow-hidden
        border-y border-white/5
      "
    >
      {/* Background atmosphere */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_15%_50%,rgb(0_200_120_/_0.14),transparent_34%),radial-gradient(circle_at_85%_20%,rgb(0_217_192_/_0.08),transparent_30%)]
        "
        aria-hidden="true"
      />

      {/* Subtle grid */}
      <div
        className="
          pointer-events-none absolute inset-0 opacity-[0.18]
          [background-image:linear-gradient(to_right,rgb(255_255_255_/_0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255_/_0.06)_1px,transparent_1px)]
          [background-size:48px_48px]
        "
        aria-hidden="true"
      />

      <Container className="relative">
        <div
          className="
            relative overflow-hidden
            rounded-[var(--radius-xl)]
            border border-white/10
            bg-white/[0.035]
            px-6 py-8
            shadow-[0_20px_70px_rgb(0_0_0_/_0.18)]
            backdrop-blur-md
            sm:px-8 sm:py-10
            lg:px-10 lg:py-12
          "
        >
          {/* Emerald accent */}
          <div
            className="
              absolute left-0 top-0 h-full w-1
              bg-gradient-to-b from-brand via-teal to-brand
            "
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            {/* Content */}
            <div className="min-w-0 max-w-3xl">
              <SectionHeading
                inverted
                title={title}
                description={description}
              />
            </div>

            {/* Actions */}
            <div
              className="
                flex w-full shrink-0 flex-col gap-3
                sm:flex-row
                lg:w-auto
              "
            >
              <ButtonLink
                href={primaryHref}
                variant="secondary"
                size="lg"
                className="
                  w-full sm:w-auto
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_10px_30px_rgb(0_200_120_/_0.18)]
                "
              >
                {primaryLabel}
              </ButtonLink>

              <ButtonLink
                href={secondaryHref}
                variant="on-dark"
                size="lg"
                className="
                  w-full sm:w-auto
                  transition-all duration-300
                  hover:-translate-y-0.5
                "
              >
                {secondaryLabel}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}