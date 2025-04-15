import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUserStore = defineStore('user', () => {
  // state
  const username = ref(localStorage.getItem("username") ?? "");
  const email = ref(localStorage.getItem("email") ?? "");
  const token = ref(localStorage.getItem("token") ?? "");

  const myPID = ref({});

  const myGameInfo = ref({});

  
  watch(username, (v)=>{
    localStorage.setItem("username", v);
  });

  watch(email, (v)=>{
    localStorage.setItem("email", v);
  });

  watch(token, (v)=>{
    localStorage.setItem("token", v);
  });
  
  // actions
  function setUser(uName, email1, token1) {
    username.value = uName ?? ''
    email.value = email1 ?? ''
    token.value = token1 ?? ''
  }

  function $reset() {
    username.value = ''
  }

  function setPID(key, value) {
    myPID.value[key] = value;
  }

  function getPID(playerId) {
    return myPID.value[playerId]; 
  }

  function setGameInfo(key, visitorName, homeName, date) {
    myGameInfo.value[key] = {visitorName, homeName, date};
  }

  function getGameInfo(gameId) {
    return myGameInfo.value[gameId];
  }

  return { username, email, token, myPID, myGameInfo, setGameInfo, getGameInfo, getPID, setPID, setUser, $reset }
})