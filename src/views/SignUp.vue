<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref , reactive } from 'vue'

const router = useRouter()

let email = ref("")
let userName = ref("")
let password = ref("")
let password2 = ref("")

async function join (event) {
	event.preventDefault()

	let errorMsg = document.querySelector("#errorMsg");

	// do some input validation
	if (email.value !== '' && userName.value !== '' && password.value !== '' && password2.value !== '') {
		
		if (password.value !== password2.value) {
			console.log(password.value)
			console.log(password2.value)
			errorMsg.textContent = "Passwords do not match"
			return
		}

		const data = {
			email: email.value,
			userName: userName.value,
			password: password.value
		}

		const url = 'https://hap-app-api.azurewebsites.net/user'

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}

		let response = await fetch(url, options)

		console.log(data)
		//console.log(response.status)

			
		if (response.status === 201) {
			//store username and token in local response
			const data = await response.json()
			
			userStore.setUser(
				data.user.firstName,
				data.user.lastName,
				data.user.userName,
				data.user.email,
				data.token
			)
			

			router.push({name: 'main'})
			
		}
		else if (response.status === 400) {
			// TODO: Display error message to screen
			console.log("Invalid email or password.")
			
			errorMsg.textContent = "Invalid email or password";
			
		}
	} else {
		errorMsg.textContent = "Please complete all field"
	}
}
</script>

<template>
  <Header class="header">
    <nav>
      <div><RouterLink to="/">Home</RouterLink></div>
      <div><RouterLink to="/signin">Sign In</RouterLink></div>
    </nav>
  </Header>

  <main class="padding-block-700">
      <section class="container center vertical">
          <h1 class="fs-primary-heading">Sign Up</h1>
          <form>
				<fieldset>
					<label>Username:   </label>
					<input type="username" required id="username" v-model="userName"><br /><br />					

					<label>Email:   </label>
					<input type="email" required id="email" v-model="email"><br /><br />

					<label>Password:   </label>
					<input type="password" minlength="8" required id="password" v-model="password"><br /><br />

					<label>Confirm Password:   </label>
					<input type="password" minlength="8" required id="password2" v-model="password2"><br /><br />
					
					<div id="errorMsg"></div>

					<div class="centeredButton">
            <button class="button" @click="join">Sign Up</button>
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