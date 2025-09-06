// backend/src/models/mysql/User.ts
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  is_active: boolean;
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
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
