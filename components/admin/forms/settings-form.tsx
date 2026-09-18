"use client";

import { useState, useTransition } from "react";
import { FormField } from "@/components/forms/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import { updateSettingsAction } from "@/modules/content/actions";
import { sendTestEmailAction } from "@/modules/notifications/actions";
import { Tabs } from "@/components/ui/tabs";
import { MediaSelector } from "@/components/admin/media/media-selector";

type NavItem = { label: string; href: string };
type FooterGroup = { title: string; links: NavItem[] };

/** Strict 6-digit hex colour regex — used for client-side validation only.
 *  Server-side (Zod) and runtime (layout.tsx) maintain independent copies. */
const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

/** Minimum required contrast ratio (WCAG AA threshold for UI components) */
const MIN_CONTRAST = 3;

/** Compute perceived luminance of a #RRGGBB hex colour (0–1) */
function getLuminance(hex: string): number | null {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return null;
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = toLinear(parseInt(m[1], 16));
  const g = toLinear(parseInt(m[2], 16));
  const b = toLinear(parseInt(m[3], 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function hexContrastWarning(hex: string): string | null {
  const lum = getLuminance(hex);
  if (lum === null) return null;
  const whiteLum = 1;
  const blackLum = 0;
  const againstWhite = contrastRatio(lum, whiteLum);
  const againstBlack = contrastRatio(lum, blackLum);
  if (againstWhite < MIN_CONTRAST && againstBlack < MIN_CONTRAST) {
    return "May have low contrast with both light and dark text.";
  }
  if (againstWhite < MIN_CONTRAST) {
    return "May have low contrast with white text on buttons.";
  }
  return null;
}

/** A combined color-picker + hex text input that stays synchronized.
 *  The visible inputs are display-only; the actual submitted value comes
 *  from a separate hidden input managed by the parent form. */
function ColorInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const isValidHex = HEX_RE.test(value);
  const pickerValue = isValidHex ? value : "#000000";
  const warning = isValidHex ? hexContrastWarning(value) : null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2 items-center">
        <input
          type="color"
          aria-label={`Colour picker for ${id}`}
          value={pickerValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-11 flex-none cursor-pointer rounded-[var(--radius-md)] border border-line bg-elevated p-1 transition-colors hover:border-line-strong"
        />
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          maxLength={7}
          className="w-full rounded-[var(--radius-md)] border border-line bg-elevated px-3 py-2.5 text-sm text-ink placeholder:text-ink-subtle transition-colors duration-150 hover:border-line-strong focus-visible:border-brand-dark h-11 font-mono"
        />
      </div>
      {value && !isValidHex && (
        <p className="text-xs text-danger">Enter a 6-digit hex colour, e.g. #00c878</p>
      )}
      {warning && (
        <p className="text-xs text-warning">{warning}</p>
      )}
    </div>
  );
}

const RADIUS_OPTIONS = [
  { value: "", label: "Default" },
  { value: "none", label: "None (sharp)" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
] as const;

/** Inline preview panel showing live colours from local state. */
function ThemePreview({
  brand,
  brandDark,
  brandLight,
  radius,
}: {
  brand: string;
  brandDark: string;
  brandLight: string;
  radius: string;
}) {
  const validBrand = HEX_RE.test(brand) ? brand : "#00c878";
  const validDark = HEX_RE.test(brandDark) ? brandDark : "#00a866";
  const validLight = HEX_RE.test(brandLight) ? brandLight : "#00f06a";

  const radiusMap: Record<string, string> = {
    "": "12px",
    none: "0px",
    sm: "6px",
    md: "12px",
    lg: "20px",
  };
  const borderRadius = radiusMap[radius] ?? "12px";

  return (
    <div
      className="md:col-span-2 mt-2 p-4 bg-surface rounded-xl border border-line space-y-4"
      aria-label="Theme preview"
    >
      <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Preview</p>
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          style={{ background: validBrand, borderRadius }}
          className="px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Primary button
        </button>
        <button
          type="button"
          style={{
            background: "transparent",
            borderColor: validBrand,
            color: validBrand,
            borderRadius,
            borderWidth: "1.5px",
            borderStyle: "solid",
          }}
          className="px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
        >
          Outline button
        </button>
        <span
          className="px-3 py-1 text-xs font-semibold rounded-full text-white"
          style={{ background: validLight }}
        >
          Accent badge
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <span
          className="inline-block w-4 h-4 rounded-full flex-none"
          style={{ background: validBrand }}
        />
        <p className="text-sm">
          <span style={{ color: validBrand }} className="font-semibold">Brand</span>
          {" "}&nbsp;
          <span style={{ color: validDark }} className="font-semibold">Dark</span>
          {" "}&nbsp;
          <span style={{ color: validLight }} className="font-semibold">Light</span>
        </p>
      </div>
      <div
        className="h-2 rounded-full"
        style={{ background: `linear-gradient(to right, ${validBrand}, ${validLight})`, borderRadius }}
      />
    </div>
  );
}

function TestEmailButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  return (
    <div className="md:col-span-2 mt-2 p-4 bg-surface rounded-xl border border-line">
      <h3 className="text-sm font-semibold mb-2">Test Email Configuration</h3>
      <p className="text-sm text-ink/70 mb-4">Send a test email to your account email address to verify Resend and domain settings.</p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setMessage(null);
            startTransition(async () => {
              try {
                const res = await sendTestEmailAction();
                if (res.success) {
                  setMessage({ text: "Test email sent successfully.", error: false });
                } else {
                  setMessage({ text: res.error || "Failed to send test email.", error: true });
                }
              } catch (err) {
                setMessage({ text: "An unexpected error occurred.", error: true });
              }
            });
          }}
          className="text-sm font-medium px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Send Test Email"}
        </button>
        {message && (
          <p className={`text-sm ${message.error ? "text-red-500" : "text-green-600"}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

export function SettingsForm(values: {
  companyName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoId?: string;
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
  themeBrand: string;
  themeBrandDark: string;
  themeBrandLight: string;
  themeRadius: string;
  canWriteInternal: boolean;
}) {
  const [nav, setNav] = useState<NavItem[]>(values.navigation || []);
  const [footer, setFooter] = useState<FooterGroup[]>(values.footerGroups || []);
  const [logoId, setLogoId] = useState(values.logoId || "");
  const [themeBrand, setThemeBrand] = useState(values.themeBrand || "");
  const [themeBrandDark, setThemeBrandDark] = useState(values.themeBrandDark || "");
  const [themeBrandLight, setThemeBrandLight] = useState(values.themeBrandLight || "");
  const [themeRadius, setThemeRadius] = useState(values.themeRadius || "");

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
          <option value="image">Image (CMS / Hardcoded Assets)</option>
          <option value="text">Text Logo</option>
        </select>
      </FormField>
      <input type="hidden" name="logoId" value={logoId} />
      <FormField label="Logo Image (if image type)" htmlFor="logoId">
        <MediaSelector value={logoId} onChange={(id) => setLogoId(id)} label="Select Logo" />
      </FormField>
      <FormField label="Logo text (if text type)" htmlFor="logoText">
        <Input id="logoText" name="logoText" defaultValue={values.logoText} />
      </FormField>
      <FormField label="Email" htmlFor="contactEmail">
        <Input id="contactEmail" name="contactEmail" type="email" required defaultValue={values.contactEmail} />
      </FormField>
      <TestEmailButton />
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

  const themeTab = (
    <FormSection
      title="Theme & Appearance"
      description="Customize the brand colors and visual style used across the website."
    >
      {/* Hidden inputs carry the current state values to FormData */}
      <input type="hidden" name="themeBrand" value={themeBrand} />
      <input type="hidden" name="themeBrandDark" value={themeBrandDark} />
      <input type="hidden" name="themeBrandLight" value={themeBrandLight} />
      <input type="hidden" name="themeRadius" value={themeRadius} />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink">Brand Color</label>
        <p className="text-xs text-ink-muted">Used on primary buttons, links, and key accents.</p>
        <ColorInput
          id="themeBrand-picker"
          value={themeBrand}
          onChange={setThemeBrand}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink">Dark Brand Color</label>
        <p className="text-xs text-ink-muted">Used for hover states and pressed elements.</p>
        <ColorInput
          id="themeBrandDark-picker"
          value={themeBrandDark}
          onChange={setThemeBrandDark}
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink">Light Brand Color</label>
        <p className="text-xs text-ink-muted">Used for accents, gradients, and highlights.</p>
        <ColorInput
          id="themeBrandLight-picker"
          value={themeBrandLight}
          onChange={setThemeBrandLight}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="themeRadius-select" className="block text-sm font-medium text-ink">Border Radius</label>
        <p className="text-xs text-ink-muted">Controls the roundness of buttons, cards, and inputs across the site.</p>
        <select
          id="themeRadius-select"
          value={themeRadius}
          onChange={(e) => setThemeRadius(e.target.value)}
          className="w-full rounded-[var(--radius-md)] border border-line bg-elevated px-3 py-2.5 text-sm text-ink transition-colors hover:border-line-strong h-11"
        >
          {RADIUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <p className="text-xs text-ink-muted">
          Leave any color blank to use the default TechCore theme. Changes take effect after saving and refreshing the page.
        </p>
      </div>

      <ThemePreview
        brand={themeBrand}
        brandDark={themeBrandDark}
        brandLight={themeBrandLight}
        radius={themeRadius}
      />
    </FormSection>
  );

  return (
    <MutationForm action={updateSettingsAction} submitLabel="Save settings">
      {({ fieldErrors }) => {
        const hasError = (keys: string[]) => keys.some((k) => !!fieldErrors[k]);
        return (
          <Tabs
            tabs={[
              {
                id: "branding",
                label: "Branding",
                panel: brandingTab,
                error: hasError(["companyName", "tagline", "logoType", "logoId", "logoText", "contactEmail", "contactPhone", "address"])
              },
              {
                id: "navigation",
                label: "Navigation",
                panel: navTab,
                error: hasError(["navigationJson", "ctaLabel", "ctaUrl"])
              },
              {
                id: "footer",
                label: "Footer",
                panel: footerTab,
                error: hasError(["footerText", "footerGroupsJson"])
              },
              {
                id: "social",
                label: "Social & SEO",
                panel: socialTab,
                error: hasError(["linkedin", "x", "seoTitle", "seoDescription"])
              },
              {
                id: "theme",
                label: "Theme & Appearance",
                panel: themeTab,
                error: hasError(["themeBrand", "themeBrandDark", "themeBrandLight", "themeRadius"])
              },
            ]}
          />
        );
      }}
    </MutationForm>
  );
}
