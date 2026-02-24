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
  token: string;
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

export async function loginRequest(
  email: string,
  password: string,
): Promise<LoginResult> {
  const response = await api.post("/users/sign_in", {
    user: { email, password },
  });

  const authHeader = response.headers["authorization"] as string | undefined;
  if (!authHeader) {
    throw new Error("Authorization header not found");
  }

  const token = authHeader.split(" ")[1];

  return {
    token,
    user: response.data.user as User,
  };
}
