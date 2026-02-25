<template>
  <section
    class="relative min-h-screen flex flex-col justify-start lg:justify-center bg-lavender-light"
  >
    <div
      class="hidden md:block absolute bottom-40 right-20 w-24 h-24 rounded-full bg-primary/10 animate-float"
      style="animation-delay: 2s"
    />
    <div
      class="hidden md:block absolute top-1/3 right-1/4 w-16 h-16 rotate-45 bg-sage/20 animate-float"
      style="animation-delay: 4s"
    />

    <div
      class="container mx-auto px-4 sm:px-6 lg:px-25 pt-30 lg:py-0 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center relative z-10"
    >
      <div
        class="order-1 lg:order-2 w-full lg:w-fit relative place-self-center lg:place-self-end animate-fade-in-up max-w-[16rem] md:max-w-[60rem]"
        style="animation-delay: 0.3s"
      >
        <div
          class="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/20 rotate-2 hover:rotate-0 transition-transform duration-500"
        >
          <img
            src="@/assets/images/hero_image.jpg"
            alt="Arte de colagem com formas orgânicas em roxo, verde e branco representando acolhimento e psicologia"
            class="w-full h-72 sm:h-96 md:h-[32rem] lg:h-[40rem] object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"
          />
        </div>

        <div
          class="absolute -bottom-6 -left-6 w-28 h-28 bg-sage rounded-full opacity-60"
        />
        <div
          class="absolute -top-4 -right-4 w-20 h-20 bg-lavender rounded-2xl rotate-12 opacity-70"
        />
      </div>

      <div class="order-2 lg:order-1 space-y-6 lg:space-y-8 animate-fade-in-up">
        <h1
          class="text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-foreground leading-tight"
        >
          Gabriella<span class="text-primary"> Felix</span>
        </h1>

        <div
          class="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border w-fit"
        >
          <Heart class="w-4 h-4 text-primary" />
          <span class="text-sm sm:text-base font-body text-muted-foreground">
            Psicóloga Clínica — CRP 09/21105
          </span>
        </div>

        <p
          class="text-primary font-bold text-xl sm:text-2xl md:text-3xl font-body leading-relaxed"
        >
          Cuidar da saúde mental também é considerar o mundo que te atravessa.
        </p>

        <p
          class="text-base md:text-lg lg:text-xl font-body text-muted-foreground leading-relaxed"
        >
          Uma escuta clínica que reconhece que o sofrimento não nasce no vazio,
          mas nas relações, na história e na sociedade.
        </p>

        <div class="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
          <Button
            size="lg"
            class="bg-primary text-primary-foreground hover:bg-primary/90 font-body text-base lg:text-lg px-6 py-5 lg:px-8 lg:py-6 rounded-full shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            @click="scrollTo('contato')"
          >
            Agendar Consulta
          </Button>
        </div>
      </div>
    </div>

    <button
      class="mt-12 lg:mt-0 lg:absolute lg:bottom-8 left-1/2 lg:-translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      aria-label="Rolar para baixo"
      @click="scrollTo('sobre')"
    >
      <span class="text-sm font-body">Conheça mais sobre mim</span>
      <ArrowDown class="w-5 h-5 animate-bounce" />
    </button>
  </section>
</template>

<script setup lang="ts">
import { Heart, ArrowDown } from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
</script>
