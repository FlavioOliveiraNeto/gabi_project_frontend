<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <button
        class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-body text-sm"
        @click="router.push('/')"
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
          <template v-if="showForgot">
            <div
              v-if="forgotSent"
              class="text-center space-y-4"
            >
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
              class="space-y-4"
              @submit.prevent="handleForgotPassword"
            >
              <div class="space-y-2">
                <label class="font-body">E-mail</label>
                <input
                  v-model="forgotEmail"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  class="w-full border rounded-md p-2 font-body"
                >
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
                {{
                  forgotLoading ? "Enviando..." : "Enviar link de recuperação"
                }}
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

          <form
            v-else
            class="space-y-4"
            @submit.prevent="handleSubmit"
          >
            <div
              v-if="error"
              class="bg-red-100 text-red-600 text-sm font-body p-3 rounded-md"
            >
              {{ error }}
            </div>

            <div class="space-y-2">
              <label class="font-body">E-mail</label>
              <input
                v-model="email"
                type="email"
                required
                placeholder="seu@email.com"
                class="w-full border rounded-md p-2 font-body"
              >
            </div>

            <div class="space-y-2">
              <label class="font-body">Senha</label>

              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="••••••••••••"
                  class="w-full border rounded-md p-2 pr-10 font-body"
                >

                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  @click="showPassword = !showPassword"
                >
                  <Eye
                    v-if="!showPassword"
                    class="w-4 h-4"
                  />
                  <EyeOff
                    v-else
                    class="w-4 h-4"
                  />
                </button>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <button
                type="button"
                class="text-sm font-body text-primary hover:underline"
                @click="showForgot = true"
              >
                Esqueceu a senha?
              </button>
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
import { resolveLoginRedirect } from "@/router/loginRedirect";
import { requestPasswordReset } from "@/services/auth";
import { Eye, EyeOff } from "lucide-vue-next";
import LogoComponent from "@/components/LogoComponent.vue";
import Button from "@/components/ui/button/Button.vue";

const router = useRouter();
const route = useRoute();

const { login, user, isLoading, error } = useAuth();

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const showForgot = ref(false);
const forgotEmail = ref("");
const forgotSent = ref(false);

const handleSubmit = async () => {
  try {
    await login(email.value, password.value);

    const redirect = route.query.redirect as string | undefined;
    router.push(resolveLoginRedirect(user.value, redirect));
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
