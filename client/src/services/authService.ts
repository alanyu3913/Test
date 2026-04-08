import type {
  AuthUser,
  CreateSessionPayload,
  DashboardData,
  JoinSessionPayload,
  SessionSummary,
} from "../types/auth";

<<<<<<< HEAD
const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, "");

const AUTH_API_BASE_URL = normalizeBaseUrl(
  env.VITE_AUTH_API_BASE_URL || "https://largeproj.msilvacop4331.site/api",
);

const SESSION_API_BASE_URL = normalizeBaseUrl(
  env.VITE_SESSION_API_BASE_URL || `${window.location.origin}/api`,
);

=======
const API_BASE_URL = "https://largeproj.msilvacop4331.site/api";

// Define what the server's response looks like for TypeScript
>>>>>>> parent of b8b49c8 (Update authService.ts)
interface LoginResponse {
  token: string;
  user: AuthUser;
}

<<<<<<< HEAD
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

=======
>>>>>>> parent of b8b49c8 (Update authService.ts)
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const API_URL = `${API_BASE_URL}/auth/login`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    // Check if the server sent a specific message about verification
    if (response.status === 403 && errorData.message.includes("verify")) {
        throw new Error("VERIFICATION_REQUIRED");
    }

    throw new Error(errorData.message || "Login failed");
  }

  return response.json();
};

export const verifyEmail = async (token: string): Promise<{ message: string }> => {
    const API_URL = `${API_BASE_URL}/auth/verify/${token}`;

    const response = await fetch(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed");
    }

    return response.json();
};

export const registerUser = async (firstName: string, lastName: string, email: string, password: string): Promise<{ message: string }> => {
  const API_URL = `${API_BASE_URL}/auth/register`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const getDashboardData = async (userId: string): Promise<DashboardData> => {
<<<<<<< HEAD
  const response = await fetch(`${SESSION_API_BASE_URL}/sessions/user/${userId}`, {
=======
  const response = await fetch(`${API_BASE_URL}/sessions/user/${userId}`, {
>>>>>>> parent of b8b49c8 (Update authService.ts)
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

<<<<<<< HEAD
  const data = await parseApiResponse<DashboardData & { message?: string }>(
    response,
    "Dashboard data is temporarily unavailable. Please try again in a moment.",
  );
=======
  const data = await response.json();
>>>>>>> parent of b8b49c8 (Update authService.ts)

  if (!response.ok) {
    throw new Error(data.message || "Could not load dashboard");
  }

  return data;
};

export const createSession = async (
  payload: CreateSessionPayload,
): Promise<{ message: string; session: SessionSummary }> => {
<<<<<<< HEAD
  const response = await fetch(`${SESSION_API_BASE_URL}/sessions/create`, {
=======
  const response = await fetch(`${API_BASE_URL}/sessions/create`, {
>>>>>>> parent of b8b49c8 (Update authService.ts)
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

<<<<<<< HEAD
  const data = await parseApiResponse<{ message: string; session: SessionSummary }>(
    response,
    "The server returned an unexpected response while creating the session.",
  );
=======
  const data = await response.json();
>>>>>>> parent of b8b49c8 (Update authService.ts)

  if (!response.ok) {
    throw new Error(data.message || "Could not create session");
  }

  return data;
<<<<<<< HEAD
};

export const getAvailableSessions = async (userId: string): Promise<SessionSummary[]> => {
  const response = await fetch(`${SESSION_API_BASE_URL}/sessions/available/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await parseApiResponse<{ sessions: SessionSummary[]; message?: string }>(
    response,
    "Available sessions are temporarily unavailable. Please try again in a moment.",
  );

  if (!response.ok) {
    throw new Error(data.message || "Could not load available sessions");
  }

  return data.sessions;
};

export const joinSession = async (
  payload: JoinSessionPayload,
): Promise<{ message: string; session: SessionSummary }> => {
  const response = await fetch(`${SESSION_API_BASE_URL}/sessions/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseApiResponse<{ message: string; session: SessionSummary }>(
    response,
    "The server returned an unexpected response while joining the session.",
  );

  if (!response.ok) {
    throw new Error(data.message || "Could not join session");
  }

  return data;
=======
>>>>>>> parent of b8b49c8 (Update authService.ts)
};
