"use client";

import { MutationForm } from "@/components/admin/mutation-form";
import { Select } from "@/components/ui/input";
import { nextApplicationStatuses, nextEnquiryStatuses } from "@/lib/status-flow";
import type { ActionResult } from "@/lib/admin/action";
import {
  type ApplicationStatus,
  type EnquiryStatus,
} from "@/modules/shared/enums";

function StatusForm({
  action,
  current,
  options,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  current: string;
  options: readonly string[];
}) {
  return (
    <MutationForm
      action={action}
      submitLabel="Update status"
      className="flex flex-wrap items-end gap-3"
    >
      <Select name="status" defaultValue={current} className="w-48">
        {options.map((status) => (
          <option key={status} value={status}>
            {status.replaceAll("_", " ")}
          </option>
        ))}
      </Select>
    </MutationForm>
  );
}

export function ApplicationStatusForm({
  action,
  current,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  current: string;
}) {
  return (
    <StatusForm
      action={action}
      current={current}
      options={nextApplicationStatuses(current as ApplicationStatus)}
    />
  );
}

export function EnquiryStatusForm({
  action,
  current,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  current: string;
}) {
  return (
    <StatusForm
      action={action}
      current={current}
      options={nextEnquiryStatuses(current as EnquiryStatus)}
    />
  );
}
