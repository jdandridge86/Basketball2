<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { onMounted, ref , reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const userStore = useUserStore();

const router = useRouter()

const items = ref([])
const user = userStore.username;
const players = ref([])
const teams = ref([])
const selectedPlayer = ref(null)
const selectedTeam = ref(null)
let teamName = ref("")
const teamMap = reactive({});



/*const formatDate = (dateString) => {
	return new Date(dateString).toLocaleString("en-US", { month: "numeric", day: 'numeric', year:'numeric' })
}*/

const formatDate = (dateString) => {
	return new Date(dateString).toLocaleString("en-US", { timeZone: 'America/New_York' }) + " EST"
}

function getTodaysDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  console.log(formattedDate);
  return formattedDate;
}


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
    players.value = data.favoritePlayers;

     
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
    teams.value = data.favoriteTeams;
   
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

async function dateSearch (event, dateOnly) {
  event.preventDefault();
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
      
      console.log(data)

      items.value = data.data;

		}
	} 
  
  function getPlayerName(playerId) {
  // Check if we already have the player data
  if (!userStore.myPID[playerId]) {
    // If not, fetch it - but this won't be immediately available
    getPlayerDetails(playerId);
    return 'Loading...';
  }
  
  // Return the player name from the store
  const player = userStore.myPID[playerId];
  return `${player.firstName || ''} ${player.lastName || ''}`;
}

function getTeamName(teamId) {
  if (!teamMap[teamId]) {
    // Fetch it if not available yet
    getTeamDetails(teamId);
    return 'Loading...';
  }

  return teamMap[teamId];
}


async function getPlayerDetails (playerId) {

const token = userStore.token;


  const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/players/${playerId}`

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }

  let response = await fetch(url, options)	
  
  if (response.status === 200) {
    
    let data = await response.json()
    //console.log(data.player.data.last_name)
    console.log(data.stats)
   
    userStore.myPID[playerId] = {
    firstName: data.player.data.first_name, 
    lastName: data.player.data.last_name
    };
  }
}

async function getTeamDetails(teamId) {
  const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/teams/${teamId}`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let response = await fetch(url, options);

  if (response.status === 200) {
    let data = await response.json();

    // Store full name in teamMap
    teamMap[teamId] = data.team.full_name;
  }
}

  onMounted(async () => {
  await getFavoritePlayers();
  
  await getFavoriteTeams();
  

  const date = await getTodaysDate();
  
  // Create a reactive reference to hold the date
  const dateOnly = ref(date);
  
  // Create a mock event object since there's no actual event
  const mockEvent = {
    preventDefault: () => {}
  };
  
  // Call dateSearch with the proper parameters
  dateSearch(mockEvent, dateOnly);
});

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
          <h1 class="fs-primary-heading">Welcome, {{ user }}!</h1>
          <section class="split">
            <div class="search">
              <div>
                <h2>Favorite Players</h2>
                  <RouterLink v-for="player in players" :to="`/playerdetails/${player}`" class="player-link" @click="() => selectedPlayer = player">
                    <p>{{ getPlayerName(player) }}</p><br>
                  </RouterLink>
              </div>

                
              <div>
                <h2>Favorite Team</h2>
                <RouterLink v-for="team in teams" :to="`/teamdetails/${team}`" class="player-link" @click="() => selectedTeam = team">
                  <p>{{ getTeamName(team) }}</p><br>
                </RouterLink>
                
              </div>

            </div>


            <div class="results">
              <h2 class="center">Today's Games</h2>
              <div v-for="item in items" :to="`/gamedetails/${item.id}`">
                <p>Date & Time: {{ formatDate(item.datetime) }}</p>
                <p>{{ item.visitor_team.full_name}} vs. {{ item.home_team.full_name }}</p><br>
              </div>           
            </div>
          </section>
      </section>
  </main>
</template>

<style scoped>
.player-item {
  display: block;
  margin-bottom: 5px;
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

h2 {
    float: center;
    font-size: 30px;
    padding-bottom: 10px;
}
</style>