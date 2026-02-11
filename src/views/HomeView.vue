<template>
  <div class="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <About />
    <Services />
    <Contact />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/NavBar.vue";
import Hero from "@/components/HeroSection.vue";
import About from "@/components/AboutSection.vue";
import Services from "@/components/ServicesSection.vue";
import Contact from "@/components/ContactSection.vue";
import Footer from "@/components/FooterSection.vue";
</script>
