import { AppError } from "@/lib/errors";
import { handleRouteError, jsonSuccess } from "@/lib/api/http";

export function getHandler<T>(loader: () => Promise<T>) {
  return async () => {
    try {
      const data = await loader();
      return jsonSuccess(data);
    } catch (error) {
      return handleRouteError(error);
    }
  };
}

export function getByParamHandler<T>(
  loader: (value: string) => Promise<T>,
  key: string,
) {
  return async (
    _request: Request,
    context: { params: Promise<Record<string, string>> },
  ) => {
    try {
      const params = await context.params;
      const value = params[key];
      if (!value) {
        throw new AppError("VALIDATION_ERROR", "Invalid identifier.");
      }
      const data = await loader(value);
      return jsonSuccess(data);
    } catch (error) {
      return handleRouteError(error);
    }
  };
}
