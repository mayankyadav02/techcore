"use client";

import { FormField } from "@/components/forms/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import type { ActionResult } from "@/lib/admin/action";

type Values = {
  title?: string;
  slug?: string;
  summary?: string;
  body?: string;
  problem?: string;
  approach?: string;
  outcomes?: string[];
  features?: string[];
  technology?: string[];
  status?: string;
  featured?: boolean;
  sortOrder?: number;
};

export function SolutionForm({
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
      onSuccessPath={(id) => `/admin/solutions/${id}`}
    >
      <FormSection title="Basics">
        <FormField label="Title" htmlFor="title">
          <Input id="title" name="title" required defaultValue={values?.title} />
        </FormField>
        <FormField label="Slug" htmlFor="slug">
          <Input id="slug" name="slug" defaultValue={values?.slug} />
        </FormField>
        <FormField label="Summary" htmlFor="summary" className="md:col-span-2">
          <Textarea id="summary" name="summary" rows={3} required defaultValue={values?.summary} />
        </FormField>
      </FormSection>
      <FormSection title="Solution narrative">
        <FormField label="Problem" htmlFor="problem" className="md:col-span-2">
          <Textarea id="problem" name="problem" rows={5} required defaultValue={values?.problem} />
        </FormField>
        <FormField label="Approach" htmlFor="approach" className="md:col-span-2">
          <Textarea id="approach" name="approach" rows={5} required defaultValue={values?.approach} />
        </FormField>
        <FormField label="Body" htmlFor="body" className="md:col-span-2">
          <Textarea id="body" name="body" rows={6} defaultValue={values?.body} />
        </FormField>
        <FormField label="Outcomes" htmlFor="outcomes" hint="One per line.">
          <Textarea id="outcomes" name="outcomes" rows={5} defaultValue={values?.outcomes?.join("\n")} />
        </FormField>
        <FormField label="Features" htmlFor="features" hint="One per line.">
          <Textarea id="features" name="features" rows={5} defaultValue={values?.features?.join("\n")} />
        </FormField>
        <FormField label="Technology" htmlFor="technology" hint="One per line." className="md:col-span-2">
          <Textarea id="technology" name="technology" rows={4} defaultValue={values?.technology?.join("\n")} />
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
        <FormField label="Sort order" htmlFor="sortOrder">
          <Input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={values?.sortOrder ?? 0} />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input type="checkbox" name="featured" defaultChecked={values?.featured} />
          Featured
        </label>
      </FormSection>
    </MutationForm>
  );
}
