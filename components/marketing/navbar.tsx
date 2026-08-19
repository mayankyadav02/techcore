"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

import { desktopNav, publicCta } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button-link";
import { Logo } from "@/components/marketing/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

function navActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Home page is the only page where the navbar stays transparent
  // at the very top because it sits over the hero section.
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close mobile navigation whenever route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock page scrolling while mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  // Escape closes the mobile navigation.
  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  /*
   * Only the Home page uses the transparent/inverted navbar at the top.
   *
   * Other pages:
   * - Light mode: light navbar from the beginning
   * - Dark mode: dark navbar from the beginning
   *
   * Home page:
   * - Top: transparent
   * - After scroll: glass navbar
   */
  const transparentAtTop = false;

  return (
    <>
      <header
className={cn(
  "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",

  // HOME — top par hero ke saath merged
  isHome &&
    !scrolled &&
    "border-transparent bg-transparent shadow-none backdrop-blur-0",

  // HOME — scroll ke baad separate navbar
  isHome &&
    scrolled &&
    "border-line/70 bg-elevated/88 shadow-[var(--shadow-sm)] backdrop-blur-xl",

  // OTHER PAGES — light mode mein starting se normal navbar
  !isHome &&
    "border-line/70 bg-elevated/88 shadow-[var(--shadow-sm)] backdrop-blur-xl",

  // DARK MODE — HOME top
  isHome &&
    !scrolled &&
    "dark:border-transparent dark:bg-transparent dark:shadow-none dark:backdrop-blur-0",

  // DARK MODE — HOME scroll
  isHome &&
    scrolled &&
    "dark:border-white/10 dark:bg-navy-950/82 dark:shadow-[var(--shadow-md)] dark:backdrop-blur-xl",

  // DARK MODE — OTHER PAGES
  !isHome &&
    "dark:border-white/10 dark:bg-navy-950/82 dark:shadow-[var(--shadow-md)] dark:backdrop-blur-xl",
)}>
        <div
          className={cn(
            "relative mx-auto flex h-[var(--header-height)] max-w-[80rem] min-w-0 items-center px-4 sm:px-6 lg:px-8",
            mobileOpen && "relative z-[70]",
          )}
        >
          {/* Logo */}
          <div className="shrink-0">
            {/* Light mode logo */}
            <Logo
              inverted={false}
              className={cn(
                "min-w-0 transition-transform duration-200 hover:scale-[1.025] motion-reduce:hover:scale-100",
                "block dark:hidden",
              )}
              priority
              size="md"
            />

            {/* Dark / transparent hero logo */}
            <Logo
              inverted
              className={cn(
                "min-w-0 transition-transform duration-200 hover:scale-[1.025] motion-reduce:hover:scale-100",
                "hidden dark:block",
              )}
              priority
              size="md"
            />
          </div>

          {/* Desktop navigation */}
          <nav
            aria-label="Primary"
            className="
              absolute top-1/2 left-1/2
              hidden
              -translate-x-1/2
              -translate-y-1/2
              items-center
              gap-3
              lg:flex
              xl:gap-5
            "
          >
            {desktopNav.map((item) => {
              const active = navActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    `
                      relative
                      text-[0.78rem]
                      font-medium
                      whitespace-nowrap
                      transition-colors

                      after:absolute
                      after:right-0
                      after:-bottom-1
                      after:left-0
                      after:h-px
                      after:origin-left
                      after:bg-brand
                      after:transition-transform
                      after:duration-200

                      xl:text-[0.8125rem]
                    `,

                    active
                      ? "text-ink after:scale-x-100 dark:text-white"
                      : "text-ink-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100 dark:text-white/70 dark:hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="ml-auto hidden items-center gap-2 lg:flex">
            {/* Light mode toggle */}
            <div
              className={cn(
                transparentAtTop ? "hidden" : "block dark:hidden",
              )}
            >
              <ThemeToggle invert={false} />
            </div>

            {/* Dark / transparent hero toggle */}
            <div
              className={cn(
                transparentAtTop ? "block" : "hidden dark:block",
              )}
            >
              <ThemeToggle invert />
            </div>

            <ButtonLink
              href={publicCta.href}
              variant="secondary"
              size="sm"
              className="group"
            >
              <span>{publicCta.label}</span>

              <ArrowRight
                size={15}
                strokeWidth={1.8}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </ButtonLink>
          </div>

          {/* Mobile actions */}
          <div className="ml-auto flex items-center gap-1.5 lg:hidden">
            {/* Light mode toggle */}
            <div
              className={cn(
                transparentAtTop ? "hidden" : "block dark:hidden",
              )}
            >
              <ThemeToggle invert={false} />
            </div>

            {/* Dark / transparent hero toggle */}
            <div
              className={cn(
                transparentAtTop ? "block" : "hidden dark:block",
              )}
            >
              <ThemeToggle invert />
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label={
                mobileOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((current) => !current)}
              className={cn(
                `
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  transition-colors
                  duration-200

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-brand
                  focus-visible:ring-offset-2

                  motion-reduce:transition-none
                `,
                transparentAtTop
                  ? "text-white hover:text-brand-bright"
                  : "text-ink hover:text-brand-dark dark:text-white dark:hover:text-brand-bright",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={
                      reduce
                        ? false
                        : {
                            opacity: 0,
                            rotate: -45,
                            scale: 0.8,
                          }
                    }
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: 45,
                      scale: 0.8,
                    }}
                    transition={{ duration: 0.16 }}
                    className="flex"
                  >
                    <X
                      size={22}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={
                      reduce
                        ? false
                        : {
                            opacity: 0,
                            rotate: 45,
                            scale: 0.8,
                          }
                    }
                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      rotate: -45,
                      scale: 0.8,
                    }}
                    transition={{ duration: 0.16 }}
                    className="flex"
                  >
                    <Menu
                      size={22}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileOpen ? (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close navigation"
              className="
                fixed
                inset-0
                z-[55]
                bg-navy-950/55
                backdrop-blur-sm
                lg:hidden
              "
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="
                fixed
                inset-x-3
                top-[calc(var(--header-height)+0.5rem)]
                z-[60]
                overflow-hidden
                rounded-[1.5rem]
                border
                border-line
                bg-elevated/95
                shadow-[var(--shadow-md)]
                backdrop-blur-2xl
                lg:hidden

                dark:border-white/10
                dark:bg-navy-900/95
              "
              initial={
                reduce
                  ? false
                  : {
                      opacity: 0,
                      y: -12,
                      scale: 0.98,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={
                reduce
                  ? undefined
                  : {
                      opacity: 0,
                      y: -8,
                      scale: 0.985,
                    }
              }
              transition={{
                duration: reduce ? 0 : 0.22,
                ease: "easeOut",
              }}
            >
              {/* Small brand accent */}
              <div
                className="
                  h-px
                  w-full
                  bg-gradient-to-r
                  from-transparent
                  via-brand
                  to-transparent
                "
                aria-hidden="true"
              />

              <nav className="p-3" aria-label="Mobile primary">
                <ul className="space-y-1">
                  {desktopNav.map((item, index) => {
                    const active = navActive(pathname, item.href);

                    return (
                      <motion.li
                        key={item.href}
                        initial={
                          reduce
                            ? false
                            : {
                                opacity: 0,
                                x: -8,
                              }
                        }
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          duration: 0.18,
                          delay: reduce ? 0 : index * 0.025,
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            `
                              relative
                              flex
                              min-h-12
                              items-center
                              rounded-xl
                              px-4
                              text-sm
                              font-medium
                              transition-all
                              duration-200
                            `,

                            active
                              ? "bg-brand/10 text-brand-dark dark:text-brand-bright"
                              : "text-ink-muted hover:bg-brand/5 hover:text-ink dark:text-white/65 dark:hover:text-white",
                          )}
                        >
                          {active ? (
                            <span
                              className="
                                absolute
                                left-0
                                h-6
                                w-0.5
                                rounded-full
                                bg-brand
                              "
                              aria-hidden="true"
                            />
                          ) : null}

                          <span>{item.label}</span>

                          {active ? (
                            <span
                              className="
                                ml-auto
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-brand
                                shadow-[0_0_10px_rgb(0_200_120_/_0.65)]
                              "
                              aria-hidden="true"
                            />
                          ) : null}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                <div className="mt-3 border-t border-line pt-3 dark:border-white/10">
                  <ButtonLink
                    href={publicCta.href}
                    variant="primary"
                    size="lg"
                    className="group w-full justify-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{publicCta.label}</span>

                    <ArrowRight
                      size={16}
                      strokeWidth={1.8}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </ButtonLink>
                </div>
              </nav>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}