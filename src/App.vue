<template>
  <Sonner v-if="loadToaster" />
  <router-view />
</template>

<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";

// Fora do caminho crítico: nenhum toast é disparado antes da interação do usuário,
// então o Toaster só é baixado quando o navegador fica ocioso após o primeiro paint.
const Sonner = defineAsyncComponent(() => import("@/components/ui/sonner/Sonner.vue"));
const loadToaster = ref(false);

onMounted(() => {
  const load = () => (loadToaster.value = true);
  if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 3000 });
  else setTimeout(load, 1500);
});
</script>
