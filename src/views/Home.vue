<script setup>
import Header from '../components/Header.vue'

import { useRouter } from 'vue-router'

const router = useRouter()

</script>

<template class="body">
  <Header class="header">
    <nav>
      <div><RouterLink to="/signin">Sign In</RouterLink></div>
      <div><RouterLink to="/signup">Register</RouterLink></div>
    </nav>
  </Header>

  <main class="padding-block-700">
      <section class="container center vertical">
          <h1 class="fs-primary-heading">Welcome to All Net</h1>
          <p>"All Net - Where Every Bet is a Slam Dunk"</p>
          
            <img src="/src/assets/Basketball.png" class="ball">
  
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

.ball {
  margin: 150px;

  animation: smoothbounceball 0.5s;
  animation-direction: alternate;
  animation-timing-function: cubic-bezier(.5, 0.05, 1, .5);
  animation-iteration-count: infinite;
}

@keyframes smoothbounceball {
  from { transform: translate3d(0, 0, 0);}
  to{ transform: translate3d(0, 200px, 0);}
}

</style>
