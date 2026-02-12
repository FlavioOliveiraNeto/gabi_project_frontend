<template>
  <div class="min-h-screen bg-lavender-light">
    <!-- HEADER -->
    <header class="background-header">
      <div
        class="container mx-auto px-6 lg:px-25 flex items-center justify-between h-16"
      >
        <h1 class="font-display text-xl text-primary">
          <LogoComponent />
        </h1>

        <div class="flex items-center gap-4">
          <span class="font-body text-sm text-muted-foreground">
            Olá, {{ user?.name }}
          </span>

          <button
            @click="handleLogout"
            title="Sair"
            class="p-2 hover:bg-muted rounded-md transition"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- MAIN -->
    <main class="container mx-auto px-6 lg:px-25 py-10">
      <h2 class="font-display text-2xl text-foreground mb-8">
        Área do Paciente
      </h2>

      <div class="grid gap-6 md:grid-cols-3">
        <!-- Próxima Sessão -->
        <div class="border border-border/50 rounded-xl p-6 bg-card">
          <div class="flex items-center gap-3 mb-4">
            <Calendar class="w-5 h-5 text-primary" />
            <h3 class="font-display text-lg">Próxima Sessão</h3>
          </div>

          <p class="font-body text-muted-foreground text-sm">
            Quinta-feira, 15 de Fevereiro — 14:00
          </p>
        </div>

        <!-- Sessões Realizadas -->
        <div class="border border-border/50 rounded-xl p-6 bg-card">
          <div class="flex items-center gap-3 mb-4">
            <Clock class="w-5 h-5 text-secondary" />
            <h3 class="font-display text-lg">Sessões Realizadas</h3>
          </div>

          <p class="font-body text-3xl font-semibold text-foreground">12</p>
        </div>

        <!-- Anotações -->
        <div class="border border-border/50 rounded-xl p-6 bg-card">
          <div class="flex items-center gap-3 mb-4">
            <FileText class="w-5 h-5 text-primary" />
            <h3 class="font-display text-lg">Anotações</h3>
          </div>

          <p class="font-body text-muted-foreground text-sm">
            3 anotações disponíveis
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { LogOut, Calendar, FileText, Clock } from "lucide-vue-next";
import LogoComponent from "@/components/LogoComponent.vue";

const router = useRouter();
const { user, logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push("/login");
};
</script>
