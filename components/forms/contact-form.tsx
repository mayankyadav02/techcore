"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ConsentField, FormField, FormBanner } from "@/components/forms/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { contactSchema, type ContactInput } from "@/lib/content/forms";
import { applyApiErrors, postJson } from "@/lib/api/client";

export function ContactForm({ defaultSubject = "" }: { defaultSubject?: string }) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: defaultSubject,
      message: "",
      website: "",
      gdprConsent: false,
      sourcePage: "/contact",
    },
  });

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        setServerError(null);
        setServerMessage(null);
        const result = await postJson("/api/contact", values);
        if (!result.ok) {
          applyApiErrors(result.body, setError, setServerError);
          return;
        }
        setServerMessage(result.body.message ?? "Your message has been received.");
      })}
    >
      <div className="hidden" aria-hidden="true">
        <input tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <FormField label="Name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoComplete="name" {...register("name")} />
      </FormField>
      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
        </FormField>
        <FormField label="Company" htmlFor="company" error={errors.company?.message}>
          <Input id="company" autoComplete="organization" {...register("company")} />
        </FormField>
      </div>
      <FormField label="Subject" htmlFor="subject" error={errors.subject?.message}>
        <Input id="subject" {...register("subject")} />
      </FormField>
      <FormField label="Message" htmlFor="message" error={errors.message?.message}>
        <Textarea id="message" rows={6} {...register("message")} />
      </FormField>
      <ConsentField htmlFor="gdprConsent" error={errors.gdprConsent?.message}>
        <label htmlFor="gdprConsent" className="flex items-start gap-3 text-sm text-ink-muted">
          <input
            id="gdprConsent"
            type="checkbox"
            className="mt-0.5 size-5 shrink-0"
            aria-invalid={Boolean(errors.gdprConsent) || undefined}
            aria-describedby={errors.gdprConsent ? "gdprConsent-error" : undefined}
            {...register("gdprConsent")}
          />
          I agree that TechCore may use this information to respond to my enquiry.
        </label>
      </ConsentField>
      {serverError ? <FormBanner tone="error">{serverError}</FormBanner> : null}
      {serverMessage ? <FormBanner tone="success">{serverMessage}</FormBanner> : null}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}
