<template>
  <div class="page active">
    <div class="container">
      <div class="card auth-card">
        <div class="form-group">
          <label>Endereço de Email</label>
          <input v-model="email" type="email" />
        </div>

        <div class="form-group">
          <label>Senha</label>
          <input v-model="password" type="password" />
        </div>

        <button
          class="btn btn-primary"
          style="width: 100%"
          :disabled="loading"
          @click="login"
        >
          {{ loading ? "Entrando..." : "Entrar" }}
        </button>

        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginRequest, type User } from "../services/auth";

const email = ref<string>("");
const password = ref<string>("");
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const router = useRouter();

async function login(): Promise<void> {
  error.value = null;
  loading.value = true;

  try {
    const { token, user } = await loginRequest(email.value, password.value);

    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));

    redirectByRole(user);
  } catch (err: any) {
    error.value = err?.response?.data?.error ?? "Email ou senha inválidos";
  } finally {
    loading.value = false;
  }
}

function redirectByRole(user: User): void {
  if (user.role === "admin") {
    router.push("/terapeuta");
  } else {
    router.push("/paciente");
  }
}
</script>
