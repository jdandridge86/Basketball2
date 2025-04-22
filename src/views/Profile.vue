<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { onMounted, ref , reactive } from 'vue'
import Modal from '@/components/Modal.vue';

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

const router = useRouter()
const username = ref("")
const email = ref("")
const password = ref("")

const username1 = ref("")
const email1 = ref("")
const password1 = ref("")

//const user = userStore.username;

async function getProfile () {

  const token = userStore.token;
  
	
		const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/user/me`

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
      console.log(data)

      email.value = data.email;
      username.value = data.username;

      

		}
} 

async function editProfile (event) {
event.preventDefault();

const token = userStore.token;
const data = {};

  if (username.value.trim() !== "") data.username = username.value;
  if (email.value.trim() !== "") data.email = email.value;
  if (password.value.trim() !== "") data.password = password.value;


  const url = `https://csci-430-server-dubbabadgmf8hpfk.eastus2-01.azurewebsites.net/user/me`

  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }

  let response = await fetch(url, options)	
  
  if (response.status === 200) {
    alert("Changes saved")
    let data = await response.json()
    console.log(data)

    userStore.username = username.value;
    userStore.email = email.value;


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
    getProfile();
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
      <section class="container2 center vertical">
          <h1 class="fs-primary-heading">Profile</h1>
				<fieldset>
					<div class="inLineBlock margin">
            <p class="margin-right">Username:</p>
            <p class="fakeInput">{{ username }}</p>
          </div></br>					

          <div class="inLineBlock margin">
					  <p class="margin-right">Email:</p>
            <p class="fakeInput">{{ email }}</p>
          </div></br>

          <div class="inLineBlock margin">
					<p class="margin-right">Password:</p> <p class="fakeInput"></p>
          </div></br>

					<div class="centeredButton">
            <button class="button" @click="modal.open">Edit Profile</button>
          </div>

				</fieldset>
      </section>
  </main>

  <!--Modal-->
  <Modal ref="modal">
        <template #header>
            <h2>Edit Profile</h2><br>
        </template>
        <template #main>
          <form>
            <fieldset>
              <label>Username:   </label>
              <input type="username" id="username" v-model="username"><br /><br />					

              <label>Email:   </label>
              <input type="email" id="email" v-model="email"><br /><br />

              <label>Password:   </label>
              <input type="password" minlength="8" id="password" v-model="password"><br /><br />

            </fieldset>
			    </form>
        </template>
        <template #footer>
            <button class="margin-right padding" @click.stop="cancel">Back</button>
            <button class="padding" @click="editProfile">Save</button>
        </template>
	</Modal>
</template>

<style scoped>

.container2 {
  max-width: 300px;
  width: 100%;
  margin: 0 auto; /* this centers it */
  text-align: center; /* optional: centers text inside */
}

.inLineBlock {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}


.fakeInput {
  /* Optional styling for input appearance */
  background-color: lightgrey;
  padding: 3px;
  border-radius: 4px;
  border-style: solid;
  border-width: 2px;
  border-color: black;
  width: 200px;
  height: 25px;
  text-align: right;
}

.margin-right {
  margin-right: 10px;
}

.padding {
  padding: 5px;
}

:deep(a) {
  text-decoration: none;
  color: black;
}

input {
    background-color: lightgrey;
    float: right;
}

h2 {
    text-align: center;
    font-size: 40px;
    color: #E3B048
}


</style>