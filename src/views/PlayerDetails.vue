<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
//import { defineProps } from 'vue';
import { onMounted, ref , reactive } from 'vue'
import Modal from '@/components/Modal.vue';

const props = defineProps({ playerId: String })

// Modal
const modal = ref(null)
const userStore = useUserStore();


function cancel(e) {
	modal.value.close(e)
}

function save(e) {
  placeBet()
	modal.value.close(e)
}

const selectGame = (gameId) => {
  selectedGameId.value = gameId;
  modal.value.open()
  console.log('Selected game ID:', gameId);
};


const items = ref([])
const things = ref([])
const stats = ref([])
const router = useRouter()
let season = ref("")
let seasonParam = season.value;
let points = ref("");
let assists = ref("");
let rebounds = ref("");
let threes = ref("");
let steals = ref("");
let startDate = ref("");
let endDate = ref("");
const selectedGameId = ref(null);

const user = userStore.username;

async function dateAndPlayerSearch() {
  const token = userStore.token;
  
	
		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/games/${props.playerId}/${startDate.value}/${endDate.value}`
    

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

      things.value = data.data;
		}

	} 

  
async function placeBet () {	

  const data = {
    gameId: selectedGameId.value,
    playerId: props.playerId,
    predictions: {
      points: points.value,
      assists: assists.value,
      rebounds: rebounds.value,
      threes: threes.value,
      steals: steals.value
    }
	}

  
  const token = userStore.token;
	
	const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/bets`

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
			
			alert("Your bet was saved")
		}
		else if (response.status === 400) {
			// TODO: Display error message to screen
			console.log("testing:")
		}
	}

async function getPlayerDetails (playerId, seasonParam = "") {

  const token = userStore.token;
  
	
		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/players/${props.playerId}?season=${seasonParam}`

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

      items.value = data.player;
      stats.value = data.stats.data;     


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
    getPlayerDetails(props.playerId, undefined);
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
        <div><RouterLink to="/favorites">Favorites</RouterLink></div>
        <div><a @click="logout">Log Out</a></div>
        <div><a @click="deleteUser">Delete Account</a></div>
      </nav>
    </Header>
  
    <main class="padding-block-700">
        <section class="container center vertical">
            <div v-for="item in items" :playerFirst="item.first_name" :playerLast="item.last_name" class="inLineBlock">
                <h1 class="fs-primary-heading space">Player Details:  {{ item.first_name }} {{ item.last_name }}</h1>
            </div>
            
        </section>
        <section class="split">
            <div class="TeamDetails">
                <div class="UpcomingGames">
                  <h2>Upcoming Games</h2>
                  <label>Game Start Date:   </label><br>
                  <input type="date" required id="startDate" v-model="startDate"><br><br>
                  <label>Game End Date:   </label><br>
                  <input type="date" required id="endDate" v-model="endDate"><br><br>
                  <div><button class="button" @click="dateAndPlayerSearch($event)">Search</button></div><br><br>
                  <!--<div v-for="thing in things" :key="thing.id" @click="modal.open()" class="player-link">            
                    <p>{{ thing.visitor_team.full_name }} vs {{ thing.home_team.full_name }}</p>
                    <p>{{ thing.datetime }}</p>
                    <p>{{ thing.id }}</p><br>
                  </div>-->
                  <div v-for="thing in things" :key="thing.id" @click="selectGame(thing.id)" class="player-link" :class="{ 'selected': selectedGameId === thing.id }">
                    <p>{{ thing.visitor_team.full_name }} vs {{ thing.home_team.full_name }}</p>
                    <p>{{ thing.datetime }}</p><br>
                    <!--<p>Game ID: {{ thing.id }}</p>-->
                  </div>

                  <div v-if="selectedGameId" class="selected-game-info">
                    <!--<p>Selected Game ID: {{ selectedGameId }}</p>
                     Add any actions for the selected game -->
                    <button class="button" @click="modal.open()">Bet</button>
                  </div>
                </div>
            </div>

            <div class="playerDetails">
                <div class="rightAlign"><label class="space">Season:</label><input type="text" required id="season" v-model="season" @keyup.enter="getPlayerDetails(props.playerId, season)"></div>
                    
                <div v-for="stat in stats" :assists="stat.ast"> 
                    <h2>Stats: {{ stat.season }} Average Per Game</h2>                       

                    <p>Number of Games Played: {{ stat.games_played }}</p>
                    <p>Minutes Played: {{ stat.min }}</p>
                    <p>Offensive Rebounds: {{ stat.oreb }}</p>
                    <p>Defensive Rebounds: {{ stat.dreb }}</p>
                    <p>Total Rebounds: {{ stat.reb }}</p>
                    <p>Assists: {{stat.ast}}</p>
                    <p>Blocks: {{ stat.blk }}</p>
                    <p>Steals: {{ stat.stl }}</p>
                    <p>Turnovers: {{ stat.turnover }}</p>
                    <p>Personal Fouls: {{ stat.pf }}</p>
                    <p>Total Points Scored: {{ stat.pts }}</p><br>            

                    <p>Percent of 3-Point Field Goals: {{ stat.fg3_pct }}</p>
                    <p>3-Point Field Goals Attempted: {{ stat.fg3a }}</p>
                    <p>3-Point Field Goals Made: {{ stat.fg3m }}</p><br>

                    <p>Field Goal Percentage: {{ stat.fg_pct }}</p>
                    <p>Field Goals Attempted: {{ stat.fga }}</p>
                    <p>Field Goals Made: {{ stat.fgm }}</p><br>

                    <p>Free Throw Percentage: {{ stat.ft_pct }}</p>
                    <p>Free Throws Attempted: {{ stat.fta }}</p>
                    <p>Free Throws Made: {{ stat.ftm }}</p><br>
                </div>
                <div class="inlineGrid">
                  <div v-for="item in items" :TeamName="item.team.full_name" :abbreviation="item.abbreviation" :city="item.city" :conference="item.conference" :division="item.division" class="border">
                      <h2>Player Details</h2>
                      <p>College: {{ item.college }}</p>
                      <p>Country: {{  item.country }}</p><br>

                      <p>Draft Year: {{ item.draft_year }}</p>
                      <p>Draft Round: {{ item.draft_round }}</p>
                      <p>Draft Number: {{ item.draft_number }}</p><br>

                      <p>Height: {{ item.height  }}</p>
                      <p>Weight: {{ item.weight }}</p><br>

                      <p>Jersey Number: {{ item.jersey_number }}</p>
                      <p>Position: {{ item.position }}</p><br>
                  </div>
                  <div v-for="item in items" :TeamName="item.team.full_name" :abbreviation="item.abbreviation" :city="item.city" :conference="item.conference" :division="item.division">            
                      <h2>Team Details</h2>
                      <p>{{ item.team.full_name }}</p>
                      <p>Abbreviation: {{ item.team.abbreviation }}</p>
                      <p>City: {{  item.team.city }}</p>
                      <p>Conference: {{ item.team.conference }}</p>
                      <p>Division: {{ item.team.division}}</p><br>
                  </div>
                </div>
            </div>
        </section>
    </main>

    <Modal ref="modal">
        <template #header>
            <h2 class="yellow">Place a Bet</h2>
        </template>
        <template #main>
            <input v-model="points" type="text" placeholder="points"><br>
            <input v-model="assists" type="text" placeholder="assists"><br>
            <input v-model="rebounds" type="text" placeholder="rebounds"><br>
            <input v-model="threes" type="text" placeholder="threes"><br>
            <input v-model="steals" type="text" placeholder="steals"><br>
        </template>
        <template #footer>
            <button @click.stop="cancel">Cancel</button>
            <button @click.stop="save">Save</button>
        </template>
	</Modal>
  </template>

<style scoped>

.border {
  border-right: 2px solid black;
}

.inlineGrid {
  display: inline-grid;
  grid-template-columns: repeat(2, 300px); /* Three columns, each 50px wide */
  grid-gap: 80px; /* 10px gap between cells */
}

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
  grid-template-rows: 1000px 1000px;
}

.TeamDetails {
  background-color: white;
  padding: 30px;
  margin-right: 20px;
}

.playerDetails {
  background-color: white;
  margin-left: 20px;
  padding: 30px;
  overflow-y: auto;
}

h2 {
    float: center;
    font-size: 30px;
    padding-bottom: 10px;
}

.inLineBlock {
    display: flex;
}

.rightAlign {
    float: right;
}

.space {
  margin-right: 15px;
}

.yellow {
  color: #E3B048
}

</style>