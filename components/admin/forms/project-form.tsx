"use client";

import { FormField } from "@/components/forms/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import type { ActionResult } from "@/lib/admin/action";

type Values = {
  title?: string;
  slug?: string;
  clientName?: string;
  sector?: string;
  summary?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  features?: string[];
  technology?: string[];
  heroImageUrl?: string;
  galleryUrls?: string[];
  year?: number;
  status?: string;
  featured?: boolean;
  sortOrder?: number;
};

export function ProjectForm({
  action,
  values,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  values?: Values;
  submitLabel: string;
}) {
  return (
    <MutationForm
      action={action}
      submitLabel={submitLabel}
      onSuccessPath={(id) => `/admin/projects/${id}`}
    >
      <FormSection title="Basics">
        <FormField label="Title" htmlFor="title">
          <Input id="title" name="title" required defaultValue={values?.title} />
        </FormField>
        <FormField label="Slug" htmlFor="slug">
          <Input id="slug" name="slug" defaultValue={values?.slug} />
        </FormField>
        <FormField label="Client name" htmlFor="clientName">
          <Input id="clientName" name="clientName" defaultValue={values?.clientName ?? "Confidential"} />
        </FormField>
        <FormField label="Sector" htmlFor="sector">
          <Input id="sector" name="sector" defaultValue={values?.sector} />
        </FormField>
        <FormField label="Year" htmlFor="year">
          <Input id="year" name="year" type="number" min={2000} max={2100} defaultValue={values?.year} />
        </FormField>
        <FormField label="Sort order" htmlFor="sortOrder">
          <Input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={values?.sortOrder ?? 0} />
        </FormField>
        <FormField label="Summary" htmlFor="summary" className="md:col-span-2">
          <Textarea id="summary" name="summary" rows={3} required defaultValue={values?.summary} />
        </FormField>
      </FormSection>
      <FormSection title="Case study">
        <FormField label="Overview" htmlFor="overview" className="md:col-span-2">
          <Textarea id="overview" name="overview" rows={5} defaultValue={values?.overview} />
        </FormField>
        <FormField label="Challenge" htmlFor="challenge" className="md:col-span-2">
          <Textarea id="challenge" name="challenge" rows={6} required defaultValue={values?.challenge} />
        </FormField>
        <FormField label="Solution" htmlFor="solution" className="md:col-span-2">
          <Textarea id="solution" name="solution" rows={6} required defaultValue={values?.solution} />
        </FormField>
        <FormField label="Results" htmlFor="results" hint="One per line.">
          <Textarea id="results" name="results" rows={5} defaultValue={values?.results?.join("\n")} />
        </FormField>
        <FormField label="Features" htmlFor="features" hint="One per line.">
          <Textarea id="features" name="features" rows={5} defaultValue={values?.features?.join("\n")} />
        </FormField>
        <FormField label="Technologies" htmlFor="technology" hint="One per line." className="md:col-span-2">
          <Textarea id="technology" name="technology" rows={4} defaultValue={values?.technology?.join("\n")} />
        </FormField>
      </FormSection>
      <FormSection title="Images" description="Use https URLs until media storage is enabled.">
        <FormField label="Hero image URL" htmlFor="heroImageUrl" className="md:col-span-2">
          <Input id="heroImageUrl" name="heroImageUrl" defaultValue={values?.heroImageUrl} />
        </FormField>
        <FormField label="Gallery URLs" htmlFor="galleryUrls" hint="One URL per line." className="md:col-span-2">
          <Textarea id="galleryUrls" name="galleryUrls" rows={4} defaultValue={values?.galleryUrls?.join("\n")} />
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
