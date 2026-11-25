<template>
  <footer class="bg-foreground text-background/80 py-12">
    <div class="container mx-auto px-6 lg:px-25">
      <div class="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
        <address
          class="not-italic font-body text-sm space-y-1"
          data-testid="nap"
        >
          <p class="font-display text-lg text-background">
            {{ SITE.name }}
          </p>
          <p>
            <a
              :href="`tel:${SITE.phoneTel}`"
              class="underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-background rounded"
              :aria-label="`Ligar para ${SITE.phoneDisplay}`"
            >{{ SITE.phoneDisplay }}</a>
          </p>
          <p>{{ SITE.location }}</p>
          <p>{{ SITE.crp }}</p>
          <p>
            <a
              :href="`mailto:${SITE.email}`"
              class="underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-background rounded break-all"
              :aria-label="`Enviar e-mail para ${SITE.email}`"
            >{{ SITE.email }}</a>
          </p>
        </address>

        <div class="font-body text-sm grid md:flex items-center gap-1">
          <p class="justify-self-center">
            Feito com <Heart
              class="w-3.5 h-3.5 text-primary inline"
              aria-label="amor"
            />
          </p>
          <p>© {{ currentYear }} Gabriella Alves Felix Silva</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Heart } from "lucide-vue-next";
import { SITE } from "@/seo/site";

const currentYear = new Date().getFullYear();
</script>
