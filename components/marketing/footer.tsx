import Link from "next/link";
import { footerGroups, site, socialLinks } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/marketing/logo";

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <Container width="wide" className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo inverted />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
              {site.tagline}
            </p>
            <p className="mt-6 text-sm text-white/55">{site.address}</p>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <p className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">
                {group.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">
              Contact
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {site.phone}
                </a>
              </li>
            </ul>
            <ul className="mt-6 flex gap-4">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-white/75 hover:text-white"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
