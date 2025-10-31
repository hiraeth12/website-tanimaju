// backend/src/models/mysql/User.ts
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  status?: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  session_key?: string | null;
  session_expired_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  token?: string;
  sessionKey?: string;
  sessionExpiresAt?: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
