
import Link from "next/link";
import { footerGroups, publicCta } from "@/lib/site";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/marketing/logo";
import { ButtonLink } from "@/components/ui/button-link";
import type { PublicCompany } from "@/modules/content/public.service";

export function Footer({ company }: { company: PublicCompany }) {
  return (
    <footer
      className="
        relative overflow-hidden
        bg-surface text-ink
        transition-colors duration-300
        dark:bg-navy-950 dark:text-white
      "
    >
      {/* ───────────────── Ambient brand glows ───────────────── */}

      {/* Light mode glow */}
      <div
        className="
          pointer-events-none absolute
          -top-40 right-[-10%]
          h-96 w-96
          rounded-full
          bg-brand/10
          blur-3xl
          dark:hidden
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none absolute
          bottom-[-12rem] left-[-8%]
          h-80 w-80
          rounded-full
          bg-brand/5
          blur-3xl
          dark:hidden
        "
        aria-hidden="true"
      />

      {/* Dark mode glow */}
      <div
        className="
          pointer-events-none absolute
          -top-40 right-[-10%]
          hidden h-96 w-96
          rounded-full
          bg-brand/10
          blur-3xl
          dark:block
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none absolute
          bottom-[-12rem] left-[-8%]
          hidden h-80 w-80
          rounded-full
          bg-teal-400/5
          blur-3xl
          dark:block
        "
        aria-hidden="true"
      />

      <Container
        width="wide"
        className="relative py-12 sm:py-16 lg:py-20"
      >
        {/* ───────────────── Top CTA / Brand ───────────────── */}

        <div
          className="
            relative overflow-hidden
            rounded-[var(--radius-xl)]
            border border-line
            bg-elevated/80
            p-6

            shadow-[var(--shadow-md)]
            backdrop-blur-sm

            transition-colors duration-300

            sm:p-8
            lg:p-10

            dark:border-white/10
            dark:bg-white/[0.035]
            dark:shadow-[0_20px_70px_rgb(0_0_0_/_0.18)]
          "
        >
          {/* Subtle grid — light */}
          <div
            className="
              pointer-events-none absolute inset-0
              opacity-[0.035]
              dark:hidden
            "
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgb(7 17 31 / 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgb(7 17 31 / 0.35) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Subtle grid — dark */}
          <div
            className="
              pointer-events-none absolute inset-0
              hidden opacity-[0.035]
              dark:block
            "
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div
            className="
              relative flex flex-col gap-8
              lg:flex-row lg:items-center lg:justify-between
            "
          >
            <div className="min-w-0 max-w-2xl">
              {/* Light mode logo */}
              <div className="dark:hidden">
                <Logo
                  inverted={false}
                  name={company.name}
                  size="lg"
                />
              </div>

              {/* Dark mode logo */}
              <div className="hidden dark:block">
                <Logo
                  inverted
                  name={company.name}
                  size="lg"
                />
              </div>

              <p
                className="
                  mt-5 max-w-xl
                  text-sm leading-7
                  text-ink-muted
                  sm:text-base
                  dark:text-white/65
                "
              >
                {company.tagline}
              </p>

              {company.footerText ? (
                <p
                  className="
                    mt-3 max-w-xl
                    text-sm leading-6
                    text-ink-subtle
                    dark:text-white/45
                  "
                >
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

        <div
          className="
            mt-14 grid gap-10
            border-b border-line
            pb-12

            sm:grid-cols-2
            lg:mt-16 lg:grid-cols-6

            dark:border-white/10
          "
        >
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p
                className="
                  text-[0.68rem]
                  font-semibold
                  tracking-[0.18em]
                  text-brand-dark
                  uppercase

                  dark:text-brand-bright
                "
              >
                {group.title}
              </p>

              <ul className="mt-4 space-y-1">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="
                        group
                        inline-flex
                        min-h-10
                        items-center

                        text-sm
                        text-ink-muted

                        transition-all
                        duration-200

                        hover:translate-x-1
                        hover:text-ink

                        dark:text-white/60
                        dark:hover:text-white
                      "
                    >
                      <span
                        className="
                          mr-0
                          max-w-0
                          overflow-hidden
                          text-brand
                          transition-all
                          duration-200

                          group-hover:mr-2
                          group-hover:max-w-3
                        "
                        aria-hidden="true"
                      >
                        →
                      </span>

                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ───────────────── Contact ───────────────── */}

          <div>
            <p
              className="
                text-[0.68rem]
                font-semibold
                tracking-[0.18em]
                text-brand-dark
                uppercase

                dark:text-brand-bright
              "
            >
              Contact
            </p>

            <ul className="mt-4 space-y-1">
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="
                    inline-flex
                    min-h-10
                    max-w-full
                    break-all
                    items-center

                    text-sm
                    text-ink-muted

                    transition-colors
                    hover:text-ink

                    dark:text-white/60
                    dark:hover:text-white
                  "
                >
                  {company.email}
                </a>
              </li>

              <li>
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="
                    inline-flex
                    min-h-10
                    items-center

                    text-sm
                    text-ink-muted

                    transition-colors
                    hover:text-ink

                    dark:text-white/60
                    dark:hover:text-white
                  "
                >
                  {company.phone}
                </a>
              </li>

              <li
                className="
                  max-w-xs
                  py-2
                  text-sm
                  leading-6
                  text-ink-subtle

                  dark:text-white/40
                "
              >
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
                      className="
                        inline-flex
                        min-h-9
                        items-center
                        rounded-full

                        border border-line
                        bg-surface-muted
                        px-3

                        text-xs
                        font-medium
                        text-ink-muted

                        transition-all
                        duration-200

                        hover:-translate-y-0.5
                        hover:border-brand/40
                        hover:bg-brand/10
                        hover:text-brand-dark

                        dark:border-white/10
                        dark:bg-white/[0.035]
                        dark:text-white/55
                        dark:hover:text-brand-bright
                      "
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

        <div
          className="
            flex flex-col gap-4
            pt-6

            text-xs
            text-ink-subtle

            sm:flex-row
            sm:items-center
            sm:justify-between

            dark:text-white/40
          "
        >
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="
                inline-flex
                min-h-10
                items-center
                transition-colors

                hover:text-ink

                dark:hover:text-white
              "
            >
              Privacy
            </Link>

            <span
              className="
                h-3 w-px
                bg-line

                dark:bg-white/10
              "
              aria-hidden="true"
            />

            <Link
              href="/terms"
              className="
                inline-flex
                min-h-10
                items-center
                transition-colors

                hover:text-ink

                dark:hover:text-white
              "
            >
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

