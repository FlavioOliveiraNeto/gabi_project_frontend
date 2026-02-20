<template>
  <div class="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
    <div
      class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3"
    >
      <div class="flex items-center gap-2">
        <div class="p-2 rounded-lg bg-primary/10">
          <Users class="w-4 h-4 text-primary" />
        </div>
        <h3 class="font-body text-sm font-medium text-muted-foreground">
          Pacientes
        </h3>
      </div>
      <div>
        <p class="font-display text-3xl text-foreground">
          {{ stats.active_clients }}
        </p>
        <p class="font-body text-xs text-muted-foreground mt-0.5">ativos</p>
      </div>
    </div>

    <div
      class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3"
    >
      <div class="flex items-center gap-2">
        <div class="p-2 rounded-lg bg-secondary/10">
          <CalendarIcon class="w-4 h-4 text-secondary" />
        </div>
        <h3 class="font-body text-sm font-medium text-muted-foreground">
          Hoje
        </h3>
      </div>
      <div>
        <p class="font-display text-3xl text-foreground">
          {{ stats.today_sessions }}
        </p>
        <p class="font-body text-xs text-muted-foreground mt-0.5">
          sessões agendadas
        </p>
      </div>
    </div>

    <div
      class="border border-border/50 rounded-xl p-5 bg-card flex flex-col gap-3"
    >
      <div class="flex items-center gap-2">
        <div class="p-2 rounded-lg bg-primary/10">
          <Clock class="w-4 h-4 text-primary" />
        </div>
        <h3 class="font-body text-sm font-medium text-muted-foreground">
          Esta Semana
        </h3>
      </div>
      <div>
        <p class="font-display text-3xl text-foreground">
          {{ stats.sessions_this_week }}
        </p>
        <p class="font-body text-xs text-muted-foreground mt-0.5">
          sessões realizadas
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, Calendar as CalendarIcon, Clock } from "lucide-vue-next";
import type { TherapistStats } from "@/services/dashboard";

defineProps<{
  stats: TherapistStats;
}>();
</script>
