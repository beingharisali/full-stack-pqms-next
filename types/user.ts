export type UserRole = "admin" | "doctor" | "receptionist";
export interface User {
  id: string;
  firstname: string;
  lastname: string,
  password: string,
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}
export interface AuthResponse {
  user: User;
  token: string;
}
