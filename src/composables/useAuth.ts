import { ref, computed } from "vue";
import { loginRequest, getMeRequest, type User } from "@/services/auth";
import { setCsrfToken } from "@/services/api";
import api from "@/services/api";

const user = ref<User | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const initialize = async (): Promise<void> => {
  isLoading.value = true;
  try {
    const { user: apiUser, csrf_token: token } = await getMeRequest();
    user.value = apiUser;
    setCsrfToken(token);
  } catch {
    user.value = null;
    setCsrfToken(null);
  } finally {
    isLoading.value = false;
  }
};

const login = async (email: string, password: string): Promise<void> => {
  isLoading.value = true;
  error.value = null;

  try {
    const { user: apiUser, csrf_token: token } = await loginRequest(email, password);

    user.value = apiUser;
    setCsrfToken(token);
  } catch (err) {
    error.value = "E-mail ou senha inválidos.";
    throw err;
  } finally {
    isLoading.value = false;
  }
};

const logout = async (): Promise<void> => {
  try {
    await api.delete("/users/sign_out");
  } catch {
    // If the logout request fails (e.g., network error), clear local state
    // anyway so the user is not stuck logged in on the client side.
  } finally {
    clearAuthState();
  }
};

const clearAuthState = (): void => {
  user.value = null;
  setCsrfToken(null);
};

export function useAuth() {
  return {
    user:           computed(() => user.value),
    isLoading:      computed(() => isLoading.value),
    error:          computed(() => error.value),
    initialize,
    login,
    logout,
    clearAuthState,
  };
}
