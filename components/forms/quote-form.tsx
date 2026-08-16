"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  ConsentField,
  FormField,
  FormBanner,
} from "@/components/forms/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import {
  budgetLabels,
  quoteSchema,
  timelineLabels,
  type QuoteInput,
} from "@/lib/content/forms";
import { applyApiErrors, postJson } from "@/lib/api/client";

export function QuoteForm({
  services,
}: {
  services: { slug: string; title: string }[];
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      description: "",
      website: "",
      gdprConsent: false,
      sourcePage: "/quote",
    },
  });

  return (
    <form
      className="relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-elevated p-5 shadow-[var(--shadow-md)] sm:p-7 lg:p-8"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        setServerError(null);
        setServerMessage(null);

        if (fileError) return;

        const result = await postJson("/api/enquiries", values);

        if (!result.ok) {
          applyApiErrors(result.body, setError, setServerError);
          return;
        }

        setServerMessage(
          result.body.message ?? "Your project enquiry has been received.",
        );
      })}
    >
      {/* Subtle premium background detail */}
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-brand/8 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative">
        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        {/* Intro */}
        <div className="mb-8 border-b border-line pb-6">
          <p className="text-xs font-medium tracking-[0.18em] text-brand-dark uppercase">
            Project enquiry
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            Tell us what you want to build.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
            Share a few details about your project. We&apos;ll review the brief
            and get back to you with the right next step.
          </p>
        </div>

        {/* Contact details */}
        <div>
          <p className="mb-4 text-sm font-semibold text-ink">
            Contact details
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Name"
              htmlFor="quote-name"
              error={errors.name?.message}
            >
              <Input
                id="quote-name"
                autoComplete="name"
                {...register("name")}
              />
            </FormField>

            <FormField
              label="Email"
              htmlFor="quote-email"
              error={errors.email?.message}
            >
              <Input
                id="quote-email"
                type="email"
                autoComplete="email"
                {...register("email")}
              />
            </FormField>

            <FormField
              label="Phone"
              htmlFor="quote-phone"
              error={errors.phone?.message}
            >
              <Input
                id="quote-phone"
                type="tel"
                autoComplete="tel"
                {...register("phone")}
              />
            </FormField>

            <FormField
              label="Company"
              htmlFor="quote-company"
              error={errors.company?.message}
            >
              <Input
                id="quote-company"
                autoComplete="organization"
                {...register("company")}
              />
            </FormField>
          </div>
        </div>

        {/* Project scope */}
        <div className="mt-9 border-t border-line pt-8">
          <p className="mb-4 text-sm font-semibold text-ink">
            Project scope
          </p>

          <div className="space-y-5">
            <FormField
              label="Service"
              htmlFor="service"
              error={errors.service?.message}
            >
              <Select id="service" defaultValue="" {...register("service")}>
                <option value="" disabled>
                  Select a service
                </option>

                {services.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.title}
                  </option>
                ))}
              </Select>
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Budget"
                htmlFor="budget"
                error={errors.budget?.message}
              >
                <Select id="budget" defaultValue="" {...register("budget")}>
                  <option value="" disabled>
                    Select a range
                  </option>

                  {Object.entries(budgetLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField
                label="Timeline"
                htmlFor="timeline"
                error={errors.timeline?.message}
              >
                <Select
                  id="timeline"
                  defaultValue=""
                  {...register("timeline")}
                >
                  <option value="" disabled>
                    Select a timeline
                  </option>

                  {Object.entries(timelineLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-9 border-t border-line pt-8">
          <FormField
            label="Project description"
            htmlFor="description"
            error={errors.description?.message}
          >
            <Textarea
              id="description"
              rows={7}
              placeholder="Tell us about the problem, what you want to build, and anything important we should know."
              {...register("description")}
            />
          </FormField>
        </div>

        {/* Attachment */}
        <div className="mt-9 border-t border-line pt-8">
          <FormField
            label="Attachment"
            htmlFor="attachment"
            hint="Optional PDF or document, up to 5 MB. Include essential details in the project description."
            error={fileError ?? undefined}
          >
            <div className="rounded-[var(--radius-md)] border border-dashed border-line bg-surface/60 p-4 transition-colors hover:border-brand/50 hover:bg-brand/5 sm:p-5">
              <Input
                id="attachment"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  setFileError(null);

                  if (!file) {
                    setFileName(null);
                    return;
                  }

                  if (file.size > 5 * 1024 * 1024) {
                    setFileError("Please choose a file under 5 MB.");
                    setFileName(null);
                    event.target.value = "";
                    return;
                  }

                  setFileName(file.name);
                }}
              />

              {fileName ? (
                <p className="mt-3 break-all text-xs font-medium text-brand-dark">
                  Selected: {fileName}
                </p>
              ) : null}
            </div>
          </FormField>
        </div>

        {/* Consent */}
        <div className="mt-8 rounded-[var(--radius-md)] border border-line bg-surface/60 p-4">
          <ConsentField
            htmlFor="quote-consent"
            error={errors.gdprConsent?.message}
          >
            <label
              htmlFor="quote-consent"
              className="flex items-start gap-3 text-sm leading-6 text-ink-muted"
            >
              <input
                id="quote-consent"
                type="checkbox"
                className="mt-1 size-5 shrink-0 accent-[var(--brand)]"
                aria-invalid={Boolean(errors.gdprConsent) || undefined}
                aria-describedby={
                  errors.gdprConsent ? "quote-consent-error" : undefined
                }
                {...register("gdprConsent")}
              />

              <span>
                I agree that TechCore may use this information to respond to my
                enquiry.
              </span>
            </label>
          </ConsentField>
        </div>

        {/* Server feedback */}
        <div className="mt-5 space-y-3">
          {serverError ? (
            <FormBanner tone="error">{serverError}</FormBanner>
          ) : null}

          {serverMessage ? (
            <FormBanner tone="success">{serverMessage}</FormBanner>
          ) : null}
        </div>

        {/* Submit */}
        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-ink-subtle">
            We&apos;ll review your enquiry before getting in touch.
          </p>

          <Button
            type="submit"
            size="lg"
            className="w-full shadow-[var(--shadow-sm)] transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending…" : "Request a quote"}
          </Button>
        </div>
      </div>
    </form>
  );
}