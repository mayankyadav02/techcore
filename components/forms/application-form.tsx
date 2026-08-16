"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ConsentField, FormField, FormBanner } from "@/components/forms/form-field";
import { Input, Textarea } from "@/components/ui/input";
import {
  applicationSchema,
  type ApplicationInput,
} from "@/lib/content/forms";
import { applyApiErrors, postForm } from "@/lib/api/client";

export function ApplicationForm({ jobId }: { jobId: string }) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      coverLetter: "",
      website: "",
      gdprConsent: false,
    },
  });

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        setServerError(null);
        setServerMessage(null);
        const body = new FormData();
        body.set("name", values.name);
        body.set("email", values.email);
        body.set("phone", values.phone ?? "");
        body.set("coverLetter", values.coverLetter);
        body.set("website", values.website ?? "");
        body.set("gdprConsent", values.gdprConsent ? "true" : "false");
        const result = await postForm(`/api/jobs/${jobId}/apply`, body);
        if (!result.ok) {
          applyApiErrors(result.body, setError, setServerError);
          return;
        }
        setServerMessage(
          result.body.message ??
            "Your application has been received. Only the form fields are stored — file uploads are not accepted yet.",
        );
      })}
    >
      <div className="hidden" aria-hidden="true">
        <input tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <FormField label="Name" htmlFor="app-name" error={errors.name?.message}>
        <Input id="app-name" autoComplete="name" {...register("name")} />
      </FormField>
      <FormField label="Email" htmlFor="app-email" error={errors.email?.message}>
        <Input id="app-email" type="email" {...register("email")} />
      </FormField>
      <FormField label="Phone" htmlFor="app-phone" error={errors.phone?.message}>
        <Input id="app-phone" type="tel" {...register("phone")} />
      </FormField>
      <FormField
        label="Cover note"
        htmlFor="coverLetter"
        error={errors.coverLetter?.message}
      >
        <Textarea id="coverLetter" rows={6} {...register("coverLetter")} />
      </FormField>
      <p className="text-xs text-ink-subtle">
        Resume files are not stored. Include relevant experience in the cover note.
      </p>
      <ConsentField htmlFor="app-consent" error={errors.gdprConsent?.message}>
        <label htmlFor="app-consent" className="flex items-start gap-3 text-sm text-ink-muted">
          <input
            id="app-consent"
            type="checkbox"
            className="mt-0.5 size-5 shrink-0"
            aria-invalid={Boolean(errors.gdprConsent) || undefined}
            aria-describedby={errors.gdprConsent ? "app-consent-error" : undefined}
            {...register("gdprConsent")}
          />
          I agree that TechCore may process this application.
        </label>
      </ConsentField>
      {serverError ? <FormBanner tone="error">{serverError}</FormBanner> : null}
      {serverMessage ? <FormBanner tone="success">{serverMessage}</FormBanner> : null}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Submit application"}
      </Button>
    </form>
  );
}
