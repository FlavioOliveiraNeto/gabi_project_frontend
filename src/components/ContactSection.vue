<template>
  <section id="contato" class="py-24 bg-background relative overflow-hidden">
    <div
      class="absolute top-0 left-0 right-0 h-20 bg-sage-light torn-edge-bottom z-10"
    />

    <div class="container mx-auto px-6 lg:px-25 pt-12">
      <!-- Header -->
      <div class="text-center mb-16 max-w-2xl mx-auto">
        <span
          class="text-secondary font-body font-semibold text-sm uppercase tracking-widest"
        >
          Contato
        </span>

        <h2
          class="text-4xl md:text-5xl font-display font-bold text-foreground mt-3"
        >
          Vamos <span class="text-primary italic">conversar?</span>
        </h2>

        <p class="text-lg font-body text-muted-foreground mt-4">
          Estou aqui para te acolher. Entre em contato e agende sua primeira
          sessão.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <!-- Contact Info -->
        <div class="space-y-8">
          <div
            v-for="item in contactItems"
            :key="item.title"
            class="flex items-start gap-4"
          >
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                item.bg,
              ]"
            >
              <component :is="item.icon" :class="['w-5 h-5', item.iconColor]" />
            </div>

            <div>
              <h3 class="font-display font-semibold text-foreground">
                {{ item.title }}
              </h3>
              <p class="font-body text-muted-foreground mt-1">
                {{ item.text }}
              </p>
            </div>
          </div>
        </div>

        <!-- CTA Card -->
        <div
          class="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-10 text-primary-foreground flex flex-col justify-center items-center text-center shadow-2xl shadow-primary/20"
        >
          <h3 class="text-3xl font-display font-bold mb-4">
            Vamos dar o primeiro passo?
          </h3>

          <p class="font-body text-primary-foreground/80 mb-8 max-w-sm">
            A terapia é um presente que você se dá. Agende sua primeira sessão e
            comece sua jornada.
          </p>

          <Button
            size="lg"
            class="bg-card text-primary hover:bg-card/90 font-body text-base px-10 py-6 rounded-full shadow-lg transition-all hover:-translate-y-0.5"
          >
            <a
              href="https://wa.me/5562996195671?text=Olá%20gostaria%20de%20agendar%20uma%20sessão"
              target="_blank"
              rel="noopener noreferrer"
            >
              Agendar pelo WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MapPin, Phone, Mail, Instagram, Clock } from "lucide-vue-next";

import Button from "@/components/ui/button/Button.vue";

const contactItems = [
  {
    icon: Phone,
    title: "Telefone / WhatsApp",
    text: "(62) 99619-5671",
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Mail,
    title: "E-mail",
    text: "gabrielafelixsilva@gmail.com",
    bg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    icon: Instagram,
    title: "Instagram",
    text: "@psi.gabriellafelix",
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: MapPin,
    title: "Atendimento",
    text: "Online",
    bg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    icon: Clock,
    title: "Horário",
    text: "Segunda a Sexta — 8h às 18h",
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
];
</script>
