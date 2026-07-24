<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      @click.self="closeModal"
    >
      <div class="bg-card rounded-2xl shadow-lg w-full max-w-sm p-6">
        <h2 class="font-display text-lg text-foreground mb-1">
          Trocar senha
        </h2>
        <p class="font-body text-sm text-muted-foreground mb-5">
          Confirme sua senha atual e defina uma nova.
        </p>

        <form
          class="space-y-4"
          @submit.prevent="handleSubmit"
        >
          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground">Senha atual</label>
            <input
              v-model="currentPassword"
              type="password"
              class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              required
            >
          </div>

          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground">Nova senha</label>
            <input
              v-model="newPassword"
              type="password"
              placeholder="Mínimo 6 caracteres"
              class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              required
            >
          </div>

          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground">Confirme a nova senha</label>
            <input
              v-model="confirmPassword"
              type="password"
              class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              required
            >
          </div>

          <p
            v-if="error"
            class="text-sm text-destructive font-body text-center bg-destructive/10 rounded-lg py-2 px-3"
          >
            {{ error }}
          </p>

          <div class="flex gap-3 pt-1">
            <button
              type="button"
              class="flex-1 py-2.5 rounded-lg border border-border/60 font-body text-sm font-medium hover:bg-muted transition"
              @click="closeModal"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {{ isLoading ? "Salvando..." : "Trocar senha" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { changePasswordRequest } from "@/services/auth";
import { useAuth } from "@/composables/useAuth";

defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ (e: "close"): void }>();

const router = useRouter();
const { clearAuthState } = useAuth();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const error = ref("");
const isLoading = ref(false);

function reset() {
  currentPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  error.value = "";
}

function closeModal() {
  if (isLoading.value) return;
  reset();
  emit("close");
}

async function handleSubmit() {
  error.value = "";

  if (newPassword.value !== confirmPassword.value) {
    error.value = "As senhas não coincidem.";
    return;
  }
  if (newPassword.value.length < 6) {
    error.value = "A senha deve ter pelo menos 6 caracteres.";
    return;
  }

  isLoading.value = true;
  try {
    await changePasswordRequest(
      currentPassword.value,
      newPassword.value,
      confirmPassword.value,
    );
    // O backend revoga o JWT e limpa o cookie (sessão morre)
    clearAuthState();
    router.push({ name: "login" });
  } catch (e: any) {
    error.value =
      e?.response?.data?.error ?? "Erro ao trocar a senha. Tente novamente.";
  } finally {
    isLoading.value = false;
  }
}
</script>
