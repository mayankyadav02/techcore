"use client";

import { FormField } from "@/components/forms/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import { MediaSelector } from "@/components/admin/media/media-selector";
import { useState } from "react";
import type { ActionResult } from "@/lib/admin/action";

type ServiceValues = {
  title?: string;
  slug?: string;
  summary?: string;
  body?: string;
  heroImageId?: string;
  icon?: string;
  highlights?: string[];
  features?: string[];
  technologies?: string[];
  benefits?: string[];
  process?: string[];
  status?: string;
  featured?: boolean;
  sortOrder?: number;
  seo?: { title?: string; description?: string };
};

export function ServiceForm({
  action,
  values,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  values?: ServiceValues;
  submitLabel: string;
}) {
  const [heroImageId, setHeroImageId] = useState(values?.heroImageId || "");

  return (
    <MutationForm
      action={action}
      submitLabel={submitLabel}
      onClosePath="/admin/services"
      onContinuePath={(id) => `/admin/services/${id}`}
    >
      <FormSection title="Media" description="Imagery for the service listing and detail page.">
        <input type="hidden" name="heroImageId" value={heroImageId} />
        <FormField label="Hero Image" htmlFor="heroImageId">
          <MediaSelector value={heroImageId} onChange={setHeroImageId} label="Select Hero Image" />
        </FormField>
      </FormSection>

      <FormSection title="Basics" description="Title, URL, and listing copy.">
        <FormField label="Title" htmlFor="title">
          <Input id="title" name="title" required defaultValue={values?.title} />
        </FormField>
        <FormField label="Slug" htmlFor="slug" hint="Leave blank to generate from the title.">
          <Input id="slug" name="slug" defaultValue={values?.slug} />
        </FormField>
        <FormField label="Summary" htmlFor="summary" className="md:col-span-2">
          <Textarea id="summary" name="summary" rows={3} required defaultValue={values?.summary} />
        </FormField>
        <FormField label="Icon" htmlFor="icon">
          <Input id="icon" name="icon" defaultValue={values?.icon} />
        </FormField>
        <FormField label="Sort order" htmlFor="sortOrder">
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={values?.sortOrder ?? 0}
          />
        </FormField>
      </FormSection>
      <FormSection title="Content">
        <FormField label="Body" htmlFor="body" className="md:col-span-2">
          <Textarea id="body" name="body" rows={10} required defaultValue={values?.body} />
        </FormField>
        <FormField label="Highlights" htmlFor="highlights" hint="One per line.">
          <Textarea
            id="highlights"
            name="highlights"
            rows={5}
            defaultValue={values?.highlights?.join("\n")}
          />
        </FormField>
        <FormField label="Features" htmlFor="features" hint="One per line.">
          <Textarea
            id="features"
            name="features"
            rows={5}
            defaultValue={values?.features?.join("\n")}
          />
        </FormField>
        <FormField label="Technologies" htmlFor="technologies" hint="One per line.">
          <Textarea
            id="technologies"
            name="technologies"
            rows={5}
            defaultValue={values?.technologies?.join("\n")}
          />
        </FormField>
        <FormField label="Benefits" htmlFor="benefits" hint="One per line.">
          <Textarea
            id="benefits"
            name="benefits"
            rows={5}
            defaultValue={values?.benefits?.join("\n")}
          />
        </FormField>
        <FormField label="Process" htmlFor="process" hint="One per line." className="md:col-span-2">
          <Textarea
            id="process"
            name="process"
            rows={5}
            defaultValue={values?.process?.join("\n")}
          />
        </FormField>
      </FormSection>
      <FormSection title="SEO">
        <FormField label="SEO Title" htmlFor="seoTitle" hint="Leave blank to use default title.">
          <Input id="seoTitle" name="seoTitle" defaultValue={values?.seo?.title} />
        </FormField>
        <FormField label="SEO Description" htmlFor="seoDescription" hint="Leave blank to use summary." className="md:col-span-2">
          <Textarea id="seoDescription" name="seoDescription" rows={3} defaultValue={values?.seo?.description} />
        </FormField>
      </FormSection>
      <FormSection title="Publishing">
        <FormField label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={values?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </FormField>
        <label className="flex items-center gap-2 text-sm text-ink-muted sm:mt-8">
          <input type="checkbox" name="featured" defaultChecked={values?.featured} />
          Featured
        </label>
      </FormSection>
    </MutationForm>
  );
}
