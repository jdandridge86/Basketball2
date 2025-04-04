<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { onMounted, ref , reactive } from 'vue'

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

onMounted(() => {
    getTeamDetails(props.teamId, undefined);
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
                <h1 class="fs-primary-heading">Team Details: {{ teamName }} ({{ abbreviation }})</h1>
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

</style>