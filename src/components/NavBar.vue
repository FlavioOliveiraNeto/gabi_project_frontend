<template>
  <nav>
    <div class="container nav-content">
      <div class="logo-area">
        <div
          class="logo-img"
          :style="{
            backgroundImage: `url(${logoImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }"
        ></div>

        <span>Dra. Gabriella Alves Félix Silva</span>
      </div>

      <div class="nav-links">
        <RouterLink to="/" class="side-link" style="display: inline">
          Página Inicial
        </RouterLink>

        <RouterLink to="/login" class="btn btn-primary"> Login </RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
import logoImage from "../assets/images/gabi_logo.png";
</script>
