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
  const response = await fetch(`${SESSION_API_BASE_URL}/sessions/user/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await parseApiResponse<DashboardData & { message?: string }>(
    response,
    "Dashboard data is temporarily unavailable. Please try again in a moment.",
  );

  if (!response.ok) {
    throw new Error(data.message || "Could not load dashboard");
  }

  return data;
};

export const createSession = async (
  payload: CreateSessionPayload,
): Promise<{ message: string; session: SessionSummary }> => {
  const response = await fetch(`${SESSION_API_BASE_URL}/sessions/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseApiResponse<{ message: string; session: SessionSummary }>(
    response,
    "The server returned an unexpected response while creating the session.",
  );

  if (!response.ok) {
    throw new Error(data.message || "Could not create session");
  }

  return data;
};
