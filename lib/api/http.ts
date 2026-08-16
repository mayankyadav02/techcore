import { AppError, isAppError, type AppErrorCode } from "@/lib/errors";

export type SuccessBody<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ErrorBody = {
  success: false;
  code: AppErrorCode | "VALIDATION_ERROR";
  message: string;
  fields?: Record<string, string>;
};

export function jsonSuccess<T>(data: T, message?: string, status = 200) {
  const body: SuccessBody<T> = { success: true, data };
  if (message) body.message = message;
  return Response.json(body, { status });
}

export function jsonError(
  code: AppErrorCode,
  message: string,
  status: number,
  fields?: Record<string, string>,
) {
  const body: ErrorBody = { success: false, code, message };
  if (fields) body.fields = fields;
  return Response.json(body, { status });
}

export function handleRouteError(error: unknown) {
  if (isAppError(error)) {
    return jsonError(error.code, error.message, error.status, error.fields);
  }

  console.error(
    JSON.stringify({
      level: "error",
      code: "INTERNAL_ERROR",
      name: error instanceof Error ? error.name : "Error",
    }),
  );

  return jsonError(
    "INTERNAL_ERROR",
    "Something went wrong. Please try again.",
    500,
  );
}

export function validationError(fields: Record<string, string>) {
  return new AppError("VALIDATION_ERROR", "Please check the form and try again.", {
    fields,
  });
}
