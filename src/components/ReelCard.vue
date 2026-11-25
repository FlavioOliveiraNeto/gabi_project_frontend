<template>
  <figure class="w-full max-w-[400px] mx-auto">
    <!-- Fixed height in both states: no layout shift when the embed loads. -->
    <div class="h-[640px] rounded-2xl overflow-hidden border border-border bg-muted">
      <iframe
        v-if="loaded"
        :src="`https://www.instagram.com/reel/${id}/embed/`"
        :title="label"
        class="w-full h-full"
        loading="lazy"
        allowfullscreen
      />
      <button
        v-else
        type="button"
        class="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center font-body text-foreground hover:bg-muted/70 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-primary"
        :aria-label="`Carregar vídeo do Instagram: ${label}`"
        @click="loaded = true"
      >
        <Play
          class="w-12 h-12 text-primary"
          aria-hidden="true"
        />
        <span class="font-semibold">Carregar vídeo do Instagram</span>
        <span class="text-sm text-muted-foreground">
          O conteúdo do Instagram só é carregado depois do clique.
        </span>
      </button>
    </div>
    <figcaption class="mt-2 text-sm font-body text-muted-foreground text-center">
      <a
        :href="`https://www.instagram.com/psi.gabriellafelix/reel/${id}/`"
        target="_blank"
        rel="noopener noreferrer"
        class="underline underline-offset-2 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary rounded"
      >Assistir no Instagram<span class="sr-only"> (abre em nova aba)</span></a>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Play } from "lucide-vue-next";

defineProps<{ id: string; label: string }>();
const loaded = ref(false);
</script>
