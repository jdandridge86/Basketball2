<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { onMounted, ref , reactive } from 'vue'

const props = defineProps({ gameId: String })

const userStore = useUserStore();

//const stat = ref(null)

const router = useRouter();
const gameDetails = ref[""];

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
            gameDetails.value = data.game;

            
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
        <div><RouterLink to="/favorites">Favorites</RouterLink></div>
        <div><a @click="logout">Log Out</a></div>
        <div><a @click="deleteUser">Delete Account</a></div>
      </nav>
    </Header>
  
    <main class="padding-block-700">
        <section class="container center vertical">
                <h1 class="fs-primary-heading">Game Details: </h1>
        </section>
        <section class="split">
            <div class="TeamDetails">
                    <h2>Game Details</h2>
                    <p>
                        Date: 
                        Home Team Score:
                        Visitor Team Score:
                        Status: 

                    </p>
                    
                    
            </div>

            <div class="TeamStats">
                <div class="rightAlign"></div>
                <h2>Player Stats </h2>
                <!--<div v-if="stat">
                  <p>Conference Rank: {{ stat.conference_rank }}</p>
                </div>   -->
                <p>Home Team Stats using v-if
                Player's Name:
                Points:
                Rebounds:
                Steals:
                Assists:
                Blocks:

                Percentage of 3 point field goals:
                3 point Attempts
                3 points made:

                Percentage of field goals:
                field goals attempts:
                field goals made:

                Percentage of free throws:
                Free throws attempts:
                Free throws Made:



                </p>

                <p>Visitor Team Stats using v-if


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