import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/marketing/section";
import { SectionHeading } from "@/components/marketing/section-heading";

export function PlaceholderPage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Section tone="muted">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-10">
          <EmptyState
            title="Content will be managed from the CMS"
            description="This route is in place for navigation and layout. Page content ships with the content platform phase."
            action={
              <ButtonLink href="/contact" variant="outline">
                Contact TechCore
              </ButtonLink>
            }
          />
        </div>
      </Container>
    </Section>
  );
}
