<template>
  <section id="servicos" class="py-24 bg-sage-light relative overflow-hidden">
    <div
      class="absolute top-0 left-0 right-0 h-20 bg-background torn-edge-bottom z-10"
    />

    <div class="container mx-auto px-6 lg:px-25 pt-12">
      <!-- Header -->
      <div class="text-center mb-16 max-w-2xl mx-auto">
        <span
          class="text-secondary font-body font-semibold text-sm uppercase tracking-widest"
        >
          Serviços
        </span>

        <h2
          class="text-4xl md:text-5xl font-display font-bold text-foreground mt-3"
        >
          Como posso te <span class="text-primary italic">ajudar</span>
        </h2>

        <p class="text-lg font-body text-muted-foreground mt-4">
          Cada jornada é única. Conheça as formas de atendimento que ofereço.
        </p>
      </div>

      <!-- Cards -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(service, index) in services"
          :key="service.title"
          class="group bg-card p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div
            :class="[
              'w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform',
              service.color,
            ]"
          >
            <component :is="service.icon" class="w-6 h-6" />
          </div>

          <h3 class="text-xl font-display font-semibold text-foreground mb-3">
            {{ service.title }}
          </h3>

          <p class="font-body text-muted-foreground leading-relaxed">
            {{ service.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Heart, Users, Baby, Flower2, Puzzle, Palette } from "lucide-vue-next";

const services = [
  {
    icon: Heart,
    title: "Terapia Individual",
    description:
      "Sessões personalizadas para trabalhar questões emocionais, comportamentais e de autoconhecimento.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Terapia de Casal",
    description:
      "Fortalecimento da comunicação e dos vínculos afetivos entre parceiros.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Baby,
    title: "Atendimento Infantil",
    description:
      "Abordagem lúdica e acolhedora para crianças, utilizando brincadeiras e arte.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Palette,
    title: "Arteterapia",
    description:
      "Uso de colagens, pinturas e recortes como ferramentas terapêuticas de expressão.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Flower2,
    title: "Saúde da Mulher",
    description:
      "Acompanhamento psicológico voltado para questões femininas e empoderamento.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Puzzle,
    title: "Orientação Profissional",
    description:
      "Auxílio na descoberta de caminhos profissionais alinhados ao seu propósito.",
    color: "bg-secondary/10 text-secondary",
  },
];
</script>
