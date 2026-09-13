"use client";

import { FormField } from "@/components/forms/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import { updatePageSeoAction } from "@/modules/content/actions";
import { Tabs } from "@/components/ui/tabs";
import { PAGE_SEO_KEYS } from "@/modules/content/page-seo.schema";

export function PageSeoForm({ records }: { records: { page: string, seo?: { title?: string | null, description?: string | null } | null }[] }) {
  const tabs = PAGE_SEO_KEYS.map((pageKey) => {
    const record = records.find((r) => r.page === pageKey);
    const seoTitle = record?.seo?.title || "";
    const seoDescription = record?.seo?.description || "";

    const panel = (
      <FormSection title={`SEO Metadata: /${pageKey}`}>
        <div className="md:col-span-2 text-sm text-ink-lighter mb-4">
          Overrides the default generated metadata for the public /{pageKey} page. If left empty, the page&apos;s specific fallback or global SEO will be used.
        </div>
        <input type="hidden" name="page" value={pageKey} />
        <FormField label="SEO Title" htmlFor={`seoTitle-${pageKey}`} className="md:col-span-2">
          <Input
            id={`seoTitle-${pageKey}`}
            name="seoTitle"
            defaultValue={seoTitle}
            placeholder="Default generated title"
          />
        </FormField>
        <FormField label="SEO Description" htmlFor={`seoDescription-${pageKey}`} className="md:col-span-2">
          <Textarea
            id={`seoDescription-${pageKey}`}
            name="seoDescription"
            rows={3}
            defaultValue={seoDescription}
            placeholder="Default generated description"
          />
        </FormField>
      </FormSection>
    );

    return {
      id: pageKey,
      label: `/${pageKey}`,
      panel: (
        <MutationForm action={updatePageSeoAction} submitLabel={`Save /${pageKey} SEO`}>
          {panel}
        </MutationForm>
      ),
    };
  });

  return (
    <Tabs
      tabs={tabs}
    />
  );
}
