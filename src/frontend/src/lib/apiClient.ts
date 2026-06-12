import { notifySessionExpired } from "../features/auth/auth.events";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3333/api/v1";

type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: unknown;
};

type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiMeta = {
  page?: number;
  limit?: number;
  total?: number;
};

export type PaginatedResult<T> = {
  data: T[];
  meta?: ApiMeta;
};

function shouldNotifySessionExpired(status: number, token?: string) {
  return status === 401 && Boolean(token);
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { role?: string; token?: string } = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  if (options.role) {
    headers.set("x-user-role", options.role);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccess<T>
    | ApiFailure
    | null;

  if (!response.ok || !payload?.success) {
    const error = payload && !payload.success ? payload.error : undefined;
    if (shouldNotifySessionExpired(response.status, options.token)) {
      notifySessionExpired();
    }

    throw new ApiClientError(
      error?.message ?? "Falha na comunicação com o servidor.",
      response.status,
      error?.code,
      error?.details,
    );
  }

  return payload.data;
}

export async function apiRequestWithMeta<T>(
  path: string,
  options: RequestInit & { role?: string; token?: string } = {},
): Promise<{ data: T; meta?: ApiMeta }> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  if (options.role) {
    headers.set("x-user-role", options.role);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return { data: undefined as T };
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccess<T>
    | ApiFailure
    | null;

  if (!response.ok || !payload?.success) {
    const error = payload && !payload.success ? payload.error : undefined;
    if (shouldNotifySessionExpired(response.status, options.token)) {
      notifySessionExpired();
    }

    throw new ApiClientError(
      error?.message ?? "Falha na comunicação com o servidor.",
      response.status,
      error?.code,
      error?.details,
    );
  }

  return {
    data: payload.data,
    meta: payload.meta as ApiMeta | undefined,
  };
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  options: { role?: string; token?: string } = {},
): Promise<T> {
  const headers = new Headers();

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  if (options.role) {
    headers.set("x-user-role", options.role);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiSuccess<T>
    | ApiFailure
    | null;

  if (!response.ok || !payload?.success) {
    const error = payload && !payload.success ? payload.error : undefined;
    if (shouldNotifySessionExpired(response.status, options.token)) {
      notifySessionExpired();
    }

    throw new ApiClientError(
      error?.message ?? "Falha na comunicação com o servidor.",
      response.status,
      error?.code,
      error?.details,
    );
  }

  return payload.data;
}
