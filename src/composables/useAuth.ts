import { ref, computed } from "vue";
import { loginRequest, type User } from "@/services/auth";
import api from "@/services/api";

const user = ref<User | null>(
  localStorage.getItem("auth_user")
    ? JSON.parse(localStorage.getItem("auth_user") as string)
    : null,
);

const isLoading = ref(false);
const error = ref<string | null>(null);

const login = async (email: string, password: string) => {
  isLoading.value = true;
  error.value = null;

  try {
    const { user: apiUser, token } = await loginRequest(email, password);

    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(apiUser));

    user.value = apiUser;
  } catch (err) {
    error.value = "E-mail ou senha inválidos.";
    throw err;
  } finally {
    isLoading.value = false;
  }
};

const logout = async () => {
  try {
    // Revoga o JWT no backend para que o token não possa ser reutilizado
    await api.delete("/users/sign_out");
  } catch {
    // Falha silenciosa: limpa a sessão local mesmo se a chamada falhar
  } finally {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    user.value = null;
  }
};

export function useAuth() {
  return {
    user: computed(() => user.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    login,
    logout,
  };
}
