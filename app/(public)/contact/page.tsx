import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/forms/contact-form";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { homeFaqs } from "@/lib/content/home";
import { pageMetadata } from "@/lib/seo";
import { getPublicCompany } from "@/modules/content/public.service";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact TechCore about a programme, a role, or a question.",
  path: "/contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject } = await searchParams;
  const company = await getPublicCompany();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Write to the practice."
        description="Share enough context for a useful reply. A valid submission is stored as an enquiry for the TechCore team."
        actions={
          <ButtonLink href="#enquiry" variant="primary">
            Send Enquiry
          </ButtonLink>
        }
      />

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-10">
            {/* Contact details */}
            <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-[var(--shadow-sm)] sm:p-8">
              <div>
                <p className="text-xs font-medium tracking-[0.18em] text-brand-dark uppercase">
                  Get in touch
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                  Let&apos;s start with the right conversation.
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-ink-muted">
                  Whether you have a project brief, a question, or simply want
                  to understand how we work, send us a message and we&apos;ll
                  take it from there.
                </p>
              </div>

              <dl className="mt-8 divide-y divide-line border-y border-line">
                <div className="py-5">
                  <dt className="text-xs font-medium tracking-[0.14em] text-ink-subtle uppercase">
                    Email
                  </dt>
                  <dd className="mt-2 break-words text-sm font-medium text-ink">
                    <a
                      href={`mailto:${company.email}`}
                      className="transition-colors hover:text-brand-dark"
                    >
                      {company.email}
                    </a>
                  </dd>
                </div>

                <div className="py-5">
                  <dt className="text-xs font-medium tracking-[0.14em] text-ink-subtle uppercase">
                    Phone
                  </dt>
                  <dd className="mt-2 text-sm font-medium text-ink">
                    {company.phone}
                  </dd>
                </div>

                <div className="py-5">
                  <dt className="text-xs font-medium tracking-[0.14em] text-ink-subtle uppercase">
                    Studio
                  </dt>
                  <dd className="mt-2 max-w-sm text-sm leading-6 text-ink">
                    {company.address}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 overflow-hidden rounded-[var(--radius-md)] border border-line bg-elevated p-5">
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand shadow-[0_0_0_4px_rgb(0_200_120/0.10)]"
                    aria-hidden="true"
                  />

                  <div>
                    <p className="text-sm font-medium text-ink">
                      Studio location
                    </p>
                    <p className="mt-1 text-xs leading-5 text-ink-muted">
                      San Francisco studio location. A live map is not embedded
                      until operations require it.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enquiry form */}
            <div
              id="enquiry"
              className="scroll-mt-[calc(var(--header-height)+2rem)] rounded-[var(--radius-lg)] border border-line bg-elevated p-5 shadow-[var(--shadow-md)] sm:p-8"
            >
              <div className="border-b border-line pb-6">
                <p className="text-xs font-medium tracking-[0.18em] text-brand-dark uppercase">
                  Enquiry
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                  Tell us what you&apos;re working on.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-ink-muted">
                  A little context helps us understand the problem before we
                  suggest the next step.
                </p>
              </div>

              <div className="mt-7">
                <ContactForm defaultSubject={subject ?? ""} />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section tone="muted">
        <Container className="max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-medium tracking-[0.18em] text-brand-dark uppercase">
              FAQ
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              A few things worth knowing.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink-muted">
              Some common questions before starting a conversation with
              TechCore.
            </p>
          </div>

          <div className="mt-8">
            <Accordion items={homeFaqs.slice(0, 3)} />
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Prefer a scoped brief?"
        description="Use Request a Quote when you already know the outcome you need. Discovery-first, security as default."
        primaryHref="/quote"
        primaryLabel="Request a Quote"
        secondaryHref="/services"
        secondaryLabel="Explore Services"
      />
    </>
  );
}