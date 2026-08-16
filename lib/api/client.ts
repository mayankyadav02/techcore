import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

type ApiErrorBody = {
  success: false;
  code?: string;
  message?: string;
  fields?: Record<string, string>;
};

type ApiSuccessBody = {
  success: true;
  data?: unknown;
  message?: string;
};

async function readBody(response: Response) {
  try {
    const payload = (await response.json()) as ApiSuccessBody | ApiErrorBody;
    if (!payload || payload.success !== true) {
      return { ok: false as const, body: payload as ApiErrorBody };
    }
    return { ok: true as const, body: payload };
  } catch {
    return {
      ok: false as const,
      body: {
        success: false as const,
        message: "Could not read the server response.",
      },
    };
  }
}

export async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return readBody(response);
}

export async function postForm(url: string, body: FormData) {
  const response = await fetch(url, { method: "POST", body });
  return readBody(response);
}

export function applyApiErrors<T extends FieldValues>(
  body: ApiErrorBody,
  setError: UseFormSetError<T>,
  setServerError: (message: string) => void,
) {
  if (body.fields) {
    for (const [name, message] of Object.entries(body.fields)) {
      setError(name as Path<T>, { type: "server", message });
    }
  }
  setServerError(body.message ?? "Please check the form and try again.");
}
