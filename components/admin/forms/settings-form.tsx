"use client";

import { FormField } from "@/components/forms/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import { updateSettingsAction } from "@/modules/content/actions";

export function SettingsForm(values: {
  companyName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  linkedin: string;
  x: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
}) {
  return (
    <MutationForm action={updateSettingsAction} submitLabel="Save settings">
      <FormSection title="Company">
        <FormField label="Company name" htmlFor="companyName">
          <Input id="companyName" name="companyName" required defaultValue={values.companyName} />
        </FormField>
        <FormField label="Tagline" htmlFor="tagline">
          <Input id="tagline" name="tagline" defaultValue={values.tagline} />
        </FormField>
        <FormField label="Email" htmlFor="contactEmail">
          <Input id="contactEmail" name="contactEmail" type="email" required defaultValue={values.contactEmail} />
        </FormField>
        <FormField label="Phone" htmlFor="contactPhone">
          <Input id="contactPhone" name="contactPhone" defaultValue={values.contactPhone} />
        </FormField>
        <FormField label="Address" htmlFor="address" className="md:col-span-2">
          <Input id="address" name="address" defaultValue={values.address} />
        </FormField>
      </FormSection>
      <FormSection title="Social and footer">
        <FormField label="LinkedIn URL" htmlFor="linkedin">
          <Input id="linkedin" name="linkedin" defaultValue={values.linkedin} />
        </FormField>
        <FormField label="X URL" htmlFor="x">
          <Input id="x" name="x" defaultValue={values.x} />
        </FormField>
        <FormField label="Footer information" htmlFor="footerText" className="md:col-span-2">
          <Textarea id="footerText" name="footerText" rows={4} defaultValue={values.footerText} />
        </FormField>
      </FormSection>
      <FormSection title="Default SEO">
        <FormField label="Default title" htmlFor="seoTitle">
          <Input id="seoTitle" name="seoTitle" defaultValue={values.seoTitle} />
        </FormField>
        <FormField label="Default description" htmlFor="seoDescription" className="md:col-span-2">
          <Textarea
            id="seoDescription"
            name="seoDescription"
            rows={3}
            defaultValue={values.seoDescription}
          />
        </FormField>
      </FormSection>
    </MutationForm>
  );
}
