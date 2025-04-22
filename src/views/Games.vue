<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref , reactive } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const items = ref([])
const router = useRouter()
let dateOnly = ref("")
let date = ref("");
//let startDateParam = date.value;
let startDate = ref("");
//startDateParam = startDate.value;
let endDate = ref("");
let endDateParam = endDate.value;
let pagesData = ref("");
let previousPage = ref("");
let cursors = [];

const user = userStore.username;

async function backButton (event) {
	event.preventDefault()

  const token = userStore.token;
    cursors.pop();
    let prevCursor = cursors.pop();
    console.log('previous',prevCursor)
	
		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/games?start_date=${startDate.value}&end_date=${endDate.value}&per_page=25`
    if(prevCursor != null) url += `&cursor=${prevCursor}`;

		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}

		let response = await fetch(url, options)	
		
		if (response.status === 200) {
			
      let data = await response.json()
      console.log("back",data)
      console.log(data.meta.prev_cursor)

      items.value = data.data;
      pagesData.value = data.meta.next_cursor;
      previousPage.value = data.meta.prev_cursor;

		}
	} 

  async function nextButton (event) {
	event.preventDefault()

  const token = userStore.token;
  
	
		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/games?start_date=${startDate.value}&end_date=${endDate.value}&per_page=25&cursor=${pagesData.value}`
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
      //console.log(data.meta.prev_cursor,data.meta.next_cursor)
      //cursors.push(data.meta.prev_cursor)
      //console.log(cursors)

      items.value = data.data;
      pagesData.value = data.meta.next_cursor;
      previousPage.value = data.meta.prev_cursor;

		}
	} 

/*const formatDate = (dateString) => {
	return new Date(dateString).toLocaleString("en-US", { month: "numeric", day: 'numeric', year:'numeric', timeZone: 'America/New_York' })
}*/

const formatDate = (dateString) => {
	return new Date(dateString).toLocaleString("en-US", { timeZone: 'America/New_York' }) + " EST"
}

async function rangeSearch (event) {
	event.preventDefault()

  const token = userStore.token;
  
	
		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/games?start_date=${startDate.value}&end_date=${endDate.value}`

		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}

		let response = await fetch(url, options)	
		
		if (response.status === 200) {
			
      let data = await response.json()
      console.log(startDate.value)
      console.log(data)

      items.value = data.data;
      pagesData.value = data.meta.next_cursor;
      previousPage.value = data.meta.prev_cursor;

		}
	} 

  async function dateSearch (event) {
	event.preventDefault()

  const token = userStore.token;
  
	
		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/games?start_date=${dateOnly.value}&end_date=${dateOnly.value}`

		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}

		let response = await fetch(url, options)	
		
		if (response.status === 200) {
			
      let data = await response.json()
      console.log(startDate.value)
      console.log(data)

      items.value = data.data;
      pagesData.value = data.meta.next_cursor;
      previousPage.value = data.meta.prev_cursor;

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
          <h1 class="fs-primary-heading">Games</h1>
          <section class="split">
            <div class="search">
              <div>
                <h2>Search by date of game:</h2>
                <label>Game Date:   </label>
                <input type="date" required id="date" v-model="dateOnly"><br><br>	
                
                <div class="centeredButton">
                    <button class="button" @click="dateSearch($event)">Search</button><br><br>
                </div>
              </div>
                
              <div>
                <h2>Search by range</h2>
                <label>Game Start Date:   </label>
                <input type="date" required id="startDate" v-model="startDate"><br><br>

                <label>Game End Date:   </label>
                <input type="date" required id="endDate" v-model="endDate"><br><br>

                <div class="centeredButton">
                    <button class="button" @click="rangeSearch($event)">Search</button>
                </div>
              </div>

            </div>


            <div class="results">
              <RouterLink v-for="item in items" :to="`/gamedetails/${item.id}`" class="player-link">
                <p>Date: {{ formatDate(item.datetime) }}</p>
                <p>{{ item.visitor_team.full_name}} vs. {{ item.home_team.full_name }}</p><br>
              </RouterLink>

              <div class="center inLineBlock">
                  <button class="button margin" @click="backButton($event)">Back</button>
                  <button class="button margin" @click="nextButton($event)">Next</button>
              </div>

              <!--:date="item.date" :HomeName="item.home_team.full_name" :AwayTeam="item.visitor_team.full_name"-->
            </div>
          </section>
      </section>
  </main>
</template>

<style scoped>

.inLineBlock {
    display: flex;
}

.margin {
  margin: 10px;
}

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
    float: right;
}

h2 {
    float: center;
    font-size: 20px;
    padding-bottom: 10px;
}
</style>