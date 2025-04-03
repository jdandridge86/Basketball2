import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUserStore = defineStore('user', () => {
  const username = ref(localStorage.getItem("username") ?? "");
  const email = ref(localStorage.getItem("email") ?? "");
  const token = ref(localStorage.getItem("token") ?? "");


  watch(username, (v)=>{
    localStorage.setItem("username", v);
  });

  watch(email, (v)=>{
    localStorage.setItem("email", v);
  });

  watch(token, (v)=>{
    localStorage.setItem("token", v);
  });

  
  function setUser(uName, email1, token1) {
    username.value = uName ?? ''
    email.value = email1 ?? ''
    token.value = token1 ?? ''
  }

  function $reset() {
    username.value = ''
  }

  return { username, email, token, setUser, $reset }
})