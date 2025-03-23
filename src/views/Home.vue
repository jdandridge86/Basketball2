<script setup>
import Header from '../components/Header.vue'

import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template class="body">
  <Header class="header">
    <nav>
      <div><RouterLink to="/signin">Sign In</RouterLink></div>
      <div><RouterLink to="/signup">Sign Up</RouterLink></div>
    </nav>
  </Header>

  <main class="padding-block-700">
      <section class="container center vertical">
          <h1 class="fs-primary-heading">Welcome to All Net</h1>
          <p>"All Net - Where Every Bet is a Slam Dunk"</p>
      </section>
  </main>
</template>

<style scoped>
:deep(a) {
  text-decoration: none;
  color: black;
}

p {
  color: white;
  font-size: 20px;
}
</style>
