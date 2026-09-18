import { handleRouteError, jsonSuccess } from "@/lib/api/http";
import { opaqueRecordId } from "@/lib/api/ids";
import {
  assertSameOrigin,
  clientKey,
  parseSchema,
  readFormData,
} from "@/lib/api/request";
import { enforceRateLimit } from "@/lib/rate-limit";
import { applicationApiSchema } from "@/modules/leads/schema";
import { createApplication } from "@/modules/careers/application.service";
import { put, del } from "@vercel/blob";
import { uploadPublicResumeMedia } from "@/modules/media/admin.service";
import { ALLOWED_RESUME_TYPES, MAX_RESUME_SIZE, validateResumeContent } from "@/lib/file-validation";
import { AppError } from "@/lib/errors";


export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit("apply", clientKey(request));
    const { id } = await context.params;
    const form = await readFormData(request);
    const consent = form.get("gdprConsent");
    const input = parseSchema(applicationApiSchema, {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      coverLetter: String(form.get("coverLetter") ?? ""),
      website: String(form.get("website") ?? ""),
      gdprConsent: consent === "true" || consent === "on",
    });

    if (input.website) {
      return jsonSuccess(
        { id: opaqueRecordId() },
        "Thank you. Your application has been received.",
        201,
      );
    }


    const resume = form.get("resume") as File | null;
    let resumeAssetId: string | undefined = undefined;
    let blobUrl: string | undefined = undefined;

    if (resume) {
      if (!ALLOWED_RESUME_TYPES.includes(resume.type)) {
        throw new AppError("VALIDATION_ERROR", "Resume must be a PDF, DOC, or DOCX file.");
      }
      if (resume.size > MAX_RESUME_SIZE) {
        throw new AppError("VALIDATION_ERROR", "Resume must be 4MB or smaller.");
      }
      const buffer = Buffer.from(await resume.arrayBuffer());
      const isValid = await validateResumeContent(buffer);
      if (!isValid) {
        throw new AppError("VALIDATION_ERROR", "Invalid resume file content.");
      }

      const ext = resume.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '') || "bin";
      const uniqueName = `resumes/${crypto.randomUUID()}.${ext}`;

      if (process.env.NODE_ENV === "test" || process.env.BLOB_READ_WRITE_TOKEN === "test-token") {
        blobUrl = `https://test.public.blob.vercel-storage.com/${uniqueName}`;
      } else {
        const blob = await put(uniqueName, buffer, {
          access: 'public',
          contentType: resume.type,
          addRandomSuffix: false,
        });
        blobUrl = blob.url;
      }

      try {
        const media = await uploadPublicResumeMedia({
          filename: resume.name,
          url: blobUrl,
          mimeType: resume.type,
          sizeBytes: resume.size,
        });
        resumeAssetId = media.id;
      } catch (e) {
        if (blobUrl && process.env.BLOB_READ_WRITE_TOKEN !== "test-token") {
          await del(blobUrl).catch(() => {});
        }
        throw new AppError("INTERNAL_ERROR", "Failed to save resume media record.");
      }
    }

    let data;
    try {
      data = await createApplication(id, input, resumeAssetId);
    } catch (error) {
      if (resumeAssetId) {
        try {
          const { Media } = await import("@/modules/media/media.model");
          await Media.findByIdAndDelete(resumeAssetId).catch(() => {});
        } catch {}
      }
      if (blobUrl && process.env.BLOB_READ_WRITE_TOKEN !== "test-token") {
        await del(blobUrl).catch(() => {});
      }
      throw error;
    }

    return jsonSuccess(
      data,
      "Thank you. Your application has been received.",
      201,
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

