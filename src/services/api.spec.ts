import { describe, it, expect, vi, beforeEach } from "vitest";

const { currentRoute, push } = vi.hoisted(() => ({
  currentRoute: { value: { name: "home", fullPath: "/" } },
  push: vi.fn(),
}));

vi.mock("@/router", () => ({
  default: { currentRoute, push },
}));

import { onResponseError } from "./api";

function rejection(status: number | undefined, url: string) {
  return {
    config: { url },
    response: status === undefined ? undefined : { status },
  };
}

describe("onResponseError (401 interceptor)", () => {
  beforeEach(() => {
    push.mockClear();
    currentRoute.value = { name: "home", fullPath: "/" };
  });

  it("does NOT redirect on a 401 from the /auth/me session probe", async () => {
    const err = rejection(401, "/auth/me");
    await expect(onResponseError(err)).rejects.toBe(err);
    expect(push).not.toHaveBeenCalled();
  });

  it("redirects to login on a 401 from a real authenticated request", async () => {
    currentRoute.value = { name: "terapeuta", fullPath: "/terapeuta" };
    const err = rejection(401, "/therapists/dashboard");
    await expect(onResponseError(err)).rejects.toBe(err);
    expect(push).toHaveBeenCalledWith({
      name: "login",
      query: { redirect: "/terapeuta" },
    });
  });

  it("does not redirect again when already on the login route", async () => {
    currentRoute.value = { name: "login", fullPath: "/login" };
    await onResponseError(rejection(401, "/clients/dashboard")).catch(() => {});
    expect(push).not.toHaveBeenCalled();
  });

  it("ignores non-401 errors", async () => {
    const err = rejection(422, "/therapists/patients");
    await expect(onResponseError(err)).rejects.toBe(err);
    expect(push).not.toHaveBeenCalled();
  });

  it("rejects (does not swallow) even when it redirects", async () => {
    const err = rejection(401, "/clients/dashboard");
    await expect(onResponseError(err)).rejects.toBe(err);
  });
});
