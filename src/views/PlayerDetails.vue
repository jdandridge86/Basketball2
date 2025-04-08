<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
//import { defineProps } from 'vue';
import { onMounted, ref , reactive } from 'vue'

const props = defineProps({ playerId: String })

const userStore = useUserStore();

const items = ref([])
const stats = ref([])
const router = useRouter()
let season = ref("")
let seasonParam = season.value;


const user = userStore.username;

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
            <div v-for="item in items" :playerFirst="item.first_name" :playerLast="item.last_name" class="inLineBlock">
                <h1 class="fs-primary-heading space">Player Details:  {{ item.first_name }} {{ item.last_name }}</h1>
                <div><button class="button" @click="bet($event)">Bet</button></div>
            </div>
            
        </section>
        <section class="split">
            <div class="TeamDetails">
                <div v-for="item in items" :TeamName="item.team.full_name" :abbreviation="item.abbreviation" :city="item.city" :conference="item.conference" :division="item.division">
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
                
                    <h2>Team Details</h2>
                    <p>{{ item.team.full_name }}</p>
                    <p>Abbreviation: {{ item.team.abbreviation }}</p>
                    <p>City: {{  item.team.city }}</p>
                    <p>Conference: {{ item.team.conference }}</p>
                    <p>Division: {{ item.team.division}}</p><br>
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
  grid-template-rows: 700px 700px;
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

</style>