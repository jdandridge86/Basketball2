<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref , reactive } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const router = useRouter()

const user = userStore.username;


async function logout (event) {
	event.preventDefault()

  const token = userStore.token;
	
		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/user/logout`

		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
			},
		}

		let response = await fetch(url, options)	
		
		if (response.status === 200) {
			
			router.push({
				name: 'home'
			})
		}
		else if (response.status === 500) {
			// TODO: Display error message to screen
			console.log("Invalid email or password.")
		}
	} 


  //Function to Delete Account
  async function deleteUser (event) {
    event.preventDefault()

    const token = userStore.token;
    const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/user/me`

    let result = confirm("Please confirm you want to delete your account?")

    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    if (result) {
      let response = await fetch(url, options)	
      
      if (response.status === 200) {
               
        userStore.$reset();
              
        router.push({
          name: 'home'
        })
      } else {
        console.log("HTTP-Error: " + response.status)
        console.log(`Bearer ${token}`)
        console.log(token)
      }
    }
    else {
      console.log("No was clicked")
    }
}

</script>

<template>
  <Header class="header">
    <nav>
      <div><RouterLink to="/profile">Profile</RouterLink></div>
      <div><RouterLink to="/games">Games</RouterLink></div>
      <div><RouterLink to="/players">Players</RouterLink></div>
      <div><RouterLink to="/teams">Teams</RouterLink></div>
      <div><RouterLink to="/bets">Bets</RouterLink></div>
      <div><RouterLink to="/favorites">Favorites</RouterLink></div>
      <div><a @click="logout">Log Out</a></div>
      <div><a @click="deleteUser">Delete Account</a></div>
    </nav>
  </Header>

  <main class="padding-block-700">
      <section class="container center vertical">
          <h1 class="fs-primary-heading">Profile</h1>
          <form>
				<fieldset>
					<label>Username:   </label>
					<input type="username" required id="username" v-model="username"><br /><br />					

					<label>Email:   </label>
					<input type="email" required id="email" v-model="email"><br /><br />

					<label>Password:   </label>
					<input type="password" minlength="8" required id="password" v-model="password"><br /><br />

					<div class="centeredButton">
            <button class="button" @click="join">Edit Profile</button>
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