"use client";

import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import type { ActionResult } from "@/lib/admin/action";

export function PasswordResetForm({
  action,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  return (
    <MutationForm
      action={action}
      submitLabel="Reset password"
      className="max-w-2xl"
    >
      <FormSection title="Reset Password">
        <FormField
          label="New Password"
          htmlFor="password"
          hint="Minimum 12 characters"
        >
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
          />
        </FormField>
      </FormSection>
    </MutationForm>
  );
}
