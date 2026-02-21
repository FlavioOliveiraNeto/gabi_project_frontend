<template>
  <section id="servicos" class="py-16 bg-sage-light relative overflow-hidden">
    <div
      class="absolute top-0 left-0 right-0 h-10 md:h-20 bg-background torn-edge-bottom z-10"
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
import { Heart, Ear, Users, Flower2, Puzzle, HeartPlus } from "lucide-vue-next";

const services = [
  {
    icon: Heart,
    title: "Terapia Individual",
    description:
      "Um espaço para se escutar, se compreender e construir mudanças possíveis e respeitosas com a sua história.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Ear,
    title: "Abordagem de Psicanálise",
    description:
      "Um encontro com aquilo que habita em você, até mesmo o que ainda não tem nome e o que não se lembrava que ainda estava aí dentro. Entre palavras e pausas, construímos sentidos, elaboramos dores e abrimos espaço para novas formas de existir considerando sua infância e psique. Em uma sessão que leva em média 50 minutos.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Users,
    title: "Atendimento com adolescentes, adultos e idosos",
    description:
      "Cada fase da vida carrega seus próprios desafios, dúvidas e transformações. Ofereço um espaço de escuta cuidadosa e respeitosa para adolescentes em descoberta, adultos em construção e idosos em ressignificação de suas histórias.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: HeartPlus,
    title: "Cuidando do que dói por dentro",
    description:
      "Quando a ansiedade aperta, a tristeza se prolonga ou a autoestima se fragiliza, pode ser difícil atravessar tudo sozinha(o). Este é um espaço de cuidado para acolher sentimentos como ansiedade, depressão, insegurança, medo, sobrecarga emocional e conflitos internos em geral. Acompanhamento de qualquer demanda psicológica, não reduzindo apenas ao diagnóstico, mas compreendido dentro da sua vivência.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Flower2,
    title: "Saúde de grupos vulnerabilizados",
    description:
      "Um espaço de cuidado dedicado a mulheres, pessoas LGBTQIA+, pessoas negras e quilombolas e pessoas em situação de violência. A escuta considera os impactos das desigualdades sociais, do racismo, do machismo e da discriminação na saúde emocional, oferecendo acolhimento ético, respeito à identidade e fortalecimento da autonomia.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Puzzle,
    title: "Cada demanda é única",
    description:
      "Mesmo que a sua não esteja listada aqui, vamos conversar e entender sobre seu processo terapêutico.",
    color: "bg-secondary/10 text-secondary",
  },
];
</script>
