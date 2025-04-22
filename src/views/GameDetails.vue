<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { onMounted, ref , reactive, watch } from 'vue'
import { computed } from 'vue';

const props = defineProps({ gameId: String })

const userStore = useUserStore();

const formatDate = (dateString) => {
	return new Date(dateString).toLocaleString("en-US", { month: "numeric", day: 'numeric', year:'numeric' })
}

//const stat = ref(null)

const router = useRouter();
let items = ref([]);
let date = ref("");
let homeTeam = ref("");
let homeTeamScore = ref("");
let status  = ref("");
let visitorTeam = ref("");
let visitorTeamScore = ref("");

const user = userStore.username;

async function getGameDetails (gameId) {

  const token = userStore.token;
  
	
		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/games/${props.gameId}`

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
            date.value = data.game.date;
            homeTeam.value = data.game.home_team;
            homeTeamScore.value = data.game.home_team_score;
            status.value = data.game.status;
            visitorTeam.value = data.game.visitor_team;
            visitorTeamScore.value = data.game.visitor_team_score;

            items.value = data.playerStats;

            
		} else {
            console.log(url)
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
    getGameDetails(props.gameId);
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
        <div><a href="#" @click="logout">Log Out</a></div>
      <div><a href="#" @click="deleteUser">Delete Account</a></div>
      </nav>
    </Header>
  
    <main class="padding-block-700">
        <section class="container center vertical">
                <h1 class="fs-primary-heading">Game Details </h1>
        </section>
        <section class="split">
            <div class="TeamDetails">
                    <h2 class="center">Game Details</h2>
                    <div>
                      <p>Date: {{ formatDate(date) }}</p>
                      <p>Home Team: {{ homeTeam }}</p>
                      <p>Home Team Score: {{ homeTeamScore }} </p>
                      <p>Visitor Team: {{ visitorTeam }}</p>
                      <p>Visitor Team Score: {{ visitorTeamScore }}</p>
                      <p>Status: {{ status }}</p>     
                    </div>         
              </div>

              
            <div class="TeamStats">
                <div class="center"><h2>Player Stats</h2></div>
                <div v-for="item in items" :TeamName="item.team.full_name">
                  <h2>{{ item.player_name }}</h2>
                <p>Team: {{ item.team }}</p>
                <p>Points:  {{ item.points }} </p>
                <p>Rebounds: {{ item.rebounds  }} </p>
                <p>Steals: {{ item.steals }} </p>
                <p>Assists: {{ item.assists }} </p>
                <p>Blocks: {{ item.blocks }} </p><br>

                <p>Percentage of 3 point field goals: {{ item.field_goal3_percentage }} </p>
                <p>3 point Attempts: {{ item.field_goals3_attempt }} </p>
                <p>3 points made: {{ item.field_goals3_made }} </p><br>

                <p>Percentage of field goals: {{ item.field_goal_percentage }} </p>
                <p>Field goals attempts: {{ item.field_goals_attempt }} </p>
                <p>Field goals made: {{ item.field_goals_made }} </p><br>

                <p>Percentage of free throws: {{ item.freethrow_percentage }} </p>
                <p>Free throws attempts: {{ item.freethrows_attempt }} </p>
                <p>Free throws Made: {{ item.freethrows_made }} </p><br>

                <!--<p>Visitor Team Stats using v-if</p> -->                                  
              </div>
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