<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <button
        @click="router.push('/')"
        class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-body text-sm"
      >
        ← Voltar ao site
      </button>

      <div
        class="bg-background/95 backdrop-blur-lg border border-border/50 shadow-lg rounded-xl"
      >
        <div class="text-center space-y-2 p-6">
          <div class="font-display text-2xl text-primary">
            <LogoComponent class="justify-center" />
          </div>
          <p class="font-body text-muted-foreground">
            {{
              showForgot ? "Recuperar senha" : "Acesse sua área administrativa"
            }}
          </p>
        </div>

        <div class="p-6">
          <!-- FORGOT PASSWORD -->
          <template v-if="showForgot">
            <div v-if="forgotSent" class="text-center space-y-4">
              <p class="font-body text-sm text-muted-foreground">
                Se o e-mail <strong>{{ forgotEmail }}</strong> estiver
                cadastrado, você receberá as instruções de recuperação.
              </p>

              <button
                class="w-full border rounded-full py-2 font-body"
                @click="
                  () => {
                    showForgot = false;
                    forgotSent = false;
                    forgotEmail = '';
                  }
                "
              >
                Voltar ao login
              </button>
            </div>

            <form
              v-else
              @submit.prevent="handleForgotPassword"
              class="space-y-4"
            >
              <div class="space-y-2">
                <label class="font-body">E-mail</label>
                <input
                  type="email"
                  v-model="forgotEmail"
                  required
                  placeholder="seu@email.com"
                  class="w-full border rounded-md p-2 font-body"
                />
              </div>

              <p
                v-if="forgotError"
                class="bg-red-100 text-red-600 text-sm font-body p-3 rounded-md"
              >
                {{ forgotError }}
              </p>

              <button
                type="submit"
                :disabled="forgotLoading"
                class="w-full bg-primary text-white rounded-full py-2 font-body disabled:opacity-50"
              >
                {{ forgotLoading ? "Enviando..." : "Enviar link de recuperação" }}
              </button>

              <button
                type="button"
                class="w-full text-sm font-body"
                @click="showForgot = false"
              >
                Voltar ao login
              </button>
            </form>
          </template>

          <!-- LOGIN FORM -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <div
              v-if="error"
              class="bg-red-100 text-red-600 text-sm font-body p-3 rounded-md"
            >
              {{ error }}
            </div>

            <div class="space-y-2">
              <label class="font-body">E-mail</label>
              <input
                type="email"
                v-model="email"
                required
                placeholder="seu@email.com"
                class="w-full border rounded-md p-2 font-body"
              />
            </div>

            <div class="space-y-2">
              <label class="font-body">Senha</label>

              <div class="relative">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  required
                  placeholder="••••••••••••"
                  class="w-full border rounded-md p-2 pr-10 font-body"
                />

                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <Eye v-if="!showPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <button
                type="button"
                @click="showForgot = true"
                class="text-sm font-body text-primary hover:underline"
              >
                Esqueceu a senha?
              </button>

              <router-link
                to="/cadastro"
                class="text-sm font-body text-primary hover:underline"
              >
                Não tem uma conta?
              </router-link>
            </div>

            <Button
              size="lg"
              class="w-2/3 block justify-self-center bg-primary text-primary-foreground hover:bg-primary/90 font-body text-base px-8 py-2 rounded-full shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              type="submit"
              :disabled="isLoading"
            >
              {{ isLoading ? "Entrando..." : "Entrar" }}
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { requestPasswordReset } from "@/services/auth";
import { Eye, EyeOff } from "lucide-vue-next";
import LogoComponent from "@/components/LogoComponent.vue";
import Button from "@/components/ui/button/Button.vue";

const router = useRouter();
const route = useRoute();

const { login, isLoading, error } = useAuth();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const showForgot = ref(false);
const forgotEmail = ref("");
const forgotSent = ref(false);

const handleSubmit = async () => {
  try {
    await login(email.value, password.value);

    const userRaw = localStorage.getItem("auth_user");
    const user = userRaw ? JSON.parse(userRaw) : null;

    if (user?.must_change_password && user?.role === "client") {
      router.push("/trocar-senha");
      return;
    }

    const redirect = route.query.redirect as string | undefined;
    if (redirect) {
      router.push(redirect);
    } else {
      if (user?.role === "therapist") {
        router.push("/terapeuta");
      } else {
        router.push("/paciente");
      }
    }
  } catch {
    console.error("Erro ao fazer login");
  }
};

const forgotLoading = ref(false);
const forgotError = ref("");

const handleForgotPassword = async () => {
  if (!forgotEmail.value.trim()) return;

  forgotLoading.value = true;
  forgotError.value = "";

  try {
    await requestPasswordReset(forgotEmail.value.trim());
    // Sempre exibe a mensagem genérica — não revelamos se o e-mail existe ou não
    forgotSent.value = true;
  } catch (e: any) {
    const msgs = e?.response?.data?.errors;
    forgotError.value = Array.isArray(msgs)
      ? msgs.join(", ")
      : "Não foi possível enviar o e-mail. Tente novamente.";
  } finally {
    forgotLoading.value = false;
  }
};
</script>
