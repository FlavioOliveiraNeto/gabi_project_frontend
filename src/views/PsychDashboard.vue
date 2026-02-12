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
        Painel da Terapeuta
      </h2>

      <!-- STATS -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div class="border border-border/50 rounded-xl p-6 bg-card">
          <div class="flex items-center gap-3 mb-4">
            <Users class="w-5 h-5 text-primary" />
            <h3 class="font-display text-lg">Pacientes</h3>
          </div>

          <p class="font-body text-3xl font-semibold text-foreground">24</p>
          <p class="font-body text-xs text-muted-foreground">ativos</p>
        </div>

        <div class="border border-border/50 rounded-xl p-6 bg-card">
          <div class="flex items-center gap-3 mb-4">
            <Calendar class="w-5 h-5 text-secondary" />
            <h3 class="font-display text-lg">Hoje</h3>
          </div>

          <p class="font-body text-3xl font-semibold text-foreground">5</p>
          <p class="font-body text-xs text-muted-foreground">
            sessões agendadas
          </p>
        </div>

        <div class="border border-border/50 rounded-xl p-6 bg-card">
          <div class="flex items-center gap-3 mb-4">
            <Clock class="w-5 h-5 text-primary" />
            <h3 class="font-display text-lg">Esta Semana</h3>
          </div>

          <p class="font-body text-3xl font-semibold text-foreground">18</p>
          <p class="font-body text-xs text-muted-foreground">
            sessões realizadas
          </p>
        </div>

        <div class="border border-border/50 rounded-xl p-6 bg-card">
          <div class="flex items-center gap-3 mb-4">
            <TrendingUp class="w-5 h-5 text-secondary" />
            <h3 class="font-display text-lg">Mensal</h3>
          </div>

          <p class="font-body text-3xl font-semibold text-foreground">72</p>
          <p class="font-body text-xs text-muted-foreground">sessões no mês</p>
        </div>
      </div>

      <!-- PRÓXIMAS SESSÕES -->
      <div class="mt-10">
        <h3 class="font-display text-xl text-foreground mb-4">
          Próximas Sessões
        </h3>

        <div class="space-y-3">
          <div
            v-for="session in sessions"
            :key="session.name"
            class="border border-border/50 rounded-xl bg-card px-6 py-4 flex items-center justify-between"
          >
            <div>
              <p class="font-body font-medium text-foreground">
                {{ session.name }}
              </p>
              <p class="font-body text-xs text-muted-foreground">
                {{ session.type }}
              </p>
            </div>

            <span class="font-body text-sm text-primary font-medium">
              {{ session.time }}
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { LogOut, Users, Calendar, TrendingUp, Clock } from "lucide-vue-next";
import LogoComponent from "@/components/LogoComponent.vue";

const router = useRouter();
const { user, logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push("/login");
};

const sessions = [
  { name: "Maria Silva", time: "09:00", type: "Individual" },
  { name: "João Santos", time: "10:30", type: "Individual" },
  { name: "Ana Oliveira", time: "14:00", type: "Casal" },
  { name: "Pedro Costa", time: "15:30", type: "Individual" },
  { name: "Lucia Ferreira", time: "17:00", type: "Individual" },
];
</script>
