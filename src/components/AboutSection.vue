<template>
  <section id="sobre" class="py-24 bg-background relative overflow-hidden">
    <!-- Torn paper edge effect -->
    <div
      class="absolute top-0 left-0 right-0 h-20 bg-lavender-light torn-edge-bottom z-10"
    />

    <div class="container mx-auto px-6 lg:px-12 pt-12">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Image -->
        <div class="relative">
          <div
            class="rounded-[2rem] overflow-hidden shadow-xl -rotate-2 hover:rotate-0 transition-transform duration-500"
          >
            <img
              :src="aboutImage"
              alt="Arte de colagem representando introspecção e cuidado em psicologia"
              class="w-full h-[450px] object-cover"
            />
          </div>
          <div
            class="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full"
          />
          <div
            class="absolute -top-4 -left-4 w-16 h-16 bg-sage/30 rounded-xl rotate-12"
          />
        </div>

        <!-- Content -->
        <div class="space-y-8">
          <div>
            <span
              class="text-secondary font-body font-semibold text-sm uppercase tracking-widest"
            >
              Sobre Mim
            </span>

            <h2
              class="text-4xl md:text-5xl font-display font-bold text-foreground mt-3 leading-tight"
            >
              Cuidar da mente é um
              <span class="text-primary italic"> ato de coragem </span>
            </h2>
          </div>

          <p class="text-lg font-body text-muted-foreground leading-relaxed">
            Sou Gabriella Alves Felix Silva, psicóloga clínica apaixonada pela
            interseção entre arte e saúde mental. Acredito que cada pessoa
            carrega em si uma história rica e complexa — como uma colagem —
            feita de camadas, texturas e cores que merecem ser exploradas com
            cuidado e respeito.
          </p>

          <p class="text-lg font-body text-muted-foreground leading-relaxed">
            Minha abordagem integra técnicas terapêuticas com expressões
            artísticas, criando um espaço onde você pode se expressar livremente
            e reconstruir narrativas de forma criativa.
          </p>

          <!-- Features -->
          <div class="grid sm:grid-cols-3 gap-6 pt-4">
            <div
              v-for="item in features"
              :key="item.title"
              class="flex flex-col items-center text-center p-4 rounded-2xl bg-lavender-light/50 hover:bg-lavender-light transition-colors"
            >
              <div
                class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3"
              >
                <component :is="item.icon" class="w-5 h-5 text-primary" />
              </div>

              <h3 class="font-display font-semibold text-foreground">
                {{ item.title }}
              </h3>

              <p class="text-sm font-body text-muted-foreground mt-1">
                {{ item.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import aboutImage from "@/assets/images/about-collage.jpg";
import { Sparkles, Palette, Brain } from "lucide-vue-next";

const features = [
  { icon: Brain, title: "Escuta Ativa", desc: "Acolhimento genuíno" },
  { icon: Palette, title: "Arte Terapia", desc: "Expressão criativa" },
  { icon: Sparkles, title: "Autoconhecimento", desc: "Transformação pessoal" },
];
</script>
