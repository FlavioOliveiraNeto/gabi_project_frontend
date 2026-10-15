<template>
  <Sonner />
  <router-view />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";

// Fora do bundle inicial: nenhum toast é disparado antes da interação do usuário.
const Sonner = defineAsyncComponent(() => import("@/components/ui/sonner/Sonner.vue"));
</script>
