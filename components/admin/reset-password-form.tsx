"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { applyApiErrors, postJson } from "@/lib/api/client";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-constants";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  otp: z
    .string()
    .length(6, "Enter the 6-digit code from your email")
    .regex(/^\d{6}$/, "Enter the 6-digit code from your email"),
  newPassword: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Use at least ${MIN_PASSWORD_LENGTH} characters`,
    )
    .max(200, "Password is too long"),
});

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", otp: "", newPassword: "" },
  });

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        setServerError(null);
        const result = await postJson("/api/auth/reset-password", {
          email: values.email,
          otp: values.otp,
          newPassword: values.newPassword,
        });
        if (!result.ok) {
          applyApiErrors(result.body, setError, setServerError);
          return;
        }
        router.replace(
          "/admin/login?message=" +
            encodeURIComponent(
              "Password reset successfully. Please sign in with your new password.",
            ),
        );
      })}
    >
      <FormField
        label="Email address"
        htmlFor="rp-email"
        error={errors.email?.message}
      >
        <Input
          id="rp-email"
          type="email"
          autoComplete="username"
          {...register("email")}
        />
      </FormField>
      <FormField
        label="6-digit code"
        htmlFor="rp-otp"
        error={errors.otp?.message}
        hint="Check your email for the reset code"
      >
        <Input
          id="rp-otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          {...register("otp")}
        />
      </FormField>
      <FormField
        label="New password"
        htmlFor="rp-password"
        error={errors.newPassword?.message}
        hint={`Minimum ${MIN_PASSWORD_LENGTH} characters`}
      >
        <Input
          id="rp-password"
          type="password"
          autoComplete="new-password"
          {...register("newPassword")}
        />
      </FormField>
      {serverError ? (
        <p className="text-sm text-danger" role="alert">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Resetting…" : "Reset password"}
      </Button>
      <div className="text-center">
        <Link
          href="/admin/forgot-password"
          className="text-sm text-ink-muted hover:text-ink dark:text-white/60 dark:hover:text-white"
        >
          Request a new code
        </Link>
      </div>
    </form>
  );
}
