"use server";

import { runAdminAction } from "@/lib/admin/action";
import { parseForm } from "@/lib/admin/parse";
import { formChecked, formString, splitLines } from "@/lib/admin/query";
import { projectInputSchema } from "@/modules/catalog/admin.schema";
import {
  createProject,
  deleteProject,
  setProjectStatus,
  toggleProjectFeatured,
  updateProject,
} from "@/modules/work/admin.service";

function payload(formData: FormData) {
  const yearValue = formString(formData.get("year"));
  return parseForm(projectInputSchema, {
    title: formString(formData.get("title")),
    slug: formString(formData.get("slug")),
    clientName: formString(formData.get("clientName")) || "Confidential",
    sector: formString(formData.get("sector")),
    summary: formString(formData.get("summary")),
    overview: formString(formData.get("overview")),
    challenge: formString(formData.get("challenge")),
    solution: formString(formData.get("solution")),
    results: splitLines(formData.get("results")),
    features: splitLines(formData.get("features")),
    technology: splitLines(formData.get("technology")),
    heroImageUrl: formString(formData.get("heroImageUrl")),
    galleryUrls: splitLines(formData.get("galleryUrls"), 12),
    year: yearValue ? Number(yearValue) : undefined,
    status: formString(formData.get("status")),
    featured: formChecked(formData.get("featured")),
    sortOrder: Number(formString(formData.get("sortOrder")) || "0"),
  });
}

export async function createProjectAction(formData: FormData) {
  return runAdminAction(async () => {
    const data = await createProject(payload(formData));
    return { ok: true as const, message: "Project created.", data };
  });
}

export async function updateProjectAction(id: string, formData: FormData) {
  return runAdminAction(async () => {
    const data = await updateProject(id, payload(formData));
    return { ok: true as const, message: "Project saved.", data };
  });
}

export async function toggleProjectFeaturedAction(id: string) {
  return runAdminAction(async () => {
    const data = await toggleProjectFeatured(id);
    return {
      ok: true as const,
      message: data.featured ? "Marked featured." : "Featured removed.",
      data,
    };
  });
}

export async function publishProjectAction(id: string, publish: boolean) {
  return runAdminAction(async () => {
    await setProjectStatus(id, publish ? "published" : "draft");
    return {
      ok: true as const,
      message: publish ? "Project published." : "Project unpublished.",
    };
  });
}

export async function deleteProjectAction(id: string) {
  return runAdminAction(async () => {
    await deleteProject(id);
    return { ok: true as const, message: "Project deleted." };
  });
}
