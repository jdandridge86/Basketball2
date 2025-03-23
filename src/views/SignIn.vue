<script setup>
import Header from '../components/Header.vue'
</script>

<template>
  <Header class="header">
    <nav>
      <div><RouterLink to="/">Home</RouterLink></div>
      <div><RouterLink to="/signup">Sign Up</RouterLink></div>
    </nav>
  </Header>

  <main class="padding-block-700">
      <section class="container center vertical">
          <h1 class="fs-primary-heading">Log In</h1>
          <form>
				<fieldset>
					<label>Email:   </label>
					<input type="email" required id="email" v-model="email"><br /><br />

					<label>Password:   </label>
					<input type="password" minlength="8" required id="password" v-model="password"><br /><br />

					<div id="errorMsg"></div>

					<div class="centeredButton">
            <button class="button" @click="signIn">Sign In</button>
          </div>

				</fieldset>
			</form>
      </section>
  </main>
</template>

<style scoped>
:deep(a) {
  text-decoration: none;
  color: black;
}
</style>