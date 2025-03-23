<script setup>
import Header from '../components/Header.vue'
</script>

<template>
  <Header class="header">
    <nav>
      <RouterLink to="/signin">Sign In</RouterLink>
    </nav>
  </Header>

  <main class="padding-block-700">
      <section class="container center vertical">
          <h1 class="fs-primary-heading">Games</h1>
      </section>
  </main>
</template>

<style scoped>
:deep(a) {
  text-decoration: none;
  color: black;
}
</style>