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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-surface font-sans text-ink">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
