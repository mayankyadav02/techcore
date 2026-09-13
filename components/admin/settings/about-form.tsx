"use client";

import { useState } from "react";
import { FormField } from "@/components/forms/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import { updateAboutAction } from "@/modules/content/actions";
import { Tabs } from "@/components/ui/tabs";
import type { PublicAbout } from "@/modules/content/public.service";

export function AboutForm({ values }: { values: PublicAbout }) {
  const [valuesList, setValuesList] = useState(values.values || []);
  const [faqs, setFaqs] = useState(values.faqs || []);

  const heroStoryTab = (
    <>
      <FormSection title="Hero">
        <FormField label="Eyebrow" htmlFor="heroEyebrow">
          <Input id="heroEyebrow" name="heroEyebrow" defaultValue={values.heroEyebrow} />
        </FormField>
        <FormField label="Title" htmlFor="heroTitle" className="md:col-span-2">
          <Input id="heroTitle" name="heroTitle" defaultValue={values.heroTitle} />
        </FormField>
        <FormField label="Description" htmlFor="heroDescription" className="md:col-span-2">
          <Textarea id="heroDescription" name="heroDescription" rows={3} defaultValue={values.heroDescription} />
        </FormField>
        
        <FormField label="Primary Button Label" htmlFor="heroPrimaryLabel">
          <Input id="heroPrimaryLabel" name="heroPrimaryLabel" defaultValue={values.heroPrimaryLabel} />
        </FormField>
        <FormField label="Primary Button URL" htmlFor="heroPrimaryUrl">
          <Input id="heroPrimaryUrl" name="heroPrimaryUrl" defaultValue={values.heroPrimaryUrl} />
        </FormField>
        
        <FormField label="Secondary Button Label" htmlFor="heroSecondaryLabel">
          <Input id="heroSecondaryLabel" name="heroSecondaryLabel" defaultValue={values.heroSecondaryLabel} />
        </FormField>
        <FormField label="Secondary Button URL" htmlFor="heroSecondaryUrl">
          <Input id="heroSecondaryUrl" name="heroSecondaryUrl" defaultValue={values.heroSecondaryUrl} />
        </FormField>
      </FormSection>

      <FormSection title="Story Section">
        <FormField label="Eyebrow" htmlFor="storyEyebrow">
          <Input id="storyEyebrow" name="storyEyebrow" defaultValue={values.storyEyebrow} />
        </FormField>
        <FormField label="Title" htmlFor="storyTitle" className="md:col-span-2">
          <Input id="storyTitle" name="storyTitle" defaultValue={values.storyTitle} />
        </FormField>
        <FormField label="Description" htmlFor="storyDescription" className="md:col-span-2">
          <Textarea id="storyDescription" name="storyDescription" rows={3} defaultValue={values.storyDescription} />
        </FormField>
        <FormField label="Body" htmlFor="storyBody" className="md:col-span-2">
          <Textarea id="storyBody" name="storyBody" rows={4} defaultValue={values.storyBody} />
        </FormField>
      </FormSection>
    </>
  );

  const missionVisionTab = (
    <>
      <FormSection title="Mission">
        <FormField label="Title" htmlFor="missionTitle" className="md:col-span-2">
          <Input id="missionTitle" name="missionTitle" defaultValue={values.missionTitle} />
        </FormField>
        <FormField label="Body" htmlFor="missionBody" className="md:col-span-2">
          <Textarea id="missionBody" name="missionBody" rows={3} defaultValue={values.missionBody} />
        </FormField>
      </FormSection>

      <FormSection title="Vision">
        <FormField label="Title" htmlFor="visionTitle" className="md:col-span-2">
          <Input id="visionTitle" name="visionTitle" defaultValue={values.visionTitle} />
        </FormField>
        <FormField label="Body" htmlFor="visionBody" className="md:col-span-2">
          <Textarea id="visionBody" name="visionBody" rows={3} defaultValue={values.visionBody} />
        </FormField>
      </FormSection>
    </>
  );

  const valuesApproachTab = (
    <>
      <FormSection title="Values">
        <FormField label="Eyebrow" htmlFor="valuesEyebrow">
          <Input id="valuesEyebrow" name="valuesEyebrow" defaultValue={values.valuesEyebrow} />
        </FormField>
        <FormField label="Title" htmlFor="valuesTitle" className="md:col-span-2">
          <Input id="valuesTitle" name="valuesTitle" defaultValue={values.valuesTitle} />
        </FormField>

        <div className="md:col-span-2 space-y-4 mt-4">
          <input type="hidden" name="valuesJson" value={JSON.stringify(valuesList)} />
          {valuesList.map((val, idx) => (
            <div key={idx} className="border border-line rounded-lg p-4 space-y-4 relative">
              <button
                type="button"
                onClick={() => setValuesList(valuesList.filter((_, i) => i !== idx))}
                className="absolute top-4 right-4 text-red-500 text-sm"
              >
                Remove
              </button>
              <FormField label="Value Title" htmlFor={`val-${idx}-title`}>
                <Input
                  id={`val-${idx}-title`}
                  value={val.title}
                  onChange={(e) => {
                    const next = [...valuesList];
                    next[idx].title = e.target.value;
                    setValuesList(next);
                  }}
                />
              </FormField>
              <FormField label="Value Body" htmlFor={`val-${idx}-body`} className="md:col-span-2">
                <Textarea
                  id={`val-${idx}-body`}
                  value={val.body}
                  onChange={(e) => {
                    const next = [...valuesList];
                    next[idx].body = e.target.value;
                    setValuesList(next);
                  }}
                />
              </FormField>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setValuesList([...valuesList, { title: "", body: "" }])}
            className="text-brand text-sm font-medium"
          >
            + Add Value
          </button>
        </div>
      </FormSection>

      <FormSection title="Expertise Intro">
        <FormField label="Eyebrow" htmlFor="expertiseEyebrow">
          <Input id="expertiseEyebrow" name="expertiseEyebrow" defaultValue={values.expertiseEyebrow} />
        </FormField>
        <FormField label="Title" htmlFor="expertiseTitle" className="md:col-span-2">
          <Input id="expertiseTitle" name="expertiseTitle" defaultValue={values.expertiseTitle} />
        </FormField>
      </FormSection>

      <FormSection title="Approach">
        <FormField label="Eyebrow" htmlFor="approachEyebrow">
          <Input id="approachEyebrow" name="approachEyebrow" defaultValue={values.approachEyebrow} />
        </FormField>
        <FormField label="Title" htmlFor="approachTitle" className="md:col-span-2">
          <Input id="approachTitle" name="approachTitle" defaultValue={values.approachTitle} />
        </FormField>
        <FormField label="Description" htmlFor="approachDescription" className="md:col-span-2">
          <Textarea id="approachDescription" name="approachDescription" rows={3} defaultValue={values.approachDescription} />
        </FormField>
      </FormSection>
    </>
  );

  const expectationsFaqTab = (
    <>
      <FormSection title="Why TechCore (Expectations)">
        <div className="md:col-span-2 text-sm text-ink-lighter mb-4">
          Note: The items displayed in this section are managed globally from the Homepage Settings. You can only edit the section intro here.
        </div>
        <FormField label="Eyebrow" htmlFor="expectationsEyebrow">
          <Input id="expectationsEyebrow" name="expectationsEyebrow" defaultValue={values.expectationsEyebrow} />
        </FormField>
        <FormField label="Title" htmlFor="expectationsTitle" className="md:col-span-2">
          <Input id="expectationsTitle" name="expectationsTitle" defaultValue={values.expectationsTitle} />
        </FormField>
      </FormSection>

      <FormSection title="FAQ">
        <FormField label="Eyebrow" htmlFor="faqEyebrow">
          <Input id="faqEyebrow" name="faqEyebrow" defaultValue={values.faqEyebrow} />
        </FormField>
        <FormField label="Title" htmlFor="faqTitle" className="md:col-span-2">
          <Input id="faqTitle" name="faqTitle" defaultValue={values.faqTitle} />
        </FormField>
        
        <div className="md:col-span-2 space-y-4 mt-4">
          <input type="hidden" name="faqsJson" value={JSON.stringify(faqs)} />
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-line rounded-lg p-4 space-y-4 relative">
              <button
                type="button"
                onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                className="absolute top-4 right-4 text-red-500 text-sm"
              >
                Remove
              </button>
              <FormField label="Question" htmlFor={`faq-${idx}-title`}>
                <Input
                  id={`faq-${idx}-title`}
                  value={faq.title}
                  onChange={(e) => {
                    const next = [...faqs];
                    next[idx].title = e.target.value;
                    setFaqs(next);
                  }}
                />
              </FormField>
              <FormField label="Answer" htmlFor={`faq-${idx}-body`} className="md:col-span-2">
                <Textarea
                  id={`faq-${idx}-body`}
                  value={faq.content}
                  onChange={(e) => {
                    const next = [...faqs];
                    next[idx].content = e.target.value;
                    setFaqs(next);
                  }}
                />
              </FormField>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFaqs([...faqs, { title: "", content: "" }])}
            className="text-brand text-sm font-medium"
          >
            + Add FAQ
          </button>
        </div>
      </FormSection>
    </>
  );

  const ctaTab = (
    <>
      <FormSection title="Call to Action">
        <FormField label="CTA Title" htmlFor="ctaTitle" className="md:col-span-2">
          <Input id="ctaTitle" name="ctaTitle" defaultValue={values.ctaTitle} />
        </FormField>
        <FormField label="CTA Description" htmlFor="ctaDescription" className="md:col-span-2">
          <Textarea id="ctaDescription" name="ctaDescription" rows={3} defaultValue={values.ctaDescription} />
        </FormField>
        
        <FormField label="Primary Button Label" htmlFor="ctaPrimaryLabel">
          <Input id="ctaPrimaryLabel" name="ctaPrimaryLabel" defaultValue={values.ctaPrimaryLabel} />
        </FormField>
        <FormField label="Primary Button URL" htmlFor="ctaPrimaryUrl">
          <Input id="ctaPrimaryUrl" name="ctaPrimaryUrl" defaultValue={values.ctaPrimaryUrl} />
        </FormField>
        
        <FormField label="Secondary Button Label" htmlFor="ctaSecondaryLabel">
          <Input id="ctaSecondaryLabel" name="ctaSecondaryLabel" defaultValue={values.ctaSecondaryLabel} />
        </FormField>
        <FormField label="Secondary Button URL" htmlFor="ctaSecondaryUrl">
          <Input id="ctaSecondaryUrl" name="ctaSecondaryUrl" defaultValue={values.ctaSecondaryUrl} />
        </FormField>
      </FormSection>
    </>
  );

  const seoTab = (
    <>
      <FormSection title="SEO Metadata">
        <div className="md:col-span-2 text-sm text-ink-lighter mb-4">
          Overrides the default generated metadata for the About page. If left empty, the site&apos;s global SEO settings or content title will be used.
        </div>
        <FormField label="SEO Title" htmlFor="seoTitle" className="md:col-span-2">
          <Input id="seoTitle" name="seoTitle" defaultValue={values.seoTitle} placeholder={values.heroTitle} />
        </FormField>
        <FormField label="SEO Description" htmlFor="seoDescription" className="md:col-span-2">
          <Textarea id="seoDescription" name="seoDescription" rows={3} defaultValue={values.seoDescription} placeholder={values.heroDescription} />
        </FormField>
      </FormSection>
    </>
  );

  return (
    <MutationForm action={updateAboutAction} submitLabel="Save About Content">
      <Tabs
        tabs={[
          { id: "hero", label: "Hero & Story", panel: heroStoryTab },
          { id: "mission", label: "Mission & Vision", panel: missionVisionTab },
          { id: "values", label: "Values & Approach", panel: valuesApproachTab },
          { id: "expectations", label: "Expectations & FAQ", panel: expectationsFaqTab },
          { id: "cta", label: "Call to Action", panel: ctaTab },
          { id: "seo", label: "SEO", panel: seoTab },
        ]}
      />
    </MutationForm>
  );
}
