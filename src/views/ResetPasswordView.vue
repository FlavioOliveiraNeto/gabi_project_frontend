<template>
  <div class="min-h-screen bg-lavender-light flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-card border border-border/50 rounded-2xl p-8 shadow-sm space-y-5">
        <!-- Token ausente -->
        <div v-if="!token" class="text-center space-y-4">
          <p class="font-display text-lg text-foreground">Link inválido</p>
          <p class="font-body text-sm text-muted-foreground">
            O link de recuperação está incompleto ou expirado.
          </p>
          <router-link
            to="/login"
            class="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 transition"
          >
            Voltar ao login
          </router-link>
        </div>

        <!-- Formulário de nova senha -->
        <template v-else-if="!success">
          <div>
            <h2 class="font-display text-2xl text-primary text-center">Redefinir senha</h2>
            <p class="font-body text-sm text-muted-foreground text-center mt-1">
              Crie uma nova senha para sua conta
            </p>
          </div>

          <form @submit.prevent="handleReset" class="space-y-4">
            <div class="space-y-1.5">
              <label class="font-body text-sm font-medium text-foreground">Nova senha</label>
              <input
                v-model="newPassword"
                type="password"
                placeholder="Mínimo 6 caracteres"
                class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                required
              />
            </div>

            <div class="space-y-1.5">
              <label class="font-body text-sm font-medium text-foreground">Confirme a nova senha</label>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="Repita a senha"
                class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                required
              />
            </div>

            <p
              v-if="error"
              class="text-sm text-destructive font-body text-center bg-destructive/10 rounded-lg py-2 px-3"
            >
              {{ error }}
            </p>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {{ isLoading ? "Salvando..." : "Definir nova senha" }}
            </button>
          </form>
        </template>

        <!-- Confirmação de sucesso -->
        <div v-else class="text-center space-y-4">
          <div class="flex justify-center">
            <div class="p-3 rounded-full bg-green-100">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p class="font-display text-lg text-foreground">Senha redefinida!</p>
          <p class="font-body text-sm text-muted-foreground">
            Sua senha foi alterada com sucesso. Faça login com a nova senha.
          </p>
          <p class="font-body text-xs text-muted-foreground">
            Redirecionando em {{ countdown }}s...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { confirmPasswordReset } from "@/services/auth";

const route = useRoute();
const router = useRouter();

const token = route.query.token as string | undefined;

const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");
const success = ref(false);
const isLoading = ref(false);
const countdown = ref(3);

let countdownInterval: ReturnType<typeof setInterval> | null = null;

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval);
});

const handleReset = async () => {
  error.value = "";

  if (newPassword.value !== confirmPassword.value) {
    error.value = "As senhas não coincidem.";
    return;
  }

  if (newPassword.value.length < 6) {
    error.value = "A senha deve ter pelo menos 6 caracteres.";
    return;
  }

  if (!token) return;

  isLoading.value = true;
  try {
    await confirmPasswordReset(token, newPassword.value, confirmPassword.value);
    success.value = true;

    countdownInterval = setInterval(() => {
      countdown.value -= 1;
      if (countdown.value <= 0) {
        clearInterval(countdownInterval!);
        router.push({ name: "login" });
      }
    }, 1000);
  } catch (e: any) {
    const msgs = e?.response?.data?.errors;
    if (Array.isArray(msgs)) {
      error.value = msgs.join(", ");
    } else {
      error.value = "Link de recuperação inválido ou expirado. Solicite um novo.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
