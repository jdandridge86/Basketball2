<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref , reactive } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const items = ref([])
let pagesData = ref("")
//let pagesDataParam = pagesData.value;
let previousPage = ref("");
//let previousPageParam = previousPage.value;
const router = useRouter()
let playerName = ref("");
//let playerNameParam = playerName.value;

const user = userStore.username;

let cursors = [];

async function PlayerSearch (event) {
	event.preventDefault()

  const token = userStore.token;
  
	
		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/players?name-search=${playerName.value}&per_page=25&cursor=${pagesData.value}`

		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}

		let response = await fetch(url, options)	
		
		if (response.status === 200) {
			
      let data = await response.json()
      //console.log(data)
      console.log(data.meta.prev_cursor,data.meta.next_cursor)
      cursors.push(data.meta.prev_cursor)
      console.log(cursors)

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
  
  async function backButton (event) {
	event.preventDefault()

  const token = userStore.token;
    cursors.pop();
    let prevCursor = cursors.pop();
    console.log('previous',prevCursor)
	
		let url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/players?name-search=${playerName.value}&per_page=25`
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
          <h1 class="fs-primary-heading">Players</h1>
          <section class="split">
            <div class="search">
              <label>Player's Name:   </label><br>
              <input type="text" required id="playerName" v-model="playerName"><br><br>				

              <div class="centeredButton">
                  <button class="button" @click="PlayerSearch($event)">Search</button>
              </div>

            </div>


            <div class="results">
              <RouterLink v-for="item in items" :to="`/playerdetails/${item.id}`" class="player-link">
                <p>Player's Name: {{ item.first_name}} {{ item.last_name }}</p>
                <p>Team's Name: {{ item.team.full_name }}</p><br>
              </RouterLink>

              <div class="centeredButton">
                  <button class="button" @click="backButton($event)">Back</button>
              </div>

              <div class="centeredButton">
                  <button class="button" @click="PlayerSearch($event)">Next Page</button>
              </div>



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