import { FormField } from "@/components/forms/form-field";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import { updateLegalPageAction } from "@/modules/content/actions";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { type LegalPageInput } from "@/modules/content/legal-page.schema";

type NullablePartial<T> = { [P in keyof T]?: T[P] | null };

export function LegalPageForm({ values }: { values?: NullablePartial<LegalPageInput> }) {
  const { key, content } = values || {};
  return (
    <MutationForm action={updateLegalPageAction} submitLabel="Save Content">
      <FormSection title={`Legal Page: /${key}`}>
        <input type="hidden" name="key" value={String(key ?? "")} />
        <FormField label="Content" htmlFor={`content-${key}`}>
          <RichTextEditor name="content" defaultValue={String(content ?? "")} />
        </FormField>
      </FormSection>
    </MutationForm>
  );
}
