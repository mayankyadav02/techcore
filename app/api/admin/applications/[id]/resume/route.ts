import { handleRouteError } from "@/lib/api/http";
import { requirePermission } from "@/lib/auth";
import { connectMongo } from "@/lib/db";
import { Application } from "@/modules/careers/application.model";
import { parseObjectId } from "@/lib/api/ids";
import { AppError } from "@/lib/errors";
import { get } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission("leads:read");
    await connectMongo();

    const { id } = await context.params;
    const appId = parseObjectId(id);

    const application = await Application.findOne({
      _id: appId,
      deletedAt: null,
    })
      .populate("resumeAssetId")
      .lean();

    if (!application) {
      throw new AppError("NOT_FOUND", "Application not found.");
    }

    if (!application.resumeAssetId) {
      throw new AppError("NOT_FOUND", "No resume attached to this application.");
    }

    const media = application.resumeAssetId as any;

    if (!media || !media.url) {
      throw new AppError("NOT_FOUND", "Resume media record is missing or corrupted.");
    }

    if (media.url.includes("test.public.blob.vercel-storage.com")) {
      return Response.redirect(media.url, 302);
    }

    const result = await get(media.url, {
      access: media.access === "private" ? "private" : "public",
    });

    if (!result) {
      throw new AppError("NOT_FOUND", "Resume file not found in storage.");
    }

    const headers = new Headers();
    headers.set(
      "Content-Type",
      result.blob.contentType || media.mimeType || "application/octet-stream"
    );
    headers.set(
      "Content-Disposition",
      `attachment; filename="${media.filename || "resume"}"`
    );
    headers.set(
      "Cache-Control",
      "private, no-store, max-age=0, must-revalidate"
    );

    return new Response(result.stream, {
      status: 200,
      headers,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
