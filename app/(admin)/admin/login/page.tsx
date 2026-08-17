
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Logo } from "@/components/marketing/logo";
import { LoginForm } from "@/components/admin/login-form";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { getSession } from "@/lib/auth";
import { safeCallbackUrl } from "@/lib/auth-constants";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const user = await getSession();
  const { callbackUrl } = await searchParams;

  if (user) {
    redirect(safeCallbackUrl(callbackUrl));
  }

  return (
    <main
      className="
        relative isolate flex min-h-dvh items-center justify-center
        overflow-hidden
        bg-surface px-4 py-8
        text-ink
        transition-colors duration-300
        sm:px-6 sm:py-12
        dark:bg-navy-950
        dark:text-white
      "
    >
      {/* Hero background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero.png')",
        }}
        aria-hidden="true"
      />

      {/* Theme-aware overlay */}
      <div
        className="
          absolute inset-0
          bg-white/45
          transition-colors duration-300
          dark:bg-navy-950/70
        "
        aria-hidden="true"
      />

      {/* Readability gradient */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-br
          from-white/65
          via-white/40
          to-white/60
          transition-all duration-300
          dark:from-navy-950/90
          dark:via-navy-950/65
          dark:to-navy-950/80
        "
        aria-hidden="true"
      />

      {/* Subtle emerald glow */}
      <div
        className="
          pointer-events-none absolute inset-0
          opacity-70
          transition-opacity duration-300
          dark:opacity-100
        "
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(700px 420px at 50% 20%, rgb(0 200 120 / 0.12), transparent 65%)",
        }}
      />

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
        <ThemeToggle invert />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="
            overflow-hidden
            rounded-[var(--radius-xl)]

            border border-ink/10
            bg-white/80
            text-ink
            shadow-[0_24px_80px_rgba(0,0,0,0.15)]
            backdrop-blur-xl

            transition-all duration-300

            dark:border-white/15
            dark:bg-white/[0.08]
            dark:text-white
            dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)]
          "
        >
          {/* Top accent */}
          <div
            className="h-1 bg-brand"
            aria-hidden="true"
          />

          <div className="p-6 sm:p-9">
            {/* Logo */}
            {/* <div className="flex justify-center">
              <Logo inverted size="md" />
            </div> */}
            
<div className="flex justify-center">
  {/* Light Mode Logo */}
  <img
    src="/logo.light.png"
    alt="TechCore"
    className="
      h-10 w-auto object-contain
      dark:hidden
    "
  />

  {/* Dark Mode Logo */}
  <img
    src="/logo.dark.png"
    alt="TechCore"
    className="
      hidden h-10 w-auto object-contain
      dark:block
    "
  />
</div>


            

            {/* Heading */}
            <div className="mt-8 text-center">
              <p
                className="
                  text-xs font-medium uppercase
                  tracking-[0.18em]
                  text-brand-dark
                  dark:text-brand-bright
                "
              >
                TechCore CMS
              </p>

              <h1
                className="
                  mt-3
                  text-2xl font-semibold tracking-tight
                  text-ink
                  transition-colors duration-300
                  dark:text-white
                "
              >
                Sign in to the CMS
              </h1>

              <p
                className="
                  mx-auto mt-3 max-w-sm
                  text-sm leading-6
                  text-ink-muted
                  transition-colors duration-300
                  dark:text-white/60
                "
              >
                Staff access only. Sign in to manage TechCore content and
                operations.
              </p>
            </div>

            {/* Login form */}
            <div className="mt-8">
              <Suspense>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p
          className="
            mt-5 text-center text-xs
            text-ink-muted
            transition-colors duration-300
            dark:text-white/40
          "
        >
          Secure staff access · TechCore
        </p>
      </div>
    </main>
  );
}

