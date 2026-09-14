import { FormField } from "@/components/forms/form-field";
import { Input, Textarea } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import { updateLegalPageAction } from "@/modules/content/actions";

export function LegalPageForm({ values }: { values: any }) {
  const { key, content = "" } = values || {};
  return (
    <MutationForm action={updateLegalPageAction} submitLabel="Save Content">
      <FormSection title={`Legal Page: /${key}`}>
        <input type="hidden" name="key" value={key} />
        <FormField label="Content" htmlFor={`content-${key}`}>
          <Textarea id={`content-${key}`} name="content" rows={10} defaultValue={content} />
        </FormField>
      </FormSection>
    </MutationForm>
  );
}
