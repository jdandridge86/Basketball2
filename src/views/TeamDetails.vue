<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { onMounted, ref , reactive, watch } from 'vue'

const props = defineProps({ teamId: String })

const userStore = useUserStore();

//const stat = ref(null)
const C_record = ref(null)
const C_rank = ref(null)
const D_record = ref(null)
const D_rank = ref(null)
const wins = ref(null)
const losses = ref(null)
const homeRecord = ref(null)
const roadRecord = ref(null)

const conference = ref("");
const division = ref("");
const city = ref("");
const teamName = ref("");
const abbreviation = ref("");

const router = useRouter()
let season = ref("")
let seasonParam = season.value;
let favoriteTeam = ref(false);
let teams = ref("")

watch(favoriteTeam, (newValue) => {
  console.log("Favorite player changed to:", newValue);
});

function checkFavorite() {
  favoriteTeam.value = false;
  
  for (const team of teams.value) {
    if (team === props.teamId) {
      favoriteTeam.value = true;
      return; 
    }
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


async function toggleFavoritePlayer() {
  favoriteTeam.value = !favoriteTeam.value;
  console.log("Toggled to:", favoriteTeam.value);
  
  if (favoriteTeam.value === true) {
    await addFavoriteTeam();
  } else {
    await removeFavoriteTeam();
  }
}

async function addFavoriteTeam () {	

const data = {
  team_id: props.teamId
}
  
const token = userStore.token;

const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/favorite-teams`

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }

  let response = await fetch(url, options)	
  
  if (response.status === 201) {
   
    alert("Favorite Team Added")
  }
  else if (response.status === 400) {
    // TODO: Display error message to screen
    console.log("testing")
  }
}

async function removeFavoriteTeam () {	

const token = userStore.token;

const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/favorite-teams/${props.teamId}`

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  let response = await fetch(url, options)	
  
  if (response.status === 200) {
   
    alert("Favorite Team Removed")
  }
  else if (response.status === 400) {
    // TODO: Display error message to screen
    console.log("testing")
  }
}


const user = userStore.username;

async function getTeamDetails (teamId, seasonParam = "") {

  const token = userStore.token;
  
	
		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/teams/${props.teamId}?season=${seasonParam}`

		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}

		let response = await fetch(url, options)	
		
		if (response.status === 200) {
			
            let data = await response.json()
      
            console.log(data.standings)

            conference.value = data.team.conference;
            division.value = data.team.division;
            city.value = data.team.city;
            teamName.value = data.team.full_name;
            abbreviation.value = data.team.abbreviation;

            C_record.value = data.standings.conference_record;
            C_rank.value = data.standings.conference_rank;
            D_record.value = data.standings.division_record;
            D_rank.value = data.standings.division_rank;
            wins.value = data.standings.wins;
            losses.value = data.standings.losses;
            homeRecord.value = data.standings.home_record;
            roadRecord.value = data.standings.road_record;
            season.value = data.standings.season;


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

onMounted(async () => {
    getTeamDetails(props.teamId, undefined);
    try {
    await getFavoriteTeams();
    checkFavorite(); // This will run after getFavoritePlayers completes
  } catch (error) {
    // Handle any errors that might have occurred
    console.error("Failed to load favorite players:", error);
  }
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
          <div class="inLineBlock">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="50" height="55" class="star" :class="favoriteTeam ? 'filledStar' : 'emptyStar'" style="vertical-align: middle" @click="toggleFavoritePlayer">
            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
            </svg>
            <h1 class="fs-primary-heading">Team Details: {{ teamName }} ({{ abbreviation }})</h1>
          </div>
        </section>
        <section class="split">
            <div class="TeamDetails">
                <!--<div v-if="items.length > 0"> -->
                    <h2>Team Details</h2>
                    <p>Conference: {{ conference }}</p>
                    <p>Division: {{ division }}</p>
                    <p>City: {{ city }}</p>
                    
            </div>

            <div class="TeamStats">
                <div class="rightAlign"><label>Season:</label><input type="text" required id="season" v-model="season" @keyup.enter="getTeamDetails(props.teamId, season)"></div>
                <h2>Team Standings ({{ season }})</h2>
                <!--<div v-if="stat">
                  <p>Conference Rank: {{ stat.conference_rank }}</p>
                </div>   -->
                
                <p>
                  Conference Record: {{ C_record }}<br>
                  Conference Rank: {{ C_rank }}<br>
                  Division Record: {{ D_record }}<br>
                  Division Rank: {{ D_rank }}<br>
                  Wins: {{ wins }}<br>
                  Losses: {{ losses }}<br>
                  Home Record: {{ homeRecord }}<br>
                  Road Record: {{ roadRecord }}<br>
                </p>
                 
                                      

                
            </div>
        </section>
    </main>
  </template>

<style scoped>

body {
  font: Arial;

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

.TeamDetails {
  background-color: white;
  padding: 30px;
  margin-right: 20px;
}

.TeamStats {
  background-color: white;
  margin-left: 20px;
  padding: 30px;
  overflow-y: auto;
}

h2 {
    float: center;
    font-size: 30px;
}

.inLineBlock {
    display: flex;
}

.rightAlign {
    float: right;
}

.emptyStar {
  padding-right: 7px;
  fill: none;
  stroke: #E3B048;
  stroke-width: 20;
}

.filledStar {
  fill: #E3B048;
  padding-right: 7px;
}

</style>