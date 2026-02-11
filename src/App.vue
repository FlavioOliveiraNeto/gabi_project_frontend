<template>
  <!-- TooltipProvider equivalente (depende da lib que você usar) -->

  <!-- Toasters -->
  <Sonner />

  <!-- Router -->
  <router-view />
</template>

<script setup lang="ts">
import Sonner from "@/components/ui/sonner/Sonner.vue";
</script>
