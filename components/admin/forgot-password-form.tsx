"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { postJson } from "@/lib/api/client";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand-dark dark:text-brand-bright"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.29" />
          </svg>
        </div>
        <p className="text-sm text-ink dark:text-white">
          If that email is registered, a 6-digit code has been sent. Check your
          inbox and enter the code on the next page.
        </p>
        <Link
          href="/admin/reset-password"
          className="inline-flex w-full items-center justify-center rounded-[var(--radius-md)] bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
        >
          Enter reset code
        </Link>
        <Link
          href="/admin/login"
          className="block text-sm text-ink-muted hover:text-ink dark:text-white/60 dark:hover:text-white"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        setServerError(null);
        const result = await postJson("/api/auth/forgot-password", values);
        if (!result.ok) {
          setServerError(
            result.body.message ?? "Something went wrong. Please try again.",
          );
          return;
        }
        setSent(true);
      })}
    >
      <FormField
        label="Email address"
        htmlFor="fp-email"
        error={errors.email?.message}
      >
        <Input
          id="fp-email"
          type="email"
          autoComplete="username"
          {...register("email")}
        />
      </FormField>
      {serverError ? (
        <p className="text-sm text-danger" role="alert">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send reset code"}
      </Button>
      <div className="text-center">
        <Link
          href="/admin/login"
          className="text-sm text-ink-muted hover:text-ink dark:text-white/60 dark:hover:text-white"
        >
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
