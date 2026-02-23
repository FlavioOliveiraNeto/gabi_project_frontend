<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">Trocar senha</h2>
      <form @submit.prevent="handleChangePassword">
        <div class="mb-4">
          <label class="block mb-1">Nova senha</label>
          <input
            v-model="newPassword"
            type="password"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Confirme a nova senha</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Trocar senha
        </button>
        <div v-if="error" class="text-red-600 mt-2 text-center">
          {{ error }}
        </div>
        <div v-if="success" class="text-green-600 mt-2 text-center">
          Senha alterada com sucesso!
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();
const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");
const success = ref(false);

const handleChangePassword = async () => {
  error.value = "";
  success.value = false;
  if (newPassword.value !== confirmPassword.value) {
    error.value = "As senhas não coincidem.";
    return;
  }
  try {
    await api.put("/users/change_password", {
      password: newPassword.value,
      password_confirmation: confirmPassword.value,
    });
    success.value = true;
    setTimeout(() => {
      router.push("/paciente");
    }, 1500);
  } catch (e) {
    error.value = "Erro ao trocar a senha.";
  }
};
</script>
