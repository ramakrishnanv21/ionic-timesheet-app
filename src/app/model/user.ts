export interface User {
  _id: string;
  username: string;
  email: string;
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user'
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  role?: Role;
}

export interface SignupResponse {
  success: boolean;
  message: string;
}

export interface UserResponse {
  status: 'success' | 'failed',
  message: string;
  user: User
}