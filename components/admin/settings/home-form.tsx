"use client";

import { useState } from "react";
import { FormField } from "@/components/forms/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import { updateHomepageAction } from "@/modules/content/actions";
import { Tabs } from "@/components/ui/tabs";
import type { PublicHomepage } from "@/modules/content/public.service";

export function HomeForm({ values }: { values: PublicHomepage }) {
  const [packages, setPackages] = useState(values.packages || []);
  const [reasons, setReasons] = useState(values.reasons || []);
  const [steps, setSteps] = useState(values.processSteps || []);
  const [faqs, setFaqs] = useState(values.faqs || []);

  const heroAboutTab = (
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

      <FormSection title="About Section">
        <FormField label="Eyebrow" htmlFor="aboutEyebrow">
          <Input id="aboutEyebrow" name="aboutEyebrow" defaultValue={values.aboutEyebrow} />
        </FormField>
        <FormField label="Title" htmlFor="aboutTitle" className="md:col-span-2">
          <Input id="aboutTitle" name="aboutTitle" defaultValue={values.aboutTitle} />
        </FormField>
        <FormField label="Description" htmlFor="aboutDescription" className="md:col-span-2">
          <Textarea id="aboutDescription" name="aboutDescription" rows={3} defaultValue={values.aboutDescription} />
        </FormField>
        <FormField label="Body" htmlFor="aboutBody" className="md:col-span-2">
          <Textarea id="aboutBody" name="aboutBody" rows={4} defaultValue={values.aboutBody} />
        </FormField>
        <FormField label="Link Label" htmlFor="aboutLinkLabel">
          <Input id="aboutLinkLabel" name="aboutLinkLabel" defaultValue={values.aboutLinkLabel} />
        </FormField>
        <FormField label="Link URL" htmlFor="aboutLinkUrl">
          <Input id="aboutLinkUrl" name="aboutLinkUrl" defaultValue={values.aboutLinkUrl} />
        </FormField>
      </FormSection>
    </>
  );

  const packagesTab = (
    <>
      <FormSection title="Packages Intro">
        <FormField label="Eyebrow" htmlFor="packagesEyebrow">
          <Input id="packagesEyebrow" name="packagesEyebrow" defaultValue={values.packagesEyebrow} />
        </FormField>
        <FormField label="Title" htmlFor="packagesTitle" className="md:col-span-2">
          <Input id="packagesTitle" name="packagesTitle" defaultValue={values.packagesTitle} />
        </FormField>
        <FormField label="Description" htmlFor="packagesDescription" className="md:col-span-2">
          <Textarea id="packagesDescription" name="packagesDescription" rows={2} defaultValue={values.packagesDescription} />
        </FormField>
      </FormSection>

      <FormSection title="Package Items">
        <div className="md:col-span-2 space-y-6">
          <input type="hidden" name="packagesJson" value={JSON.stringify(packages)} />
          {packages.map((pkg, idx) => (
            <div key={idx} className="border border-line rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <Input
                  placeholder="Package Name"
                  value={pkg.name}
                  onChange={(e) => {
                    const next = [...packages];
                    next[idx].name = e.target.value;
                    setPackages(next);
                  }}
                  className="font-medium max-w-xs"
                />
                <button
                  type="button"
                  onClick={() => setPackages(packages.filter((_, i) => i !== idx))}
                  className="text-red-500 text-sm"
                >
                  Remove Package
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Audience" htmlFor={`pkg-${idx}-aud`}>
                  <Input
                    id={`pkg-${idx}-aud`}
                    value={pkg.audience}
                    onChange={(e) => {
                      const next = [...packages];
                      next[idx].audience = e.target.value;
                      setPackages(next);
                    }}
                  />
                </FormField>
                <FormField label="Summary" htmlFor={`pkg-${idx}-sum`} className="md:col-span-2">
                  <Textarea
                    id={`pkg-${idx}-sum`}
                    value={pkg.summary}
                    onChange={(e) => {
                      const next = [...packages];
                      next[idx].summary = e.target.value;
                      setPackages(next);
                    }}
                  />
                </FormField>
                <FormField label="Features (comma separated)" htmlFor={`pkg-${idx}-inc`} className="md:col-span-2">
                  <Input
                    id={`pkg-${idx}-inc`}
                    value={pkg.includes?.join(", ") || ""}
                    onChange={(e) => {
                      const next = [...packages];
                      next[idx].includes = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      setPackages(next);
                    }}
                    placeholder="E.g. Strategy, Design, Build"
                  />
                </FormField>
                <label className="flex items-center gap-2 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={pkg.featured}
                    onChange={(e) => {
                      const next = [...packages];
                      next[idx].featured = e.target.checked;
                      setPackages(next);
                    }}
                  />
                  <span>Featured Package</span>
                </label>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setPackages([...packages, { name: "New Package", audience: "", summary: "", includes: [], featured: false }])}
            className="text-brand text-sm font-medium"
          >
            + Add Package
          </button>
        </div>
      </FormSection>
    </>
  );

  const processTab = (
    <>
      <FormSection title="Process Intro">
        <FormField label="Eyebrow" htmlFor="processEyebrow">
          <Input id="processEyebrow" name="processEyebrow" defaultValue={values.processEyebrow} />
        </FormField>
        <FormField label="Title" htmlFor="processTitle" className="md:col-span-2">
          <Input id="processTitle" name="processTitle" defaultValue={values.processTitle} />
        </FormField>
        <FormField label="Description" htmlFor="processDescription" className="md:col-span-2">
          <Textarea id="processDescription" name="processDescription" rows={2} defaultValue={values.processDescription} />
        </FormField>
      </FormSection>

      <FormSection title="Process Steps">
        <div className="md:col-span-2 space-y-4">
          <input type="hidden" name="processStepsJson" value={JSON.stringify(steps)} />
          {steps.map((step, idx) => (
            <div key={idx} className="border border-line rounded-lg p-4 space-y-4 relative">
              <button
                type="button"
                onClick={() => setSteps(steps.filter((_, i) => i !== idx))}
                className="absolute top-4 right-4 text-red-500 text-sm"
              >
                Remove
              </button>
              <FormField label="Step Title" htmlFor={`step-${idx}-title`}>
                <Input
                  id={`step-${idx}-title`}
                  value={step.title}
                  onChange={(e) => {
                    const next = [...steps];
                    next[idx].title = e.target.value;
                    setSteps(next);
                  }}
                />
              </FormField>
              <FormField label="Step Body" htmlFor={`step-${idx}-body`} className="md:col-span-2">
                <Textarea
                  id={`step-${idx}-body`}
                  value={step.body}
                  onChange={(e) => {
                    const next = [...steps];
                    next[idx].body = e.target.value;
                    setSteps(next);
                  }}
                />
              </FormField>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSteps([...steps, { title: "", body: "" }])}
            className="text-brand text-sm font-medium"
          >
            + Add Step
          </button>
        </div>
      </FormSection>
    </>
  );

  const reasonsFaqTab = (
    <>
      <FormSection title="Why TechCore">
        <FormField label="Eyebrow" htmlFor="reasonsEyebrow">
          <Input id="reasonsEyebrow" name="reasonsEyebrow" defaultValue={values.reasonsEyebrow} />
        </FormField>
        <FormField label="Title" htmlFor="reasonsTitle" className="md:col-span-2">
          <Input id="reasonsTitle" name="reasonsTitle" defaultValue={values.reasonsTitle} />
        </FormField>
        
        <div className="md:col-span-2 space-y-4 mt-4">
          <input type="hidden" name="reasonsJson" value={JSON.stringify(reasons)} />
          {reasons.map((reason, idx) => (
            <div key={idx} className="border border-line rounded-lg p-4 space-y-4 relative">
              <button
                type="button"
                onClick={() => setReasons(reasons.filter((_, i) => i !== idx))}
                className="absolute top-4 right-4 text-red-500 text-sm"
              >
                Remove
              </button>
              <FormField label="Reason Title" htmlFor={`rsn-${idx}-title`}>
                <Input
                  id={`rsn-${idx}-title`}
                  value={reason.title}
                  onChange={(e) => {
                    const next = [...reasons];
                    next[idx].title = e.target.value;
                    setReasons(next);
                  }}
                />
              </FormField>
              <FormField label="Reason Body" htmlFor={`rsn-${idx}-body`} className="md:col-span-2">
                <Textarea
                  id={`rsn-${idx}-body`}
                  value={reason.body}
                  onChange={(e) => {
                    const next = [...reasons];
                    next[idx].body = e.target.value;
                    setReasons(next);
                  }}
                />
              </FormField>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setReasons([...reasons, { title: "", body: "" }])}
            className="text-brand text-sm font-medium"
          >
            + Add Reason
          </button>
        </div>
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

  const introsCtaTab = (
    <>
      <FormSection title="Dynamic Section Intros">
        <div className="md:col-span-2 text-sm text-ink-lighter mb-4">
          These control the headings above grid sections (Services, Solutions, etc.). The grid items themselves are managed in their respective collections.
        </div>
        <FormField label="Services Eyebrow" htmlFor="servicesEyebrow">
          <Input id="servicesEyebrow" name="servicesEyebrow" defaultValue={values.servicesEyebrow} />
        </FormField>
        <FormField label="Services Title" htmlFor="servicesTitle">
          <Input id="servicesTitle" name="servicesTitle" defaultValue={values.servicesTitle} />
        </FormField>
        <FormField label="Services Description" htmlFor="servicesDescription" className="md:col-span-2">
          <Textarea id="servicesDescription" name="servicesDescription" rows={2} defaultValue={values.servicesDescription} />
        </FormField>

        <FormField label="Solutions Eyebrow" htmlFor="solutionsEyebrow">
          <Input id="solutionsEyebrow" name="solutionsEyebrow" defaultValue={values.solutionsEyebrow} />
        </FormField>
        <FormField label="Solutions Title" htmlFor="solutionsTitle">
          <Input id="solutionsTitle" name="solutionsTitle" defaultValue={values.solutionsTitle} />
        </FormField>
        <FormField label="Solutions Description" htmlFor="solutionsDescription" className="md:col-span-2">
          <Textarea id="solutionsDescription" name="solutionsDescription" rows={2} defaultValue={values.solutionsDescription} />
        </FormField>

        <FormField label="Projects Eyebrow" htmlFor="projectsEyebrow">
          <Input id="projectsEyebrow" name="projectsEyebrow" defaultValue={values.projectsEyebrow} />
        </FormField>
        <FormField label="Projects Title" htmlFor="projectsTitle">
          <Input id="projectsTitle" name="projectsTitle" defaultValue={values.projectsTitle} />
        </FormField>
        <FormField label="Projects Description" htmlFor="projectsDescription" className="md:col-span-2">
          <Textarea id="projectsDescription" name="projectsDescription" rows={2} defaultValue={values.projectsDescription} />
        </FormField>

        <FormField label="Industries Eyebrow" htmlFor="industriesEyebrow">
          <Input id="industriesEyebrow" name="industriesEyebrow" defaultValue={values.industriesEyebrow} />
        </FormField>
        <FormField label="Industries Title" htmlFor="industriesTitle">
          <Input id="industriesTitle" name="industriesTitle" defaultValue={values.industriesTitle} />
        </FormField>
        <FormField label="Industries Description" htmlFor="industriesDescription" className="md:col-span-2">
          <Textarea id="industriesDescription" name="industriesDescription" rows={2} defaultValue={values.industriesDescription} />
        </FormField>

        <FormField label="Testimonials Eyebrow" htmlFor="testimonialsEyebrow">
          <Input id="testimonialsEyebrow" name="testimonialsEyebrow" defaultValue={values.testimonialsEyebrow} />
        </FormField>
        <FormField label="Testimonials Title" htmlFor="testimonialsTitle">
          <Input id="testimonialsTitle" name="testimonialsTitle" defaultValue={values.testimonialsTitle} />
        </FormField>
        <FormField label="Testimonials Description" htmlFor="testimonialsDescription" className="md:col-span-2">
          <Textarea id="testimonialsDescription" name="testimonialsDescription" rows={2} defaultValue={values.testimonialsDescription} />
        </FormField>

        <FormField label="Insights Eyebrow" htmlFor="insightsEyebrow">
          <Input id="insightsEyebrow" name="insightsEyebrow" defaultValue={values.insightsEyebrow} />
        </FormField>
        <FormField label="Insights Title" htmlFor="insightsTitle">
          <Input id="insightsTitle" name="insightsTitle" defaultValue={values.insightsTitle} />
        </FormField>
        <FormField label="Insights Description" htmlFor="insightsDescription" className="md:col-span-2">
          <Textarea id="insightsDescription" name="insightsDescription" rows={2} defaultValue={values.insightsDescription} />
        </FormField>
      </FormSection>

      <FormSection title="Homepage Call to Action">
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

  return (
    <MutationForm action={updateHomepageAction} submitLabel="Save Homepage">
      <Tabs
        tabs={[
          { id: "hero", label: "Hero & About", panel: heroAboutTab },
          { id: "packages", label: "Packages", panel: packagesTab },
          { id: "process", label: "Process", panel: processTab },
          { id: "reasons", label: "Reasons & FAQ", panel: reasonsFaqTab },
          { id: "intros", label: "Section Intros & CTA", panel: introsCtaTab },
        ]}
      />
    </MutationForm>
  );
}
