<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
//import { defineProps } from 'vue';
import { onMounted, ref , reactive, watch } from 'vue'
import Modal from '@/components/Modal.vue';
import { computed } from 'vue'

const props = defineProps({ playerId: String })

//Modal
const modal = ref(null)
const userStore = useUserStore();


function cancel(e) {
	modal.value.close(e)
}

function save(e) {
  placeBet()
	modal.value.close(e)
}

/*const formatDate = (dateString) => {
	return new Date(dateString).toLocaleString("en-US", { month: "numeric", day: 'numeric', year:'numeric' })
}*/

const formatDate = (dateString) => {
	return new Date(dateString).toLocaleString("en-US", { timeZone: 'America/New_York' }) + " EST"
}

const selectGame = (gameId, visitorName, homeName, date) => {
  selectedGame.id = gameId;
  selectedGame.visitorName = visitorName;
  selectedGame.homeName = homeName;
  selectedGame.date = date;
  modal.value.open();
  console.log('Selected game:', selectedGame);
};


const items = ref([])
const storeFirstName = ref("")
const storeLastName = ref("")
const things = ref([])
const stats = ref([])
const router = useRouter()
let season = ref("")
let points = ref("");
let assists = ref("");
let rebounds = ref("");
let threes = ref("");
let steals = ref("");
let startDate = ref("");
let endDate = ref("");
let favoritePlayer = ref(false);

/*const startDate = (dateString) => {
	return new Date(dateString).toLocaleString("en-US", { year:'numeric', month: "numeric", day: 'numeric' })
}*/

const selectedGame = reactive({
  id: null,
  visitorName: null,
  homeName: null,
  date: null
});

const user = userStore.username;

const fullName = computed(() => {
  return `${storeFirstName.value} ${storeLastName.value}`
});


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

  watch(favoritePlayer, (newValue) => {
  console.log("Favorite player changed to:", newValue);
});
  

async function toggleFavoritePlayer() {
  favoritePlayer.value = !favoritePlayer.value;
  console.log("Toggled to:", favoritePlayer.value);
  
  if (favoritePlayer.value === true) {
    await addFavoritePlayer();
  } else {
    await removeFavoritePlayer();
  }
}

async function addFavoritePlayer () {	

const data = {
  player_id: props.playerId
}
  
const token = userStore.token;

const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/favorite-players`

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
   
    alert("Favorite Player Added")
  }
  else if (response.status === 400) {
    // TODO: Display error message to screen
    console.log("testing")
  }
}

async function removeFavoritePlayer () {	

const token = userStore.token;

const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/favorite-players/${props.playerId}`

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  let response = await fetch(url, options)	
  
  if (response.status === 200) {
   
    alert("Favorite Player Removed")
  }
  else if (response.status === 400) {
    // TODO: Display error message to screen
    console.log("testing")
  }
}

  
async function placeBet () {	

  const data = {
    gameId: selectedGame.id,
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
      userStore.setPID(props.playerId, fullName.value);
      console.log(props.playerId, fullName.value)

      //userStore.setGameInfo(gameId.value, visitorName.value, homeName.value, date.value);
      userStore.setGameInfo(selectedGame.id, selectedGame.visitorName, selectedGame.homeName, selectedGame.date);
      console.log(selectedGame.id, selectedGame.visitorName, selectedGame.homeName, selectedGame.date)
			
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
      //console.log(data.player.data.last_name)
      console.log(data.stats)
     

      items.value = data.player;
      stats.value = data.stats.data;  
      storeFirstName.value = data.player.data.first_name;  
      storeLastName.value = data.player.data.last_name; 
      
      
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
        <div><a href="#" @click="logout">Log Out</a></div>
        <div><a href="#" @click="deleteUser">Delete Account</a></div>
      </nav>
    </Header>
  
    <main class="padding-block-700">
        <section class="container center vertical">
            <div v-for="item in items" :playerFirst="item.first_name" :playerLast="item.last_name" class="inLineBlock">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="50" height="55" class="star" :class="favoritePlayer ? 'filledStar' : 'emptyStar'" style="vertical-align: middle" @click="toggleFavoritePlayer">
              <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
              </svg>
                <h1 class="fs-primary-heading space">Player Details:  {{ item.first_name }} {{ item.last_name }}</h1>
            </div>
            
        </section>
        <section class="split">
            <div class="TeamDetails">
                <div class="UpcomingGames">
                  <h2>Bet on Upcoming Games</h2>
                  <label>Game Start Date:   </label>
                  <input type="date" required id="startDate" v-model="startDate"><br><br>
                  <label>Game End Date:   </label>
                  <input type="date" required id="endDate" v-model="endDate"><br><br>
                  <div class="center"><button class="button" @click="dateAndPlayerSearch($event)">Search</button></div><br><br>
                  <!--<div v-for="thing in things" :key="thing.id" @click="modal.open()" class="player-link">            
                    <p>{{ thing.visitor_team.full_name }} vs {{ thing.home_team.full_name }}</p>
                    <p>{{ thing.datetime }}</p>
                    <p>{{ thing.id }}</p><br>
                  </div>-->
                  <div v-for="thing in things" :key="thing.id"  @click="selectGame(thing.id, thing.visitor_team.full_name, thing.home_team.full_name,thing.datetime)" class="player-link" :class="{ 'selected': selectedGame.id === thing.id }">
                    <p class="cursor">{{ thing.visitor_team.full_name }} vs {{ thing.home_team.full_name }}</p>
                    <p class="cursor">{{ formatDate(thing.datetime) }}</p><br>
                    <!--<p>Game ID: {{ thing.id }}</p>-->
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
            <h2 class="yellow">Place a Bet: {{ fullName }}<br>
            {{ selectedGame.visitorName}} vs {{selectedGame.homeName }}<br>
            {{ formatDate(selectedGame.date) }}</h2>
        </template>
        <template #main>
            <div class="inLineBlock center"><input v-model="points" type="text" placeholder="points"></div><br>
            <div class="inLineBlock center"><input v-model="assists" type="text" placeholder="assists"></div><br>
            <div class="inLineBlock center"><input v-model="rebounds" type="text" placeholder="rebounds"></div><br>
            <div class="inLineBlock center"><input v-model="threes" type="text" placeholder="threes"></div><br>
            <div class="inLineBlock center"><input v-model="steals" type="text" placeholder="steals"></div><br>
        </template>
        <template #footer>
            <button class="margin-right padding" @click.stop="cancel">Cancel</button>
            <button class="padding" @click.stop="save">Save</button>
        </template>
	</Modal>
  </template>

<style scoped>

.margin-right {
  margin-right: 10px;
}

.padding {
  padding: 5px;
}

.border {
  border-right: 2px solid black;
}

.inlineGrid {
  display: inline-grid;
  grid-template-columns: repeat(2, 300px); /* Three columns, each 50px wide */
  grid-gap: 80px; /* 10px gap between cells */
}
.cursor {
  cursor: pointer;
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
    text-align: center;
    font-size: 27px;
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

input {
    background-color: lightgrey;
    float: right;
}
</style>