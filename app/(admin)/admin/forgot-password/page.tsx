import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ForgotPasswordForm } from "@/components/admin/forgot-password-form";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Forgot Password — TechCore CMS",
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage() {
  const user = await getSession();
  if (user) redirect("/admin/dashboard");

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
        style={{ backgroundImage: "url('/images/hero.png')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-white/45 transition-colors duration-300 dark:bg-navy-950/70"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-white/65 via-white/40 to-white/60 transition-all duration-300 dark:from-navy-950/90 dark:via-navy-950/65 dark:to-navy-950/80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300 dark:opacity-100"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(700px 420px at 50% 20%, rgb(0 200 120 / 0.12), transparent 65%)",
        }}
      />

      <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
        <ThemeToggle invert />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div
          className="
            overflow-hidden rounded-[var(--radius-xl)]
            border border-ink/10 bg-white/80 text-ink
            shadow-[0_24px_80px_rgba(0,0,0,0.15)] backdrop-blur-xl
            transition-all duration-300
            dark:border-white/15 dark:bg-white/[0.08] dark:text-white
            dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)]
          "
        >
          <div className="h-1 bg-brand" aria-hidden="true" />
          <div className="p-6 sm:p-9">
            <div className="flex justify-center">
              <img
                src="/logo.light.png"
                alt="TechCore"
                className="h-10 w-auto object-contain dark:hidden"
              />
              <img
                src="/logo.dark.png"
                alt="TechCore"
                className="hidden h-10 w-auto object-contain dark:block"
              />
            </div>
            <div className="mt-8 mb-8 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-dark dark:text-brand-bright">
                TechCore CMS
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink transition-colors duration-300 dark:text-white">
                Forgot password?
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ink-muted transition-colors duration-300 dark:text-white/60">
                Enter your email address and we will send you a verification
                code to reset your password.
              </p>
            </div>
            <Suspense>
              <ForgotPasswordForm />
            </Suspense>
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-ink-muted transition-colors duration-300 dark:text-white/40">
          Secure staff access · TechCore
        </p>
      </div>
    </main>
  );
}
