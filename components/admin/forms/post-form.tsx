"use client";

import { FormField } from "@/components/forms/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import { MediaSelector } from "@/components/admin/media/media-selector";
import { useState } from "react";
import type { ActionResult } from "@/lib/admin/action";

type Values = {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  authorName?: string;
  category?: string;
  tags?: string[];
  heroImageId?: string;
  heroImageUrl?: string;
  readTime?: string;
  status?: string;
  featured?: boolean;
  publishedAt?: Date | string;
  seo?: { title?: string; description?: string };
};

function dateValue(value?: Date | string) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

export function PostForm({
  action,
  values,
  submitLabel = "Save",
}: {
  action: (data: FormData) => Promise<ActionResult>;
  values?: Values;
  submitLabel?: string;
}) {
  const [heroImage, setHeroImage] = useState(values?.heroImageId || "");

  return (
    <MutationForm
      action={action}
      submitLabel={submitLabel}
      onSuccessPath={(id) => `/admin/blog/${id}`}
    >
      <FormSection title="Article">
        <FormField label="Title" htmlFor="title">
          <Input id="title" name="title" required defaultValue={values?.title} />
        </FormField>
        <FormField label="Slug" htmlFor="slug">
          <Input id="slug" name="slug" defaultValue={values?.slug} />
        </FormField>
        <FormField label="Excerpt" htmlFor="excerpt" className="md:col-span-2">
          <Textarea id="excerpt" name="excerpt" rows={3} required defaultValue={values?.excerpt} />
        </FormField>
        <FormField label="Body" htmlFor="body" className="md:col-span-2">
          <Textarea id="body" name="body" rows={12} required defaultValue={values?.body} />
        </FormField>
      </FormSection>
      <FormSection title="Taxonomy and media">
        <FormField label="Author" htmlFor="authorName">
          <Input id="authorName" name="authorName" required defaultValue={values?.authorName} />
        </FormField>
        <FormField label="Category" htmlFor="category">
          <Input id="category" name="category" required defaultValue={values?.category} />
        </FormField>
        <FormField label="Tags" htmlFor="tags" hint="Comma or newline separated.">
          <Textarea id="tags" name="tags" rows={3} defaultValue={values?.tags?.join(", ")} />
        </FormField>
        <FormField label="Read time" htmlFor="readTime">
          <Input id="readTime" name="readTime" defaultValue={values?.readTime} />
        </FormField>
        
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-sm font-medium">Hero Image</h4>
          <input type="hidden" name="heroImageId" value={heroImage} />
          <MediaSelector value={heroImage} onChange={setHeroImage} label="Select Hero Image from Media Library" />
          
          <div className="pt-4 border-t border-line mt-4">
            <FormField label="Legacy / External Image URL" htmlFor="heroImageUrl">
              <Input id="heroImageUrl" name="heroImageUrl" defaultValue={values?.heroImageUrl} placeholder="/images/hero.webp" />
            </FormField>
          </div>
        </div>
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
          </Select>
        </FormField>
        <FormField label="Publish date" htmlFor="publishedAt">
          <Input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            defaultValue={dateValue(values?.publishedAt)}
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          <input type="checkbox" name="featured" defaultChecked={values?.featured} />
          Featured
        </label>
      </FormSection>
    </MutationForm>
  );
}
