"use server";

import { runAdminAction } from "@/lib/admin/action";
import { parseForm } from "@/lib/admin/parse";
import { formChecked, formString, splitLines } from "@/lib/admin/query";
import {
  industryInputSchema,
  serviceInputSchema,
  solutionInputSchema,
} from "@/modules/catalog/admin.schema";
import {
  createIndustry,
  createService,
  createSolution,
  deleteIndustry,
  deleteService,
  deleteSolution,
  setIndustryStatus,
  setServiceStatus,
  setSolutionStatus,
  updateIndustry,
  updateService,
  updateSolution,
} from "@/modules/catalog/admin.service";

function servicePayload(formData: FormData) {
  return parseForm(serviceInputSchema, {
    title: formString(formData.get("title")),
    slug: formString(formData.get("slug")),
    summary: formString(formData.get("summary")),
    body: formString(formData.get("body")),
    icon: formString(formData.get("icon")),
    highlights: splitLines(formData.get("highlights")),
    features: splitLines(formData.get("features")),
    technologies: splitLines(formData.get("technologies")),
    benefits: splitLines(formData.get("benefits")),
    process: splitLines(formData.get("process")),
    status: formString(formData.get("status")),
    featured: formChecked(formData.get("featured")),
    sortOrder: Number(formString(formData.get("sortOrder")) || "0"),
  });
}

function solutionPayload(formData: FormData) {
  return parseForm(solutionInputSchema, {
    title: formString(formData.get("title")),
    slug: formString(formData.get("slug")),
    summary: formString(formData.get("summary")),
    body: formString(formData.get("body")),
    problem: formString(formData.get("problem")),
    approach: formString(formData.get("approach")),
    outcomes: splitLines(formData.get("outcomes")),
    features: splitLines(formData.get("features")),
    technology: splitLines(formData.get("technology")),
    status: formString(formData.get("status")),
    featured: formChecked(formData.get("featured")),
    sortOrder: Number(formString(formData.get("sortOrder")) || "0"),
  });
}

export async function createServiceAction(formData: FormData) {
  return runAdminAction(async () => {
    const data = await createService(servicePayload(formData));
    return { ok: true as const, message: "Service created.", data };
  });
}

export async function updateServiceAction(id: string, formData: FormData) {
  return runAdminAction(async () => {
    const data = await updateService(id, servicePayload(formData));
    return { ok: true as const, message: "Service saved.", data };
  });
}

export async function publishServiceAction(id: string, publish: boolean) {
  return runAdminAction(async () => {
    await setServiceStatus(id, publish ? "published" : "draft");
    return {
      ok: true as const,
      message: publish ? "Service published." : "Service unpublished.",
    };
  });
}

export async function deleteServiceAction(id: string) {
  return runAdminAction(async () => {
    await deleteService(id);
    return { ok: true as const, message: "Service deleted." };
  });
}

export async function createSolutionAction(formData: FormData) {
  return runAdminAction(async () => {
    const data = await createSolution(solutionPayload(formData));
    return { ok: true as const, message: "Solution created.", data };
  });
}

export async function updateSolutionAction(id: string, formData: FormData) {
  return runAdminAction(async () => {
    const data = await updateSolution(id, solutionPayload(formData));
    return { ok: true as const, message: "Solution saved.", data };
  });
}

export async function publishSolutionAction(id: string, publish: boolean) {
  return runAdminAction(async () => {
    await setSolutionStatus(id, publish ? "published" : "draft");
    return {
      ok: true as const,
      message: publish ? "Solution published." : "Solution unpublished.",
    };
  });
}

export async function deleteSolutionAction(id: string) {
  return runAdminAction(async () => {
    await deleteSolution(id);
    return { ok: true as const, message: "Solution deleted." };
  });
}

function industryPayload(formData: FormData) {
  return parseForm(industryInputSchema, {
    title: formString(formData.get("title")),
    slug: formString(formData.get("slug")),
    summary: formString(formData.get("summary")),
    body: formString(formData.get("body")),
    focus: splitLines(formData.get("focus")),
    status: formString(formData.get("status")),
    featured: formChecked(formData.get("featured")),
    sortOrder: Number(formString(formData.get("sortOrder")) || "0"),
  });
}

export async function createIndustryAction(formData: FormData) {
  return runAdminAction(async () => {
    const data = await createIndustry(industryPayload(formData));
    return { ok: true as const, message: "Industry created.", data };
  });
}

export async function updateIndustryAction(id: string, formData: FormData) {
  return runAdminAction(async () => {
    const data = await updateIndustry(id, industryPayload(formData));
    return { ok: true as const, message: "Industry saved.", data };
  });
}

export async function publishIndustryAction(id: string, publish: boolean) {
  return runAdminAction(async () => {
    await setIndustryStatus(id, publish ? "published" : "draft");
    return {
      ok: true as const,
      message: publish ? "Industry published." : "Industry unpublished.",
    };
  });
}

export async function deleteIndustryAction(id: string) {
  return runAdminAction(async () => {
    await deleteIndustry(id);
    return { ok: true as const, message: "Industry deleted." };
  });
}
