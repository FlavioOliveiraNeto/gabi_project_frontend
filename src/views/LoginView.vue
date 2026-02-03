<template>
  <div class="page active">
    <div class="container">
      <div class="card auth-card">
        <h2>Welcome Back</h2>

        <div class="form-group">
          <label>Email Address</label>
          <input v-model="email" type="email" />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" />
        </div>

        <button class="btn btn-primary" style="width: 100%" @click="login">
          Sign In
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const router = useRouter();

function login() {
  if (email.value.toLowerCase().includes("doctor")) {
    router.push("/psych");
  } else {
    router.push("/patient");
  }
}
</script>
