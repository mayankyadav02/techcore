"use client";

import { useState } from "react";
import { FormField } from "@/components/forms/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import { updateSettingsAction } from "@/modules/content/actions";
import { Tabs } from "@/components/ui/tabs";

type NavItem = { label: string; href: string };
type FooterGroup = { title: string; links: NavItem[] };

export function SettingsForm(values: {
  companyName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoType: string;
  logoText: string;
  navigation: NavItem[];
  ctaLabel: string;
  ctaUrl: string;
  footerGroups: FooterGroup[];
  linkedin: string;
  x: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
  canWriteInternal: boolean;
}) {
  const [nav, setNav] = useState<NavItem[]>(values.navigation || []);
  const [footer, setFooter] = useState<FooterGroup[]>(values.footerGroups || []);

  const brandingTab = (
    <FormSection title="Company & Branding">
      <FormField label="Company name" htmlFor="companyName">
        <Input id="companyName" name="companyName" required defaultValue={values.companyName} />
      </FormField>
      <FormField label="Tagline" htmlFor="tagline">
        <Input id="tagline" name="tagline" defaultValue={values.tagline} />
      </FormField>
      <FormField label="Logo type" htmlFor="logoType">
        <select
          id="logoType"
          name="logoType"
          defaultValue={values.logoType}
          className="flex h-11 w-full rounded-xl border border-line bg-surface px-4 py-2 text-sm text-ink transition-colors focus-visible:border-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="image">Image (Hardcoded Assets)</option>
          <option value="text">Text Logo</option>
        </select>
      </FormField>
      <FormField label="Logo text (if text type)" htmlFor="logoText">
        <Input id="logoText" name="logoText" defaultValue={values.logoText} />
      </FormField>
      <FormField label="Email" htmlFor="contactEmail">
        <Input id="contactEmail" name="contactEmail" type="email" required defaultValue={values.contactEmail} />
      </FormField>
      <FormField label="Phone" htmlFor="contactPhone">
        <Input id="contactPhone" name="contactPhone" defaultValue={values.contactPhone} />
      </FormField>
      <FormField label="Address" htmlFor="address" className="md:col-span-2">
        <Input id="address" name="address" defaultValue={values.address} />
      </FormField>
    </FormSection>
  );

  const navTab = (
    <FormSection title="Navigation">
      <div className="md:col-span-2 space-y-4">
        <input type="hidden" name="navigationJson" value={JSON.stringify(nav)} />
        {nav.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input
              placeholder="Label"
              value={item.label}
              onChange={(e) => {
                const updated = [...nav];
                updated[idx].label = e.target.value;
                setNav(updated);
              }}
              required
            />
            <Input
              placeholder="URL"
              value={item.href}
              onChange={(e) => {
                const updated = [...nav];
                updated[idx].href = e.target.value;
                setNav(updated);
              }}
              required
            />
            <button
              type="button"
              onClick={() => setNav(nav.filter((_, i) => i !== idx))}
              className="text-red-500 text-sm px-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setNav([...nav, { label: "", href: "" }])}
          className="text-brand text-sm font-medium"
        >
          + Add Nav Item
        </button>
      </div>
      <FormField label="Navbar CTA Label" htmlFor="ctaLabel">
        <Input id="ctaLabel" name="ctaLabel" defaultValue={values.ctaLabel} />
      </FormField>
      <FormField label="Navbar CTA URL" htmlFor="ctaUrl">
        <Input id="ctaUrl" name="ctaUrl" defaultValue={values.ctaUrl} />
      </FormField>
    </FormSection>
  );

  const footerTab = (
    <FormSection title="Footer">
      <FormField label="Footer information" htmlFor="footerText" className="md:col-span-2">
        <Textarea id="footerText" name="footerText" rows={2} defaultValue={values.footerText} />
      </FormField>
      <div className="md:col-span-2 space-y-6 mt-4">
        <input type="hidden" name="footerGroupsJson" value={JSON.stringify(footer)} />
        {footer.map((group, gIdx) => (
          <div key={gIdx} className="border border-line rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <Input
                placeholder="Group Title"
                value={group.title}
                onChange={(e) => {
                  const updated = [...footer];
                  updated[gIdx].title = e.target.value;
                  setFooter(updated);
                }}
                required
                className="font-medium max-w-xs"
              />
              <button
                type="button"
                onClick={() => setFooter(footer.filter((_, i) => i !== gIdx))}
                className="text-red-500 text-sm"
              >
                Remove Group
              </button>
            </div>
            <div className="pl-4 space-y-2 border-l border-line">
              {group.links.map((link, lIdx) => (
                <div key={lIdx} className="flex gap-2 items-center">
                  <Input
                    placeholder="Link Label"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...footer];
                      updated[gIdx].links[lIdx].label = e.target.value;
                      setFooter(updated);
                    }}
                    required
                  />
                  <Input
                    placeholder="URL"
                    value={link.href}
                    onChange={(e) => {
                      const updated = [...footer];
                      updated[gIdx].links[lIdx].href = e.target.value;
                      setFooter(updated);
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...footer];
                      updated[gIdx].links = updated[gIdx].links.filter((_, i) => i !== lIdx);
                      setFooter(updated);
                    }}
                    className="text-red-500 text-sm px-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const updated = [...footer];
                  updated[gIdx].links.push({ label: "", href: "" });
                  setFooter(updated);
                }}
                className="text-brand text-sm font-medium mt-2 block"
              >
                + Add Link
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFooter([...footer, { title: "", links: [] }])}
          className="text-brand text-sm font-medium"
        >
          + Add Footer Group
        </button>
      </div>
    </FormSection>
  );

  const socialTab = (
    <>
      <FormSection title="Social">
        <FormField label="LinkedIn URL" htmlFor="linkedin">
          <Input id="linkedin" name="linkedin" defaultValue={values.linkedin} />
        </FormField>
        <FormField label="X URL" htmlFor="x">
          <Input id="x" name="x" defaultValue={values.x} />
        </FormField>
      </FormSection>
      {values.canWriteInternal && (
        <FormSection title="Default SEO">
          <FormField label="Default title" htmlFor="seoTitle">
            <Input id="seoTitle" name="seoTitle" defaultValue={values.seoTitle} />
          </FormField>
          <FormField label="Default description" htmlFor="seoDescription" className="md:col-span-2">
            <Textarea
              id="seoDescription"
              name="seoDescription"
              rows={3}
              defaultValue={values.seoDescription}
            />
          </FormField>
        </FormSection>
      )}
    </>
  );

  return (
    <MutationForm action={updateSettingsAction} submitLabel="Save settings">
      <Tabs
        tabs={[
          { id: "branding", label: "Branding", panel: brandingTab },
          { id: "navigation", label: "Navigation", panel: navTab },
          { id: "footer", label: "Footer", panel: footerTab },
          { id: "social", label: "Social & SEO", panel: socialTab },
        ]}
      />
    </MutationForm>
  );
}
