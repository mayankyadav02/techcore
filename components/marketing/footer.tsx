import Link from "next/link";
import { footerGroups, publicCta } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/marketing/logo";
import { ButtonLink } from "@/components/ui/button-link";
import type { PublicCompany } from "@/modules/content/public.service";

export function Footer({ company }: { company: PublicCompany }) {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      {/* Ambient brand glow */}
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-brand/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-12rem] left-[-8%] h-80 w-80 rounded-full bg-teal-400/5 blur-3xl"
        aria-hidden="true"
      />

      <Container width="wide" className="relative py-12 sm:py-16 lg:py-20">
        {/* ───────────────── Top CTA / Brand ───────────────── */}
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_70px_rgb(0_0_0_/_0.18)] backdrop-blur-sm sm:p-8 lg:p-10">
          {/* subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <Logo inverted name={company.name} size="lg" />

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                {company.tagline}
              </p>

              {company.footerText ? (
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                  {company.footerText}
                </p>
              ) : null}
            </div>

            <div className="shrink-0">
              <ButtonLink
                href={publicCta.href}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                {publicCta.label}
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* ───────────────── Footer Navigation ───────────────── */}
        <div className="mt-14 grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-6">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-brand-bright uppercase">
                {group.title}
              </p>

              <ul className="mt-4 space-y-1">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="group inline-flex min-h-10 items-center text-sm text-white/60 transition-all duration-200 hover:translate-x-1 hover:text-white"
                    >
                      <span className="mr-0 max-w-0 overflow-hidden text-brand transition-all duration-200 group-hover:mr-2 group-hover:max-w-3">
                        →
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-brand-bright uppercase">
              Contact
            </p>

            <ul className="mt-4 space-y-1">
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex min-h-10 max-w-full break-all items-center text-sm text-white/60 transition-colors hover:text-white"
                >
                  {company.email}
                </a>
              </li>

              <li>
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="inline-flex min-h-10 items-center text-sm text-white/60 transition-colors hover:text-white"
                >
                  {company.phone}
                </a>
              </li>

              <li className="max-w-xs py-2 text-sm leading-6 text-white/40">
                {company.address}
              </li>
            </ul>

            {/* Social links */}
            {company.social.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {company.social.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      rel="noreferrer"
                      target="_blank"
                      className="inline-flex min-h-9 items-center rounded-full border border-white/10 bg-white/[0.035] px-3 text-xs font-medium text-white/55 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand/10 hover:text-brand-bright"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {/* ───────────────── Bottom Bar ───────────────── */}
        <div className="flex flex-col gap-4 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="inline-flex min-h-10 items-center transition-colors hover:text-white"
            >
              Privacy
            </Link>

            <span
              className="h-3 w-px bg-white/10"
              aria-hidden="true"
            />

            <Link
              href="/terms"
              className="inline-flex min-h-10 items-center transition-colors hover:text-white"
            >
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}