<template>
  <footer class="bg-foreground text-background/70 py-12">
    <div class="container mx-auto px-6 lg:px-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Logo -->
        <div class="font-display text-xl font-bold text-background">
          Gabriella<span class="text-secondary">.</span>
        </div>

        <!-- Copyright -->
        <p class="font-body text-sm flex items-center gap-1">
          Feito com
          <Heart class="w-3.5 h-3.5 text-primary inline" />
          © {{ currentYear }} Gabriella Alves Felix Silva
        </p>

        <!-- CRP -->
        <p class="font-body text-sm text-background/50">
          Psicóloga — CRP XX/XXXXX
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Heart } from "lucide-vue-next";

const currentYear = new Date().getFullYear();
</script>
