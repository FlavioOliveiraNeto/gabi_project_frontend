<template>
  <div
    class="min-h-screen bg-lavender-light flex items-center justify-center px-4 py-12"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <LogoComponent class="mx-auto mb-4" />
        <h1 class="font-display text-2xl text-primary">Criar conta</h1>
        <p class="font-body text-sm text-muted-foreground mt-1">
          Preencha os dados abaixo para se cadastrar
        </p>
      </div>

      <div class="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground">
              Nome completo
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Seu nome completo"
              autocomplete="name"
              class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              :class="{ 'border-destructive': errors.name }"
            />
            <p v-if="errors.name" class="text-xs text-destructive font-body">
              {{ errors.name }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground">
              E-mail
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="seu@email.com"
              autocomplete="email"
              class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              :class="{ 'border-destructive': errors.email }"
            />
            <p v-if="errors.email" class="text-xs text-destructive font-body">
              {{ errors.email }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground">
              Telefone
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="(00) 00000-0000"
              autocomplete="tel"
              class="w-full px-4 py-2.5 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
              :class="{ 'border-destructive': errors.phone }"
            />
            <p v-if="errors.phone" class="text-xs text-destructive font-body">
              {{ errors.phone }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground">
              Senha
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Mínimo 6 caracteres"
                autocomplete="new-password"
                class="w-full px-4 py-2.5 pr-10 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                :class="{ 'border-destructive': errors.password }"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                tabindex="-1"
              >
                <Eye v-if="!showPassword" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <p
              v-if="errors.password"
              class="text-xs text-destructive font-body"
            >
              {{ errors.password }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="font-body text-sm font-medium text-foreground">
              Confirmar senha
            </label>
            <div class="relative">
              <input
                v-model="form.password_confirmation"
                :type="showPasswordConfirm ? 'text' : 'password'"
                placeholder="Repita a senha"
                autocomplete="new-password"
                class="w-full px-4 py-2.5 pr-10 border border-border/60 rounded-lg text-sm font-body bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                :class="{ 'border-destructive': errors.password_confirmation }"
              />
              <button
                type="button"
                @click="showPasswordConfirm = !showPasswordConfirm"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                tabindex="-1"
              >
                <Eye v-if="!showPasswordConfirm" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <p
              v-if="errors.password_confirmation"
              class="text-xs text-destructive font-body"
            >
              {{ errors.password_confirmation }}
            </p>
          </div>

          <p
            v-if="globalError"
            class="text-sm text-destructive font-body text-center bg-destructive/10 rounded-lg py-2 px-3"
          >
            {{ globalError }}
          </p>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span v-if="isLoading">Criando conta...</span>
            <span v-else>Criar conta</span>
          </button>
        </form>

        <p class="text-center mt-6 font-body text-sm text-muted-foreground">
          Já tem uma conta?
          <RouterLink
            to="/login"
            class="text-primary font-medium hover:underline"
          >
            Entrar
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff } from "lucide-vue-next";
import { RouterLink } from "vue-router";
import LogoComponent from "@/components/LogoComponent.vue";
import { registerRequest } from "@/services/auth";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { login } = useAuth();

const form = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
});

const errors = reactive<Record<string, string>>({});
const globalError = ref("");
const isLoading = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k]);

  if (!form.name.trim()) errors.name = "Nome é obrigatório.";
  if (!form.email.trim()) errors.email = "E-mail é obrigatório.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "E-mail inválido.";
  if (!form.phone.trim()) errors.phone = "Telefone é obrigatório.";
  if (!form.password) errors.password = "Senha é obrigatória.";
  else if (form.password.length < 6)
    errors.password = "A senha deve ter pelo menos 6 caracteres.";
  if (form.password !== form.password_confirmation)
    errors.password_confirmation = "As senhas não coincidem.";

  return Object.keys(errors).length === 0;
}

async function handleRegister() {
  if (!validate()) return;

  isLoading.value = true;
  globalError.value = "";

  try {
    await registerRequest({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      password_confirmation: form.password_confirmation,
    });

    await login(form.email.trim(), form.password);
    router.push("/paciente");
  } catch (err: any) {
    const msgs = err?.response?.data?.errors;
    if (Array.isArray(msgs) && msgs.length > 0) {
      globalError.value = msgs.join(", ");
    } else {
      globalError.value =
        "Erro ao criar conta. Verifique os dados e tente novamente.";
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
