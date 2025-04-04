import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import SignIn from '@/views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'
import Main from '@/views/Main.vue'
import Profile from '@/views/Profile.vue'
import Teams from '@/views/Teams.vue'
import Games from '@/views/Games.vue'
import Favorites from '@/views/Favorites.vue'
import Players from '@/views/Players.vue'
import PlayerDetails from '@/views/PlayerDetails.vue'
import Bets from '@/views/Bets.vue'
import TeamDetails from '@/views/TeamDetails.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/signin',
			name: 'signin',
			component: SignIn
		},
		{
			path: '/signup',
			name: 'signup',
			component: SignUp
		},
		{
			path: '/main',
			name: 'main',
			component: Main
		},
		{
			path: '/profile',
			name: 'profile',
			component: Profile
		},
		{
			path: '/teams',
			name: 'teams',
			component: Teams
		},
		{
			path: '/games',
			name: 'games',
			component: Games
		},
		{
			path: '/players',
			name: 'players',
			component: Players
		},
		{
			path: '/favorites',
			name: 'favorites',
			component: Favorites
		},
		{
			path: '/bets',
			name: 'bets',
			component: Bets
		},
		{
			path: '/playerdetails/:playerId',
			name: 'playerdetails',
			component: PlayerDetails,
			props:true,
		},
		{
			path: '/teamdetails/:teamId',
			name: 'teamdetails',
			component: TeamDetails,
			props:true,
		},
	],
})

export default router
