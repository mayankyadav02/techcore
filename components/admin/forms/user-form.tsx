"use client";

import { FormField } from "@/components/forms/form-field";
import { Input, Select } from "@/components/ui/input";
import { FormSection } from "@/components/admin/form-section";
import { MutationForm } from "@/components/admin/mutation-form";
import { userRoles, userStatuses } from "@/modules/shared/enums";
import type { ActionResult } from "@/lib/admin/action";

type Values = {
  email?: string;
  name?: string;
  password?: string;
  role?: string;
  status?: string;
};

export function UserForm({
  action,
  values,
  submitLabel,
  showPassword = true,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  values?: Values;
  submitLabel: string;
  showPassword?: boolean;
}) {
  return (
    <MutationForm
      action={action}
      submitLabel={submitLabel}
      onSuccessPath={(id) => `/admin/users/${id}`}
    >
      <FormSection title="Details">
        <FormField label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={values?.email}
          />
        </FormField>
        <FormField label="Name" htmlFor="name">
          <Input id="name" name="name" required defaultValue={values?.name} />
        </FormField>
      </FormSection>

      {showPassword && (
        <FormSection title="Password">
          <FormField
            label="Password"
            htmlFor="password"
            hint="Minimum 12 characters"
          >
            <Input
              id="password"
              name="password"
              type="password"
              required={!values}
              autoComplete={values ? "new-password" : "off"}
            />
          </FormField>
        </FormSection>
      )}

      <FormSection title="Permissions">
        <FormField label="Role" htmlFor="role">
          <Select id="role" name="role" required defaultValue={values?.role}>
            <option value="">Select a role</option>
            {userRoles.map((role) => (
              <option key={role} value={role}>
                {role === "super_admin"
                  ? "Super admin"
                  : role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </Select>
        </FormField>
      </FormSection>

      {!showPassword && (
        <FormSection title="Status">
          <FormField label="Status" htmlFor="status">
            <Select id="status" name="status" required defaultValue={values?.status}>
              <option value="">Select a status</option>
              {userStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </Select>
          </FormField>
        </FormSection>
      )}
    </MutationForm>
  );
}
