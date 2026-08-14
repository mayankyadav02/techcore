import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/marketing/section";
import { SectionHeading } from "@/components/marketing/section-heading";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "IT Services and Solutions",
  description: site.description,
};

const pillars = [
  {
    title: "IT Services",
    body: "Delivery models that keep core systems reliable, secure, and ready to scale.",
  },
  {
    title: "Technology solutions",
    body: "Practical architectures for cloud, data, and modern application platforms.",
  },
  {
    title: "Industry expertise",
    body: "Context-aware work for organisations that cannot afford generic playbooks.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-navy-900 text-white">
        <Container className="flex min-h-[32rem] flex-col justify-center py-20 lg:min-h-[36rem] lg:py-28">
          <p className="text-xs font-medium tracking-[0.18em] text-white/55 uppercase">
            IT services & solutions
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
            {site.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
            {site.description} This foundation establishes the public shell,
            typography, and layout system used across the site.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/request-quote" variant="secondary">
              Start a Project
            </ButtonLink>
            <ButtonLink href="/services" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">
              View services
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="What we do"
            title="A restrained system for a serious firm."
            description="The public site will present services, solutions, industries, projects, careers, and insight — managed from the admin CMS in later phases."
          />
          <StaggerList className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((item) => (
              <StaggerItem key={item.title} className="h-full">
                <Card className="h-full">
                  <h3 className="text-lg font-semibold text-navy-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink-muted">
                    {item.body}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerList>
        </Container>
      </Section>
    </>
  );
}
