"use client";

import { FormField } from "@/components/forms/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import type { ActionResult } from "@/lib/admin/action";

type Values = {
  quote?: string;
  authorName?: string;
  authorRole?: string;
  company?: string;
  rating?: number;
  status?: string;
  featured?: boolean;
  sortOrder?: number;
};

export function TestimonialForm({
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
      onSuccessPath={(id) => `/admin/testimonials/${id}`}
    >
      <FormSection title="Quote">
        <FormField label="Quote" htmlFor="quote" className="md:col-span-2">
          <Textarea id="quote" name="quote" rows={5} required defaultValue={values?.quote} />
        </FormField>
        <FormField label="Name" htmlFor="authorName">
          <Input id="authorName" name="authorName" required defaultValue={values?.authorName} />
        </FormField>
        <FormField label="Role" htmlFor="authorRole">
          <Input id="authorRole" name="authorRole" defaultValue={values?.authorRole} />
        </FormField>
        <FormField label="Company" htmlFor="company">
          <Input id="company" name="company" defaultValue={values?.company} />
        </FormField>
        <FormField label="Rating" htmlFor="rating">
          <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={values?.rating} />
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
