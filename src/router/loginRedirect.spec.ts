import { describe, it, expect } from "vitest";
import { resolveLoginRedirect } from "./loginRedirect";
import type { User } from "@/services/auth";

const therapist: User = {
  id: 1,
  name: "Gabi",
  email: "g@x.com",
  role: "therapist",
};
const client: User = { id: 2, name: "Ana", email: "a@x.com", role: "client" };

describe("resolveLoginRedirect", () => {
  it("sends a therapist to the therapist dashboard", () => {
    expect(resolveLoginRedirect(therapist)).toEqual({ name: "terapeuta" });
  });

  it("sends a client to the patient dashboard", () => {
    expect(resolveLoginRedirect(client)).toEqual({ name: "paciente" });
  });

  it("forces a client with must_change_password to change-password", () => {
    const u = { ...client, must_change_password: true };
    expect(resolveLoginRedirect(u)).toEqual({ name: "change-password" });
  });

  it("does NOT force a therapist to change-password (client-only rule)", () => {
    const u = { ...therapist, must_change_password: true };
    expect(resolveLoginRedirect(u)).toEqual({ name: "terapeuta" });
  });

  it("honors an explicit redirect query for a normal login", () => {
    expect(resolveLoginRedirect(therapist, "/terapeuta/pacientes/5")).toBe(
      "/terapeuta/pacientes/5",
    );
  });

  it("forces change-password even when a redirect is present", () => {
    const u = { ...client, must_change_password: true };
    expect(resolveLoginRedirect(u, "/paciente")).toEqual({
      name: "change-password",
    });
  });

  it("falls back to the patient dashboard when user is null", () => {
    expect(resolveLoginRedirect(null)).toEqual({ name: "paciente" });
  });
});
