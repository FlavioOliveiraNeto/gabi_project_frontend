<template>
  <div class="min-h-screen bg-background">
    <Navbar variant="internal">
      <template #right>
        <router-link
          to="/"
          class="font-body text-sm text-muted-foreground hover:text-primary rounded focus-visible:outline-2 focus-visible:outline-primary"
        >
          Início
        </router-link>
      </template>
    </Navbar>

    <main class="container mx-auto px-6 pt-32 pb-12 max-w-3xl font-body text-lg text-muted-foreground leading-relaxed space-y-6">
      <header class="space-y-4 text-center">
        <h1 class="text-4xl md:text-5xl font-display font-bold text-foreground">
          Psicologia e questões raciais
        </h1>
        <p>
          Uma escuta clínica atenta aos atravessamentos sociais, raciais e de
          gênero. Atendimento online com Gabriella Felix, psicóloga clínica e
          psicanalista.
        </p>
        <p class="font-semibold text-foreground">
          {{ SITE.crp }}
        </p>
        <WhatsAppCta />
      </header>

      <section
        aria-labelledby="atravessamentos"
        class="space-y-4 pt-8"
      >
        <h2
          id="atravessamentos"
          class="text-3xl font-display font-bold text-foreground"
        >
          Escutar atravessamentos também é psicologia
        </h2>
        <p>
          Ser psicóloga é estar em eterna formação e aprendizado. A sociedade
          muda, se renova, e a clínica acompanha esse movimento. Escutar pessoas
          que se movem com atravessamentos sociais, raciais, de gênero e
          familiares é psicologia.
        </p>
        <p>
          Gabriella Felix é mestranda em Psicologia pela Universidade Federal de
          Goiás (UFG), na linha de pesquisa subjetivação, clínica e cultura, e
          acredita em uma psicologia social, menos elitizada, que avance sempre
          em busca de ser acessível para todas as pessoas e classes.
        </p>
        <ReelCard
          id="DN322i0Dla_"
          label="Publicação de Gabriella Felix sobre a escuta de atravessamentos sociais, raciais e de gênero"
        />
      </section>

      <section
        aria-labelledby="representatividade"
        class="space-y-4 pt-8"
      >
        <h2
          id="representatividade"
          class="text-3xl font-display font-bold text-foreground"
        >
          Representatividade na infância negra
        </h2>
        <p>
          Crianças pretas que crescem com representatividade têm apoio na
          construção da própria identidade. Quando assistem a programas com
          protagonistas que se parecem com elas, ampliam suas possibilidades de
          existência, fortalecem a autoestima e constroem referências positivas
          sobre quem são e quem podem se tornar.
        </p>
        <p>
          Esse fortalecimento acompanha também a vida adulta: existir enquanto
          pessoa preta que consegue se posicionar e resistir diante do racismo
          estrutural da sociedade.
        </p>
        <p>
          Se ver na tela é também se reconhecer como importante no mundo e
          entender que esse espaço pode e deve ser ocupado. É o que permite a
          crianças negras se verem como heróis e heroínas, princesas e príncipes
          — e desconstrói a ideia de que o mundo lúdico é acessível apenas para a
          branquitude.
        </p>
        <ReelCard
          id="DVGsJr8jSio"
          label="Gabriella Felix, mulher negra de cabelos cacheados, fala sobre representatividade na infância negra"
        />
      </section>

      <section
        aria-labelledby="machismo"
        class="space-y-4 pt-8"
      >
        <h2
          id="machismo"
          class="text-3xl font-display font-bold text-foreground"
        >
          Machismo estrutural e violência contra mulheres
        </h2>
        <p>
          Vivemos em uma sociedade que educa homens para o controle e o poder.
          Quando mulheres são mortas por homens, nem sempre existe um transtorno
          por trás: o que geralmente existe é um machismo legitimado e
          construído socialmente.
        </p>
        <p>
          Patologizar a violência não a explica, nem a enfrenta. A psicologia não
          serve para justificar violências, mas para compreender e intervir no
          machismo estrutural.
        </p>
        <ReelCard
          id="DTslEH6DQQY"
          label="Gabriella Felix fala para a câmera sobre machismo estrutural"
        />
      </section>

      <section
        aria-labelledby="discurso-de-odio"
        class="space-y-4 pt-8"
      >
        <h2
          id="discurso-de-odio"
          class="text-3xl font-display font-bold text-foreground"
        >
          Discursos de ódio contra mulheres
        </h2>
        <p>
          O aumento de discursos de ódio contra mulheres, muitas vezes
          apresentados como “liberdade de expressão”, é motivo de preocupação.
          Afinal, até onde uma opinião pode estar infringindo o direito de
          alguém existir?
        </p>
        <p>
          Falas que deslegitimam mulheres, negam direitos e questionam o seu
          espaço contribuem para um cenário de retrocesso e de aumento do
          sofrimento psicossocial.
        </p>
        <ReelCard
          id="DeKGvYxjvA0"
          label="Publicação de Gabriella Felix sobre discursos de ódio contra mulheres"
        />
      </section>

      <section
        aria-labelledby="contato"
        class="space-y-4 pt-8 text-center"
      >
        <h2
          id="contato"
          class="text-3xl font-display font-bold text-foreground"
        >
          Para saber mais sobre o atendimento
        </h2>
        <p>
          Sessões online de 50 minutos, por videochamada. O contato é feito pelo
          WhatsApp. Atendimento online — Goiânia, GO.
        </p>
        <WhatsAppCta />
      </section>
    </main>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/NavBar.vue";
import FooterSection from "@/components/FooterSection.vue";
import ReelCard from "@/components/ReelCard.vue";
import WhatsAppCta from "@/components/WhatsAppCta.vue";
import { SITE } from "@/seo/site";
</script>
