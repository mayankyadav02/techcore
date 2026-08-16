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
    <main className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-navy-950 px-4 py-8 sm:px-6 sm:py-12">
      {/* Hero background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero.png')",
        }}
        aria-hidden="true"
      />

      {/* Premium dark overlay */}
      <div
        className="absolute inset-0 bg-navy-950/70"
        aria-hidden="true"
      />

      {/* Readability gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-navy-950/90 via-navy-950/65 to-navy-950/80"
        aria-hidden="true"
      />

      {/* Subtle emerald glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(700px 420px at 50% 20%, rgb(0 200 120 / 0.12), transparent 65%)",
        }}
      />

      {/* Theme */}
      <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
        <ThemeToggle invert />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-white/15 bg-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {/* Top accent */}
          <div
            className="h-1 bg-brand"
            aria-hidden="true"
          />

          <div className="p-6 sm:p-9">
            <div className="flex justify-center">
              <Logo inverted size="md" />
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs font-medium tracking-[0.18em] text-brand-bright uppercase">
                TechCore CMS
              </p>

              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Sign in to the CMS
              </h1>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/60">
                Staff access only. Sign in to manage TechCore content and
                operations.
              </p>
            </div>

            <div className="mt-8">
              <Suspense>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-white/40">
          Secure staff access · TechCore
        </p>
      </div>
    </main>
  );
}