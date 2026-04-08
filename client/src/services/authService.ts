import type {
  AuthUser,
  CreateSessionPayload,
  DashboardData,
  SessionSummary,
} from "../types/auth";

const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

const AUTH_API_BASE_URL = normalizeBaseUrl(
  env.VITE_AUTH_API_BASE_URL || "https://largeproj.msilvacop4331.site/api",
);

const SESSION_API_BASE_URL = normalizeBaseUrl(
  env.VITE_SESSION_API_BASE_URL || `${window.location.origin}/api`,
);

const SESSION_API_BASE_URLS = Array.from(
  new Set([SESSION_API_BASE_URL, AUTH_API_BASE_URL]),
);

interface LoginResponse {
  token: string;
  user: AuthUser;
}

const parseApiResponse = async <T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> => {
  const contentType = response.headers.get("content-type") ?? "";
  const body = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error(fallbackMessage);
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new Error(fallbackMessage);
  }
};

const fetchSessionJsonWithFallback = async <T>(
  path: string,
  init: RequestInit,
  fallbackMessage: string,
  requestFailedMessage: string,
): Promise<T> => {
  let lastError: Error | null = null;

  for (const baseUrl of SESSION_API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}${path}`, init);
      const data = await parseApiResponse<T & { message?: string }>(
        response,
        fallbackMessage,
      );

      if (!response.ok) {
        throw new Error(
          (data as { message?: string }).message || requestFailedMessage,
        );
      }

      return data;
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error(requestFailedMessage);
    }
  }

  throw lastError || new Error(requestFailedMessage);
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${AUTH_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseApiResponse<{ token: string; user: AuthUser; message?: string }>(
    response,
    "The server returned an unexpected response while signing in.",
  );

  if (!response.ok) {
    if (response.status === 403 && data.message?.includes("verify")) {
      throw new Error("VERIFICATION_REQUIRED");
    }

    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const response = await fetch(`${AUTH_API_BASE_URL}/auth/verify/${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await parseApiResponse<{ message?: string }>(
    response,
    "The server returned an unexpected response while verifying your email.",
  );

  if (!response.ok) {
    throw new Error(data.message || "Verification failed");
  }

  return data as { message: string };
};

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<{ message: string }> => {
  const response = await fetch(`${AUTH_API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  const data = await parseApiResponse<{ message?: string }>(
    response,
    "The server returned an unexpected response while creating your account.",
  );

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data as { message: string };
};

export const getDashboardData = async (userId: string): Promise<DashboardData> => {
  return fetchSessionJsonWithFallback<DashboardData>(
    `/sessions/user/${userId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
    "Dashboard data is temporarily unavailable. Please try again in a moment.",
    "Could not load dashboard",
  );
};

export const createSession = async (
  payload: CreateSessionPayload,
): Promise<{ message: string; session: SessionSummary }> => {
  return fetchSessionJsonWithFallback<{ message: string; session: SessionSummary }>(
    "/sessions/create",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
    "The server returned an unexpected response while creating the session.",
    "Could not create session",
  );
};
