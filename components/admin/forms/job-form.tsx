"use client";

import { FormField } from "@/components/forms/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import type { ActionResult } from "@/lib/admin/action";

type Values = {
  title?: string;
  slug?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  experience?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  responsibilities?: string[];
  skills?: string[];
  status?: string;
};

export function JobForm({
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
      onSuccessPath={(id) => `/admin/careers/${id}`}
    >
      <FormSection title="Role">
        <FormField label="Title" htmlFor="title">
          <Input id="title" name="title" required defaultValue={values?.title} />
        </FormField>
        <FormField label="Slug" htmlFor="slug">
          <Input id="slug" name="slug" defaultValue={values?.slug} />
        </FormField>
        <FormField label="Department" htmlFor="department">
          <Input id="department" name="department" required defaultValue={values?.department} />
        </FormField>
        <FormField label="Location" htmlFor="location">
          <Input id="location" name="location" required defaultValue={values?.location} />
        </FormField>
        <FormField label="Employment type" htmlFor="employmentType">
          <Select id="employmentType" name="employmentType" defaultValue={values?.employmentType ?? "Full-time"}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Temporary</option>
          </Select>
        </FormField>
        <FormField label="Experience" htmlFor="experience">
          <Input id="experience" name="experience" defaultValue={values?.experience} />
        </FormField>
      </FormSection>
      <FormSection title="Description">
        <FormField label="Description" htmlFor="description" className="md:col-span-2">
          <Textarea id="description" name="description" rows={6} required defaultValue={values?.description} />
        </FormField>
        <FormField label="Requirements" htmlFor="requirements" className="md:col-span-2">
          <Textarea id="requirements" name="requirements" rows={5} defaultValue={values?.requirements} />
        </FormField>
        <FormField label="Benefits" htmlFor="benefits" className="md:col-span-2">
          <Textarea id="benefits" name="benefits" rows={4} defaultValue={values?.benefits} />
        </FormField>
        <FormField label="Responsibilities" htmlFor="responsibilities" hint="One per line.">
          <Textarea id="responsibilities" name="responsibilities" rows={5} defaultValue={values?.responsibilities?.join("\n")} />
        </FormField>
        <FormField label="Skills" htmlFor="skills" hint="One per line.">
          <Textarea id="skills" name="skills" rows={5} defaultValue={values?.skills?.join("\n")} />
        </FormField>
      </FormSection>
      <FormSection title="Status">
        <FormField label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={values?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </Select>
        </FormField>
      </FormSection>
    </MutationForm>
  );
}
