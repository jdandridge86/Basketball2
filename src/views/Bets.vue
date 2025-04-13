<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { onMounted, ref , reactive } from 'vue'
import { computed } from 'vue'

const userStore = useUserStore();

const router = useRouter()

const user = userStore.username;
let items = ref([])
let AvgPoints = ref();
let AvgAssists = ref();
let AvgScore = ref();
let AvgRebound = ref();
let AvgSteals = ref();
let AvgThrees = ref();

/*completedItems.forEach(obj => {
      console.log(obj);
      AvgPoints = Math.abs(obj.predictions.points - obj.actualStats.points);
 });*/

 const completedItems = computed(() => {
  const filtered = items.value.filter(item => item.status === "completed");
  console.log("Inside computed property, filtered items:", filtered);
  return filtered;
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
  const avgPointsDiff = totalPointsDiff / completedItems.value.length;
  const avgAssistsDiff = totalAssistsDiff / completedItems.value.length;
  const avgReboundsDiff = totalReboundsDiff / completedItems.value.length;
  const avgStealsDiff = totalStealsDiff / completedItems.value.length;
  const avgThreesDiff = totalThreesDiff / completedItems.value.length;
  const avgScore = totalScore / completedItems.value.length;
  
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

}


async function getBets() {	

const token = userStore.token;

const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/bets`

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }

  let response = await fetch(url, options)	
  
  if (response.status === 200) {
    let data = await response.json()
    items.value = data;
    console.log(data)
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
    await getBets();
    // Create a synthetic event object since your function expects one
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
      <div><a @click="logout">Log Out</a></div>
      <div><a @click="deleteUser">Delete Account</a></div>
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
              <h2>Completed Games</h2>
              <div v-for="completedItem in completedItems">
                <div class="inlineGrid"><p>Team Name vs Team Name</p><p></p><p>Date</p></div>
                <p>Player: Player Name Here</p>
                <div class="inlineGrid"><p></p><p>Predicted</p><p>Actual</p></div>
                <div class="inlineGrid"><p>Points:</p><p>{{completedItem.predictions.points}}</p><p>{{ completedItem.actualStats.points }}</p></div>
                <div class="inlineGrid"><p>Assists:</p><p> {{ completedItem.predictions.assists }}</p><p>{{ completedItem.actualStats.assists }}</p></div>
                <div class="inlineGrid"><p>Rebounds:</p><p> {{ completedItem.predictions.rebounds }}</p><p>{{ completedItem.actualStats.rebounds }}</p></div>
                <div class="inlineGrid"><p>Steals:</p><p> {{ completedItem.predictions.steals }}</p><p>{{ completedItem.actualStats.steals }}</p></div>
                <div class="inlineGrid"><p>Threes:</p><p> {{ completedItem.predictions.threes }}</p><p>{{ completedItem.actualStats.threes }}</p></div>
                <p>Score: {{ completedItem.score }}</p><br>
              </div>
              <h2>Pending Games</h2>
              <div v-for="item in items">
                <div class="inlineGrid"><p>Team Name vs Team Name</p><p></p><p>Date</p></div>
                <p>Player: Player Name Here</p>
                <p>Game Status: {{ item.status }}</p>
                <div class="inlineGrid"><p></p><p>Predicted</p><p>Actual</p></div>
                <div class="inlineGrid"><p>Points:</p><p>{{item.predictions.points}}</p><p>{{ item.actualStats.points }}</p></div>
                <div class="inlineGrid"><p>Assists:</p><p> {{ item.predictions.assists }}</p><p>{{ item.actualStats.assists }}</p></div>
                <div class="inlineGrid"><p>Rebounds:</p><p> {{ item.predictions.rebounds }}</p><p>{{ item.actualStats.rebounds }}</p></div>
                <div class="inlineGrid"><p>Steals:</p><p> {{ item.predictions.steals }}</p><p>{{ item.actualStats.steals }}</p></div>
                <div class="inlineGrid"><p>Threes:</p><p> {{ item.predictions.threes }}</p><p>{{ item.actualStats.threes }}</p></div>
                <p>Score: {{ item.score }}</p><br>
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