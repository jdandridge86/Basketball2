<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { onMounted, ref , reactive } from 'vue'
import { computed } from 'vue'

const userStore = useUserStore();

const router = useRouter()
const props = defineProps({
  playerId: String,
  gameId: String 
});

const user = userStore.username;
let players = ref([])
let playerName = ref("")
//let firstName = ref("")
//let lastName = ref("")
let items = ref([])
let AvgPoints = ref();
let AvgAssists = ref();
let AvgScore = ref();
let AvgRebound = ref();
let AvgSteals = ref();
let AvgThrees = ref();



 const completedItems = computed(() => {
  const filtered = items.value.filter(item => item.status === "completed");
  console.log("Inside computed property, filtered items:", filtered);
  return filtered;
});

const pendingItems = computed(() => {
  const filtered2 = items.value.filter(item => item.status === "pending");
  console.log("Inside computed property, filtered items:", filtered2);
  return filtered2;
});


function calculateAverage(event) {
  event.preventDefault();
  console.log("All items:", items.value);
  console.log("Completed items:", completedItems.value);
  
  if (completedItems.value.length === 0) {
    console.log("No completed items found");
    return;
  }
  
  // Initialize variables to store totals
  let totalPointsDiff = 0;
  let totalAssistsDiff = 0;
  let totalReboundsDiff = 0;
  let totalStealsDiff = 0;
  let totalThreesDiff = 0;
  let totalScore = 0;
  
  // Calculate sums for all completed items
  completedItems.value.forEach(item => {
    totalPointsDiff += Math.abs(item.predictions.points - item.actualStats.points);
    totalAssistsDiff += Math.abs(item.predictions.assists - item.actualStats.assists);
    totalReboundsDiff += Math.abs(item.predictions.rebounds - item.actualStats.rebounds);
    totalStealsDiff += Math.abs(item.predictions.steals - item.actualStats.steals);
    totalThreesDiff += Math.abs(item.predictions.threes - item.actualStats.threes);
    totalScore += item.score || 0; // Add safety check in case score is undefined
  });
  
  // Calculate averages
  const avgPointsDiff = (totalPointsDiff / completedItems.value.length).toFixed(2);
  const avgAssistsDiff = (totalAssistsDiff / completedItems.value.length).toFixed(2);
  const avgReboundsDiff = (totalReboundsDiff / completedItems.value.length).toFixed(2);
  const avgStealsDiff = (totalStealsDiff / completedItems.value.length).toFixed(2);
  const avgThreesDiff = (totalThreesDiff / completedItems.value.length).toFixed(2);
  const avgScore = (totalScore / completedItems.value.length).toFixed(2);
  
  console.log("Average Points Difference:", avgPointsDiff);
  console.log("Average Assists Difference:", avgAssistsDiff);
  console.log("Average Rebounds Difference:", avgReboundsDiff);
  console.log("Average Steals Difference:", avgStealsDiff);
  console.log("Average Threes Difference:", avgThreesDiff);
  console.log("Average Score:", avgScore);

  AvgPoints.value = avgPointsDiff;
  AvgAssists.value = avgAssistsDiff;
  AvgRebound.value = avgReboundsDiff;
  AvgSteals.value = avgStealsDiff;
  AvgThrees.value = avgThreesDiff;
  AvgScore.value = avgScore;
  console.log("Available IDs in myPID:", Object.keys(userStore.myPID));
  console.log("Available IDs in myGameInfo:", Object.keys(userStore.myGameInfo));

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

async function getGameDetails (gameId) {

const token = userStore.token;


  const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/games/${gameId}`

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
    console.log(data)
   
    userStore.myGameInfo[gameId] = {
    visitorName: data.game.visitor_team, 
    homeName: data.game.home_team,
    date: data.game.date
    };
  }
} 

function getGameInfo(gameId) {
  if (!userStore.myGameInfo || !userStore.myGameInfo[gameId]) {
    getGameDetails(gameId); // Call getGameDetails instead
    return { visitorName: 'Loading...', homeName: 'Loading...', date: 'Loading...' };
  }
  return userStore.myGameInfo[gameId];
}


async function getBets() {	
  console.log("getBets() called");

const token = userStore.token;

const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/bets?limit=30`

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }

  
    const response = await fetch(url, options);
    console.log("Fetch response status:", response.status);

    if (response.status === 200) {
      const data = await response.json();
      items.value = data;
    } else {
      console.warn("Failed to fetch bets. Status:", response.status);
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

/*onMounted(async () => {
  await getBets();

  calculateAverage({ preventDefault: () => {} });
})*/

onMounted(async () => {
  await getBets();

  for (const item of items.value) {
    if (item.playerId) {
      await getPlayerDetails(item.playerId);
    }
    if (item.gameId) {
      await getGameInfo(item.gameId);
    }
  }
  
  calculateAverage({ preventDefault: () => {} });
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
          <h1 class="fs-primary-heading">Bets</h1>
          <section class="split">
            <div class="search">   
              <h2>Scoreboard</h2>   
              <p>Score: {{ AvgScore }}</p>
              <p>Points: {{ AvgPoints }}</p>
              <p>Assists: {{ AvgAssists }}</p>       
              <p>Rebounds: {{ AvgRebound }}</p>       
              <p>Steals: {{ AvgSteals }}</p> 
              <p>Threes: {{ AvgThrees }}</p>
            </div>


            <div class="results">
              <h2 class="center">Completed Games</h2>
              <div v-for="completedItem in completedItems" :props.playerId = "completedItem.playerId">
                  <!--<div class="inlineGrid"><p>{{userStore.myGameInfo[completedItem.gameId].visitorName || 'Unknown Team'}} vs {{ userStore.myGameInfo[completedItem.gameId].homeName || 'Unknown Team' }}</p><p></p><p>{{ userStore.myGameInfo[completedItem.gameId].date || 'Unknown Date' }}</p></div>
                  <p>Player: {{ userStore.myPID[completedItem.playerId] || 'Unknown Player' }}</p>-->
                  <div><p>{{ getGameInfo(completedItem.gameId).visitorName }} vs {{ getGameInfo(completedItem.gameId).homeName}}</p><p>{{ getGameInfo(completedItem.gameId).date }}</p></div>
                  <div><p>Player: {{ getPlayerName(completedItem.playerId) }}</p></div>
                  <div class="inlineGrid"><p></p><p>Predicted</p><p>Actual</p></div>
                  <div class="inlineGrid"><p>Points:</p><p>{{completedItem.predictions.points}}</p><p>{{ completedItem.actualStats.points }}</p></div>
                  <div class="inlineGrid"><p>Assists:</p><p> {{ completedItem.predictions.assists }}</p><p>{{ completedItem.actualStats.assists }}</p></div>
                  <div class="inlineGrid"><p>Rebounds:</p><p> {{ completedItem.predictions.rebounds }}</p><p>{{ completedItem.actualStats.rebounds }}</p></div>
                  <div class="inlineGrid"><p>Steals:</p><p> {{ completedItem.predictions.steals }}</p><p>{{ completedItem.actualStats.steals }}</p></div>
                  <div class="inlineGrid"><p>Threes:</p><p> {{ completedItem.predictions.threes }}</p><p>{{ completedItem.actualStats.threes }}</p></div>
                  <p>Score: {{ completedItem.score }}</p><br>
                </div>
              <h2 class="center">Pending Games</h2>
              <div v-for="pendingItem in pendingItems">
                <!--<div class="inlineGrid"><p>Team Name vs Team Name</p><p></p><p>Date</p></div>
                <div class="inlineGrid"><p>{{userStore.myGameInfo[pendingItem.gameId].visitorName || 'Unknown Team'}}</p></div> vs {{ userStore.myGameInfo[pendingItem.gameId].homeName || 'Unknown Team' }}</p><p></p><p>{{ userStore.myGameInfo[pendingItem.gameId].date || 'Unknown Date' }}</p></div>
                <p>Player: {{ userStore.myPID[pendingItem.playerId] || 'Unknown Player' }}</p>-->
                <div><p>{{ getGameInfo(pendingItem.gameId).visitorName }} vs {{ getGameInfo(pendingItem.gameId).homeName}}</p><p>{{ getGameInfo(pendingItem.gameId).date }}</p></div>
                <div><p>Player: {{ getPlayerName(pendingItem.playerId) }}</p></div>
                <div class="inlineGrid"><p></p><p>Predicted</p><p>Actual</p></div>
                <div class="inlineGrid"><p>Points:</p><p>{{pendingItem.predictions.points}}</p><p>{{ pendingItem.actualStats.points }}</p></div>
                <div class="inlineGrid"><p>Assists:</p><p> {{ pendingItem.predictions.assists }}</p><p>{{ pendingItem.actualStats.assists }}</p></div>
                <div class="inlineGrid"><p>Rebounds:</p><p> {{ pendingItem.predictions.rebounds }}</p><p>{{ pendingItem.actualStats.rebounds }}</p></div>
                <div class="inlineGrid"><p>Steals:</p><p> {{ pendingItem.predictions.steals }}</p><p>{{ pendingItem.actualStats.steals }}</p></div>
                <div class="inlineGrid"><p>Threes:</p><p> {{ pendingItem.predictions.threes }}</p><p>{{ pendingItem.actualStats.threes }}</p></div>
                <p>Score: {{ pendingItem.score }}</p><br>
              </div>
              
            </div>
          </section>
      </section>
  </main>
</template>

<style scoped>
.inlineGrid {
  display: inline-grid;
  grid-template-columns: repeat(3, 220px); /* Three columns, each 50px wide */
  grid-gap: 10px; /* 10px gap between cells */
}

body {
  font: Arial;
  font-size: 14px;

}
:deep(a) {
  text-decoration: none;
  color: black;
}

h2 {
    float: center;
    font-size: 30px;
    padding-bottom: 10px;
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
  min-width: 300px; /* Add a minimum width */
}

.results {
  background-color: white;
  margin-left: 20px;
  padding: 25px;
  overflow-y: auto;
  min-width: 500px; /* Add a minimum width */
}

.space {
  padding: 25px;
}
</style>