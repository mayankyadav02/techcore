"use server";

import { runAdminAction } from "@/lib/admin/action";
import { parseForm } from "@/lib/admin/parse";
import { formString, splitLines } from "@/lib/admin/query";
import { jobInputSchema } from "@/modules/careers/admin.schema";
import { applicationNoteSchema, applicationStatusSchema } from "@/modules/careers/application-admin.schema";
import {
  addApplicationNote,
  createJob,
  deleteApplication,
  deleteJob,
  setApplicationStatus,
  setJobActive,
  updateJob,
} from "@/modules/careers/admin.service";

function payload(formData: FormData) {
  return parseForm(jobInputSchema, {
    title: formString(formData.get("title")),
    slug: formString(formData.get("slug")),
    department: formString(formData.get("department")),
    location: formString(formData.get("location")),
    employmentType: formString(formData.get("employmentType")),
    experience: formString(formData.get("experience")),
    description: formString(formData.get("description")),
    requirements: formString(formData.get("requirements")),
    benefits: formString(formData.get("benefits")),
    responsibilities: splitLines(formData.get("responsibilities")),
    skills: splitLines(formData.get("skills")),
    status: formString(formData.get("status")),
  });
}

export async function createJobAction(formData: FormData) {
  return runAdminAction(async () => {
    const data = await createJob(payload(formData));
    return { ok: true as const, message: "Role created.", data };
  });
}

export async function updateJobAction(id: string, formData: FormData) {
  return runAdminAction(async () => {
    const data = await updateJob(id, payload(formData));
    return { ok: true as const, message: "Role saved.", data };
  });
}

export async function setJobActiveAction(id: string, active: boolean) {
  return runAdminAction(async () => {
    await setJobActive(id, active);
    return {
      ok: true as const,
      message: active ? "Role is open." : "Role closed.",
    };
  });
}

export async function deleteJobAction(id: string) {
  return runAdminAction(async () => {
    await deleteJob(id);
    return { ok: true as const, message: "Role deleted." };
  });
}

export async function setApplicationStatusAction(id: string, formData: FormData) {
  return runAdminAction(async () => {
    await setApplicationStatus(
      id,
      parseForm(applicationStatusSchema, {
        status: formString(formData.get("status")),
      }),
    );
    return { ok: true as const, message: "Application status updated." };
  });
}

export async function addApplicationNoteAction(id: string, formData: FormData) {
  return runAdminAction(async () => {
    await addApplicationNote(
      id,
      parseForm(applicationNoteSchema, {
        body: formString(formData.get("body")),
      }),
    );
    return { ok: true as const, message: "Note added." };
  });
}

export async function deleteApplicationAction(id: string) {
  return runAdminAction(async () => {
    await deleteApplication(id);
    return { ok: true as const, message: "Application deleted." };
  });
}
