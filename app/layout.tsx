import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { siteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { themeScript } from "@/lib/theme";
import { getPublicCompany } from "@/modules/content/public.service";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-family",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading-family",
  weight: ["600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const company = await getPublicCompany();
  const defaultTitle = company.seoTitle || `${site.name} — ${site.tagline.replace(/\.$/, "")}`;
  const description = company.description || site.description;
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${company.name}`,
    },
    description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const company = await getPublicCompany();
  const t = company.theme;

  let customThemeCss = "";
  if (t?.brand && /^#[0-9A-Fa-f]{6}$/.test(t.brand)) customThemeCss += `--brand: ${t.brand};\n`;
  if (t?.brandDark && /^#[0-9A-Fa-f]{6}$/.test(t.brandDark)) customThemeCss += `--brand-deep: ${t.brandDark};\n`;
  if (t?.brandLight && /^#[0-9A-Fa-f]{6}$/.test(t.brandLight)) customThemeCss += `--brand-bright: ${t.brandLight};\n`;

  if (t?.brand || t?.brandDark || t?.brandLight) {
    customThemeCss += `--tc-gradient: linear-gradient(135deg, var(--brand), var(--brand-bright));\n`;
  }

  if (t?.radius) {
    if (t.radius === "none") {
      customThemeCss += `--radius-sm: 0px;\n--radius-md: 0px;\n--radius-lg: 0px;\n--radius-xl: 0px;\n`;
    } else if (t.radius === "sm") {
      customThemeCss += `--radius-sm: 4px;\n--radius-md: 6px;\n--radius-lg: 8px;\n--radius-xl: 12px;\n`;
    } else if (t.radius === "md") {
      customThemeCss += `--radius-sm: 8px;\n--radius-md: 12px;\n--radius-lg: 16px;\n--radius-xl: 20px;\n`;
    } else if (t.radius === "lg") {
      customThemeCss += `--radius-sm: 12px;\n--radius-md: 16px;\n--radius-lg: 24px;\n--radius-xl: 32px;\n`;
    }
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {customThemeCss && (
          <style dangerouslySetInnerHTML={{ __html: `:root { \n${customThemeCss} }` }} />
        )}
      </head>
      <body className="min-h-full bg-surface font-sans text-ink">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
