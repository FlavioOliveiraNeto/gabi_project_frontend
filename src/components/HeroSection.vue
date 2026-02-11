<template>
  <section class="hero">
    <div>
      <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h1>
      <p
        style="font-size: 1.2rem; margin-bottom: 30px; color: var(--text-muted)"
      >
        Proin felis magna, imperdiet vel nibh et, rutrum congue dolor. Donec id
        volutpat nulla, eu sollicitudin nulla. Aliquam ut diam et augue
        tincidunt semper.
      </p>

      <RouterLink to="/login" class="btn btn-primary">
        Agende uma consulta
      </RouterLink>
    </div>

    <div class="hero-img">
      <img
        src="../assets/images/hero_image.jpg"
        style="width: 100%; height: 100%; object-fit: cover"
      />
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
