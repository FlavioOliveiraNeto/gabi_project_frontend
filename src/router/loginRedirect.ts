import type { RouteLocationRaw } from "vue-router";
import type { User } from "@/services/auth";

export function resolveLoginRedirect(
  user: User | null,
  redirect?: string,
): RouteLocationRaw {
  if (user?.must_change_password && user.role === "client") {
    return { name: "change-password" };
  }

  if (redirect) {
    return redirect;
  }

  return user?.role === "therapist"
    ? { name: "terapeuta" }
    : { name: "paciente" };
}
