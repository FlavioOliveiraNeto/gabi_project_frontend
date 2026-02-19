<template>
  <footer class="bg-foreground text-background/70 py-12">
    <div class="container mx-auto px-6 lg:px-25">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Logo -->
        <div class="font-display text-xl text-background">
          <LogoComponent />
        </div>

        <!-- Copyright -->
        <p class="font-body text-sm grid md:flex items-center gap-1">
          <div class="justify-self-center">
            Feito com <Heart class="w-3.5 h-3.5 text-primary inline" />
          </div>
          © {{ currentYear }} Gabriella Alves Felix Silva
        </p>

        <!-- CRP -->
        <p class="font-body text-sm text-background/50">
          Psicóloga — CRP 09/21105
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Heart } from "lucide-vue-next";
import LogoComponent from "@/components/LogoComponent.vue";

const currentYear = new Date().getFullYear();
</script>
