<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref , reactive } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const router = useRouter()


let email = ref ("");
let password = ref("");


async function signIn (event) {
	event.preventDefault()
	let errorMsg = document.querySelector("#errorMsg");

	if (email.value !== '' && password.value !== ''){
		
		const data = { 
			email: email.value, 
			password: password.value 
		}
		console.log(data)

		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/user/login`

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}

		let response = await fetch(url, options)	
		
		if (response.status === 200) {
			const data = await response.json()

			userStore.setUser(
				data.user.username,
				data.user.email,
				data.token
			)

			console.log(data.user.username)
			console.log(data.user.email)
			console.log(data.token)

			router.push({
				name: 'main'
			})
		}
		else if (response.status === 400) {
			// TODO: Display error message to screen
			console.log("Invalid email or password.")
			errorMsg.textContent = "Invalid email or password";
		}
	} else {
		errorMsg.textContent = "Please complete all fields"
	}

}

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

input {
    background-color: lightgrey;
    float: right;
}
</style>