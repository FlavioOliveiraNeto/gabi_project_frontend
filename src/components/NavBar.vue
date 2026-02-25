<template>
  <header class="fixed top-0 left-0 right-0 z-50 background-header">
    <div
      class="container mx-auto px-3 py-6 lg:px-25 lg:py-auto flex items-center justify-between"
    >
      <button class="font-display text-xl text-primary" @click="scrollTop">
        <LogoComponent />
      </button>

      <nav
        v-if="variant === 'landing'"
        class="hidden md:flex items-center gap-8"
      >
        <button
          v-for="link in navLinks"
          :key="link.href"
          class="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
          @click="handleClick(link.href)"
        >
          {{ link.label }}
        </button>

        <button
          v-if="showScheduleButton"
          class="bg-primary text-primary-foreground font-body text-sm px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
          @click="handleClick('#contato')"
        >
          Agendar
        </button>

        <router-link
          v-if="showLoginButton"
          to="/login"
          class="flex items-center justify-center w-10 h-10 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors"
        >
          <User class="w-5 h-5" />
        </router-link>
      </nav>

      <div v-else class="flex items-center gap-4">
        <slot name="right" />
      </div>

      <button
        v-if="variant === 'landing'"
        class="md:hidden text-foreground"
        @click="open = !open"
      >
        <component :is="open ? X : Menu" class="w-6 h-6" />
      </button>
    </div>

    <div
      v-if="open && variant === 'landing'"
      class="md:hidden bg-background/95 backdrop-blur-lg border-t border-border"
    >
      <nav class="flex flex-col items-center gap-6 py-8">
        <button
          v-for="link in navLinks"
          :key="link.href"
          class="font-body text-lg text-muted-foreground hover:text-primary transition-colors"
          @click="handleClick(link.href)"
        >
          {{ link.label }}
        </button>

        <button
          v-if="showScheduleButton"
          class="bg-primary text-primary-foreground font-body text-base px-8 py-3 rounded-full hover:opacity-90 transition-colors"
          @click="handleClick('#contato')"
        >
          Agendar
        </button>

        <router-link
          v-if="showLoginButton"
          to="/login"
          class="flex items-center justify-center w-12 h-12 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors"
        >
          <User class="w-6 h-6" />
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Menu, X, User } from "lucide-vue-next";
import LogoComponent from "@/components/LogoComponent.vue";

interface Props {
  variant?: "landing" | "internal";
  showScheduleButton?: boolean;
  showLoginButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: "landing",
  showScheduleButton: true,
  showLoginButton: true,
});

const open = ref(false);

const navLinks = [
  { label: "Sobre", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Contato", href: "#contato" },
];

function handleClick(href: string) {
  open.value = false;
  const el = document.querySelector(href);
  el?.scrollIntoView({ behavior: "smooth" });
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>
