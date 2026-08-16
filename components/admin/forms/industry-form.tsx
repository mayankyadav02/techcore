"use client";

import { FormField } from "@/components/forms/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import type { ActionResult } from "@/lib/admin/action";

type IndustryValues = {
  title?: string;
  slug?: string;
  summary?: string;
  body?: string;
  focus?: string[];
  status?: string;
  featured?: boolean;
  sortOrder?: number;
};

export function IndustryForm({
  action,
  values,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  values?: IndustryValues;
  submitLabel: string;
}) {
  return (
    <MutationForm
      action={action}
      submitLabel={submitLabel}
      onSuccessPath={(id) => `/admin/industries/${id}`}
    >
      <FormSection title="Basics">
        <FormField label="Title" htmlFor="title">
          <Input id="title" name="title" required defaultValue={values?.title} />
        </FormField>
        <FormField label="Slug" htmlFor="slug" hint="Leave blank to generate from the title.">
          <Input id="slug" name="slug" defaultValue={values?.slug} />
        </FormField>
        <FormField label="Summary" htmlFor="summary" className="md:col-span-2">
          <Textarea id="summary" name="summary" rows={3} required defaultValue={values?.summary} />
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
          <Textarea id="body" name="body" rows={8} defaultValue={values?.body} />
        </FormField>
        <FormField label="Focus areas" htmlFor="focus" hint="One per line." className="md:col-span-2">
          <Textarea
            id="focus"
            name="focus"
            rows={5}
            defaultValue={values?.focus?.join("\n")}
          />
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
