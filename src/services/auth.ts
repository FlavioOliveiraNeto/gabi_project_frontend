import api from "./api";

export type Role = "therapist" | "client";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  must_change_password?: boolean;
}

export interface LoginResult {
  user: User;
  csrf_token: string;
}

export interface MeResult {
  user: User;
  csrf_token: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export async function registerRequest(params: RegisterParams): Promise<void> {
  await api.post("/users", { user: params });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await api.post("/users/password", { user: { email } });
}

export async function confirmPasswordReset(
  token: string,
  password: string,
  passwordConfirmation: string,
): Promise<void> {
  await api.put("/users/password", {
    user: {
      reset_password_token: token,
      password,
      password_confirmation: passwordConfirmation,
    },
  });
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<LoginResult> {
  const response = await api.post<{ user: User; csrf_token: string }>(
    "/users/sign_in",
    { user: { email, password } },
  );

  return {
    user:       response.data.user,
    csrf_token: response.data.csrf_token,
  };
}

export async function getMeRequest(): Promise<MeResult> {
  const response = await api.get<{ user: User; csrf_token: string }>("/auth/me");
  return {
    user:       response.data.user,
    csrf_token: response.data.csrf_token,
  };
}
