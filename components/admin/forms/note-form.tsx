"use client";

import { MutationForm } from "@/components/admin/mutation-form";
import { FormField } from "@/components/forms/form-field";
import { Textarea } from "@/components/ui/input";
import type { ActionResult } from "@/lib/admin/action";

export function NoteForm({
  action,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
}) {
  return (
    <MutationForm action={action} submitLabel="Add note">
      <FormField label="Internal note" htmlFor="body">
        <Textarea id="body" name="body" rows={4} required />
      </FormField>
    </MutationForm>
  );
}
