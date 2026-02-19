<template>
  <section id="sobre" class="py-16 bg-background relative overflow-hidden">
    <div
      class="absolute top-0 left-0 right-0 h-10 md:h-20 bg-lavender-light torn-edge-bottom z-10"
    />

    <div class="container mx-auto px-6 lg:px-25 pt-12">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
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
            Sou Gabriella Felix, psicóloga e mestranda pela UFG. Acredito que
            saúde mental não pode ser pensada fora do contexto de vida de cada
            pessoa. Minha escuta parte do entendimento de que o sofrimento
            psíquico não nasce no vazio, ele é atravessado por histórias,
            relações, desigualdades, expectativas e pelas marcas sociais que nos
            constituem.
          </p>

          <p class="text-lg font-body text-muted-foreground leading-relaxed">
            Atendo adolescentes, adultos e pessoas idosas, buscando ouvir todos
            os tipos de demandas psíquicas como ansiedade, depressão, vício em
            jogos, processos pós-bariátrica e questões relacionadas aos
            atravessamentos de gênero e raça. Minha prática clínica é sensível e
            comprometida com uma escuta que reconhece a singularidade de cada
            trajetória, sem desconsiderar os impactos do mundo sobre ela.
          </p>

          <p class="text-lg font-body text-muted-foreground leading-relaxed">
            Assim como você, eu também tive infância, adolescência,
            atravessamentos, dúvidas e medos. Também faço terapia e sei, na
            pele, o quanto iniciar um processo pode ser difícil. Falar de si
            exige coragem. Sustentar o próprio sofrimento diante de outra pessoa
            não é simples. E é justamente por reconhecer essa dimensão humana
            que construo um espaço seguro, respeitoso e sem julgamentos.
          </p>

          <p class="text-lg font-body text-muted-foreground leading-relaxed">
            Acredito na clínica como um lugar de elaboração, fortalecimento e
            reconstrução de sentidos. Um espaço onde você pode existir com
            complexidade, sem precisar se explicar o tempo todo, mas sendo
            profundamente escutado.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 items-stretch">
            <div
              v-for="item in features"
              :key="item.title"
              class="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-lavender-light/50 hover:bg-lavender-light transition-colors min-h-[220px]"
            >
              <div
                class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"
              >
                <component :is="item.icon" class="w-5 h-5 text-primary" />
              </div>

              <h3 class="font-display font-semibold text-foreground">
                {{ item.title }}
              </h3>

              <p class="text-sm font-body text-muted-foreground mt-2">
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
import { Sparkles, Lightbulb, Brain, AlarmClock } from "lucide-vue-next";

const features = [
  { icon: Brain, title: "Escuta Sem Julgamentos", desc: "Espaço seguro" },
  {
    icon: Lightbulb,
    title: "Psicoterapia Online",
    desc: "Atendimento onde você estiver",
  },
  {
    icon: AlarmClock,
    title: "Preparando o ambiente",
    desc: "Você precisa ter um lugar seguro e confortável em que poderá ficar 50 minutos sozinho",
  },
  {
    icon: Sparkles,
    title: "Autoconhecimento",
    desc: "Se fortalecer para viver com mais leveza",
  },
];
</script>
