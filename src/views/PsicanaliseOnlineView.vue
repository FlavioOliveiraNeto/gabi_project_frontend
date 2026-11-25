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
          Psicanálise online
        </h1>
        <p>
          Psicoterapia de orientação psicanalítica por videochamada, com
          Gabriella Felix, psicóloga clínica e psicanalista. Atendimento online
          para Goiânia, região e outras cidades.
        </p>
        <p class="font-semibold text-foreground">
          {{ SITE.crp }}
        </p>
        <WhatsAppCta />
      </header>

      <section
        aria-labelledby="escuta"
        class="space-y-4 pt-8"
      >
        <h2
          id="escuta"
          class="text-3xl font-display font-bold text-foreground"
        >
          Uma escuta humana e sem julgamentos
        </h2>
        <p>
          Gabriella Felix é psicóloga clínica e psicanalista, CRP 09/21105, e
          mestranda em Psicologia pela Universidade Federal de Goiás (UFG), na
          linha de pesquisa subjetivação, clínica e cultura.
        </p>
        <p>
          Ela acredita em uma psicologia social, menos elitizada e acessível
          para todas as pessoas. Ao longo do percurso profissional, buscou
          atender e trabalhar em projetos sociais justamente por acreditar
          nisso.
        </p>
        <p>
          Para quem deseja começar um processo de psicoterapia, a proposta é
          oferecer uma escuta humana e sem julgamentos, em sessões online de 50
          minutos.
        </p>
        <ReelCard
          id="DTIkB1OjSoY"
          label="Gabriella Felix, mulher negra de cabelos cacheados, se apresenta como psicóloga clínica"
        />
      </section>

      <section
        aria-labelledby="temas"
        class="space-y-4 pt-8"
      >
        <h2
          id="temas"
          class="text-3xl font-display font-bold text-foreground"
        >
          Reflexões que atravessam a escuta
        </h2>
        <p>
          Alguns temas aparecem com frequência quando se fala de sofrimento,
          desejo e cuidado de si. Abaixo, algumas reflexões que Gabriella
          compartilha no Instagram.
        </p>

        <h3 class="text-2xl font-display font-semibold text-foreground pt-4">
          Nem tudo é transtorno
        </h3>
        <p>
          Hoje é comum assistir a um vídeo curto, reconhecer ali um possível
          sintoma e concluir: “acho que tenho isso”. Mas funcionar de um jeito
          diferente não é sinônimo de ter um transtorno.
        </p>
        <p>
          No caso do Transtorno de Déficit de Atenção e Hiperatividade (TDAH),
          por exemplo, qualquer investigação precisa passar por acompanhamento
          com um profissional — um diagnóstico não se faz em 60 segundos.
        </p>
        <p>
          Cada pessoa tem seu tempo, seu jeito e seu processo. E tudo bem se você
          ainda estiver tentando entender o seu. A psicoterapia é um espaço para
          pensar nisso sem pressa e sem rótulos.
        </p>
        <ReelCard
          id="DIT3_FfOQlY"
          label="Gabriella Felix fala para a câmera sobre por que nem tudo é transtorno"
        />

        <h3 class="text-2xl font-display font-semibold text-foreground pt-4">
          A criança que ainda somos
        </h3>
        <p>
          Você falaria com uma criança do jeito que fala com você mesmo? A gente
          cresce, assume responsabilidades, se cobra demais — e esquece de olhar
          com carinho para quem fomos e, de algum modo, ainda somos lá dentro.
        </p>
        <p>
          Amadurecer não é se endurecer. É aprender a cuidar de si com o mesmo
          afeto que você daria a uma criança assustada. O adulto forte também é
          aquele que sabe ser gentil.
        </p>
        <ReelCard
          id="DL7ndqlOr5S"
          label="Gabriella Felix fala para a câmera sobre o cuidado com a criança interior"
        />

        <h3 class="text-2xl font-display font-semibold text-foreground pt-4">
          Recomeços, expectativas e ansiedade
        </h3>
        <p>
          Não é porque um ano novo começou que você precisa se colocar tanta
          pressão com mudanças e cobranças. Às vezes, para que um ciclo comece
          bem, basta ter paciência com o seu tempo e o seu processo.
        </p>
        <p>
          Nem sempre é hora de grandes decisões: topar um recomeço, com tanto
          cansaço acumulado, já pode ser uma decisão enorme. E, quando as
          expectativas criadas trazem ansiedade, elas também podem ser levadas
          para a sessão.
        </p>
        <ReelCard
          id="DS7tzDmjQvr"
          label="Gabriella Felix fala ao microfone sobre ano novo, cobranças e ansiedade"
        />

        <h3 class="text-2xl font-display font-semibold text-foreground pt-4">
          Os desejos de quem?
        </h3>
        <p>
          Em uma cena conhecida da série Gilmore Girls, Lorelai diz à filha,
          Rory, que finalmente ela vai poder fazer tudo o que a mãe quis. A fala
          verbaliza algo que muitas vezes fica no inconsciente: a projeção de que
          o filho deve viver a vida que o pai ou a mãe não puderam ter.
        </p>
        <p>
          Ao projetar em Rory os sonhos interrompidos pela gravidez na
          adolescência, Lorelai coloca na filha o peso de ser a sua “versão
          corrigida”. O risco é o apagamento da individualidade: ela está
          vivendo os próprios desejos ou os desejos que a mãe pavimentou para
          ela?
        </p>
        <p>
          A pergunta vale para cada um de nós: você sente que vive para realizar
          os seus sonhos ou os dos seus pais?
        </p>
        <ReelCard
          id="DTakX86jQko"
          label="Gabriella Felix comenta uma cena de Gilmore Girls sobre projeção parental"
        />

        <h3 class="text-2xl font-display font-semibold text-foreground pt-4">
          O desejo que nunca acaba
        </h3>
        <p>
          A partir de uma canção brasileira escrita durante a ditadura — que
          também pode ser lida como uma crítica ao conformismo e à falsa sensação
          de vida próspera da classe média da época —, é possível pensar, por
          uma perspectiva psicanalítica, no sujeito que deseja tanto e está
          sempre em movimento.
        </p>
        <p>
          O que tem te movido: aquilo que você tem ou aquilo que te falta? E o
          que se pode fazer com um desejo que nunca acaba?
        </p>
        <ReelCard
          id="DZ7r2Bxu9iR"
          label="Gabriella Felix fala para a câmera sobre desejo na perspectiva psicanalítica"
        />

        <h3 class="text-2xl font-display font-semibold text-foreground pt-4">
          Mais um vídeo no Instagram
        </h3>
        <ReelCard
          id="DbqVf-6tM0m"
          label="Gabriella Felix, sentada no sofá, fala para a câmera"
        />
      </section>

      <div class="max-w-none">
        <FaqSection
          :items="FAQ_PSICANALISE"
          heading-id="faq-psicanalise"
        />
      </div>

      <section
        aria-labelledby="contato"
        class="space-y-4 pt-4 text-center"
      >
        <h2
          id="contato"
          class="text-3xl font-display font-bold text-foreground"
        >
          Para saber mais sobre o atendimento
        </h2>
        <p>
          O contato é feito pelo WhatsApp. Atendimento online —
          Goiânia, GO.
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
import FaqSection from "@/components/FaqSection.vue";
import ReelCard from "@/components/ReelCard.vue";
import WhatsAppCta from "@/components/WhatsAppCta.vue";
import { FAQ_PSICANALISE } from "@/seo/faq";
import { SITE } from "@/seo/site";
</script>
