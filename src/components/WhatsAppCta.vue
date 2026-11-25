<template>
  <div class="flex flex-col items-center gap-2 text-center">
    <a
      :href="WHATSAPP_URL"
      target="_blank"
      rel="noopener noreferrer"
      data-cta="whatsapp"
      class="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-base px-8 py-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      Conversar pelo WhatsApp
      <span class="sr-only">(abre em nova aba)</span>
    </a>
    <p class="font-body text-sm text-muted-foreground">
      {{ SITE.phoneDisplay }} · {{ SITE.crp }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { SITE } from "@/seo/site";

const WHATSAPP_URL =
  "https://wa.me/5562996195671?text=" +
  encodeURIComponent("Olá, gostaria de saber mais sobre o atendimento.");
</script>
