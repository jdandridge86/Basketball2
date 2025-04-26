<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref , reactive } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const router = useRouter()

const user = userStore.username;

const items = ref([])
let teamName = ref("");
let teamNameParam = teamName.value;
let conference = ref("");
let conferenceParam = conference.value;
let teamSearchLength = ref();

async function teamSearch (event, teamNameParam = "", conferenceParam = "") {
	event.preventDefault()

  const token = userStore.token;
  
	
		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/teams?team-search=${teamNameParam}&conference=${conferenceParam}`

		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}

		let response = await fetch(url, options)	
		
		if (response.status === 200) {
			
      let data = await response.json()
      console.log(data)

      items.value = data.data;
      teamSearchLength.value = data.data.length;

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

</script>

<template>
  <Header class="header">
    <nav>
      <div><RouterLink to="/profile">Profile</RouterLink></div>
      <div><RouterLink to="/games">Games</RouterLink></div>
      <div><RouterLink to="/players">Players</RouterLink></div>
      <div><RouterLink to="/teams">Teams</RouterLink></div>
      <div><RouterLink to="/bets">Bets</RouterLink></div>
      <div><a href="#" @click="logout">Log Out</a></div>
      <div><a href="#" @click="deleteUser">Delete Account</a></div>
    </nav>
  </Header>

  <main class="padding-block-700">
      <section class="container center vertical">
        <!--"container center vertical"-->
          <h1 class="fs-primary-heading">Teams</h1>
          <section class="split">
            <div class="search">
              <label>Team Name:   </label>
              <input type="text" required id="teamName" v-model="teamName"><br><br>				

              <div class="centeredButton">
                  <button class="button" @click="teamSearch($event, teamName, undefined)">Search</button>
              </div>

              <div class="space">Browse Teams by Conference</div>
                <div class="space">
                  <button class="button" @click="teamSearch($event, undefined, 'east')">East Conference</button><br><br>
      
                  <button class="button" @click="teamSearch($event, undefined, 'west')">West Conference</button>
              </div>

            </div>


            <div class="results">
              <div v-if="teamSearchLength === 0">No Teams Found</div>
              <RouterLink v-for="item in items" :to="`/teamdetails/${item.id}`" class="player-link">
                <p>Team Name: {{ item.full_name}}</p>
                <p>Abbreviation: {{ item.abbreviation }}</p>
                <p>City: {{  item.city }}</p>
                <p>Conference: {{ item.conference }}</p>
                <p>Division: {{ item.division }}</p><br>
              </RouterLink>



              <!--<div v-for="item in items" :TeamName="item.full_name">
                <p>Team Name: {{ item.full_name}}</p>
                <p>Abbreviation: {{ item.abbreviation }}</p>
                <p>City: {{  item.city }}</p>
                <p>Conference: {{ item.conference }}</p>
                <p>Division: {{ item.division }}</p><br>-->
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

input {
    background-color: lightgrey;
}
</style>