<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { onMounted, ref , reactive } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const router = useRouter()

const user = userStore.username;
const players = ref([])
const teams = ref([])

async function getFavoritePlayers() {	

const token = userStore.token;

const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/favorite-players`

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  let response = await fetch(url, options)	
  
  if (response.status === 200) {
    let data = await response.json()
    players.value = data;
   
    console.log(data)
  }
  else if (response.status === 401) {
    // TODO: Display error message to screen
    console.log("error")
  }
}

async function getFavoriteTeams() {	

const token = userStore.token;

const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/favorite-teams`

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  let response = await fetch(url, options)	
  
  if (response.status === 200) {
    let data = await response.json()
    teams.value = data;
   
    console.log(data)
  }
  else if (response.status === 401) {
    // TODO: Display error message to screen
    console.log("error")
  }
}


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

onMounted(() => {
    getFavoritePlayers();
    getFavoriteTeams();
})

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
      <div><a href="#" @click="logout">Log Out</a></div>
      <div><a href="#" @click="deleteUser">Delete Account</a></div>
    </nav>
  </Header>

  <main class="padding-block-700">
      <section class="container center vertical">
        <!--"container center vertical"-->
          <h1 class="fs-primary-heading">Welcome, {{ user }}!</h1>
          <section class="split">
            <div class="search">
              <div>
                <h2>Favorite Players</h2>
                <RouterLink v-for="player in players" :to="`/playerdetails/${player}`" class="player-link">
                  <p> {{ userStore.myPID[player] }} </p><br>
                </RouterLink>
                
              </div>
                
              <div>
                <h2>Favorite Team</h2>
                <RouterLink v-for="team in teams" :to="`/teamdetails/${team}`" class="player-link">
                  <p>{{ team }}</p><br>
                </RouterLink>
                
              </div>

            </div>


            <div class="results">
              

              
            </div>
          </section>
      </section>
  </main>
</template>

<style scoped>
body {
  font: Arial;
  font-size: 14px;

}
:deep(a) {
  text-decoration: none;
  color: black;
}

h1 {
  margin-bottom: 30px;
}

.split {
  display: grid;
  grid-template-columns: 1fr 2fr;

  grid-template-areas: "search results";
  grid-template-rows: 500px 500px;
}

.search {
  background-color: white;
  padding: 50px;
  margin-right: 20px;
}

.results {
  background-color: white;
  margin-left: 20px;
  padding: 25px;
  overflow-y: auto;
}

.space {
  padding: 25px;
}
</style>