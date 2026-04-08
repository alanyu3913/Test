export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SessionSummary {
  _id: string;
  subject: string;
  location: string;
  time: string;
  hostName: string;
  userId: string;
  joinedUserIds?: string[];
  isJoined?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  sessionsHosted: number;
  sessionsJoined: number;
  studyStreak: number;
}

export interface DashboardData {
  stats: DashboardStats;
  sessions: SessionSummary[];
}

export interface CreateSessionPayload {
  subject: string;
  location: string;
  time: string;
  hostName: string;
  userId: string;
}

export interface JoinSessionPayload {
  sessionId: string;
  userId: string;
}
