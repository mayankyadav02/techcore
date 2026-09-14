import { FormField } from "@/components/forms/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import { updatePageContentAction } from "@/modules/content/actions";

export function PageContentForm({ values }: { values: any }) {
  const {
    key,
    heroEyebrow = "",
    heroTitle = "",
    heroDescription = "",
    heroPrimaryLabel = "",
    heroPrimaryUrl = "",
    heroSecondaryLabel = "",
    heroSecondaryUrl = "",
    primaryCta = {},
    secondaryCta = {},
  } = values || {};

  return (
    <MutationForm action={updatePageContentAction} submitLabel="Save Content">
      <FormSection title={`Page Content: /${key}`}>
        <input type="hidden" name="key" value={key} />
        <FormField label="Eyebrow" htmlFor={`heroEyebrow-${key}`}>
          <Input id={`heroEyebrow-${key}`} name="heroEyebrow" defaultValue={heroEyebrow} />
        </FormField>
        <FormField label="Title" htmlFor={`heroTitle-${key}`}>
          <Input id={`heroTitle-${key}`} name="heroTitle" defaultValue={heroTitle} />
        </FormField>
        <FormField label="Description" htmlFor={`heroDescription-${key}`}>
          <Textarea id={`heroDescription-${key}`} name="heroDescription" rows={3} defaultValue={heroDescription} />
        </FormField>
        <FormField label="Primary Button Label" htmlFor={`heroPrimaryLabel-${key}`}>
          <Input id={`heroPrimaryLabel-${key}`} name="heroPrimaryLabel" defaultValue={heroPrimaryLabel} />
        </FormField>
        <FormField label="Primary Button URL" htmlFor={`heroPrimaryUrl-${key}`}>
          <Input id={`heroPrimaryUrl-${key}`} name="heroPrimaryUrl" defaultValue={heroPrimaryUrl} />
        </FormField>
        <FormField label="Secondary Button Label" htmlFor={`heroSecondaryLabel-${key}`}>
          <Input id={`heroSecondaryLabel-${key}`} name="heroSecondaryLabel" defaultValue={heroSecondaryLabel} />
        </FormField>
        <FormField label="Secondary Button URL" htmlFor={`heroSecondaryUrl-${key}`}>
          <Input id={`heroSecondaryUrl-${key}`} name="heroSecondaryUrl" defaultValue={heroSecondaryUrl} />
        </FormField>
        {/* CTA fields */}
        <FormField label="Primary CTA Label" htmlFor={`primaryCtaLabel-${key}`}>
          <Input id={`primaryCtaLabel-${key}`} name="primaryCtaLabel" defaultValue={primaryCta.label || ""} />
        </FormField>
        <FormField label="Primary CTA Href" htmlFor={`primaryCtaHref-${key}`}>
          <Input id={`primaryCtaHref-${key}`} name="primaryCtaHref" defaultValue={primaryCta.href || ""} />
        </FormField>
        <FormField label="Secondary CTA Label" htmlFor={`secondaryCtaLabel-${key}`}>
          <Input id={`secondaryCtaLabel-${key}`} name="secondaryCtaLabel" defaultValue={secondaryCta.label || ""} />
        </FormField>
        <FormField label="Secondary CTA Href" htmlFor={`secondaryCtaHref-${key}`}>
          <Input id={`secondaryCtaHref-${key}`} name="secondaryCtaHref" defaultValue={secondaryCta.href || ""} />
        </FormField>
      </FormSection>
    </MutationForm>
  );
}
