import { defineStore } from 'pinia'

window.getCookie = (key) => {
  let cookie = document.cookie.split('; ')
  for (let i = 0; i < cookie.length; i++) {
    let arr = cookie[i].split('=')
    if (arr[0] === key) {
      return arr[1]
    }
  }
  return ''
}
window.setCookie = (key, value) => {
  document.cookie = `${key}=${value}`
}

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    loggedIn: false,
    input: ''
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    async register(username, password) {
      await fetch('http://localhost:3003/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            console.log(res);
            throw new Error(res.error);
          } else {
            console.log(`Setting token: ${res.token}`);
            setCookie('token', res.token);
          }
        });
    },
    async checkIfLoggedIn() {
      await fetch('http://localhost:3003/api/is-loggedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: getCookie('token') })
      })
        .then(res => res.json())
        .then(res => {
          if (res.id) {
            this.loggedIn = true;
            this.id = res.id;
          }
        });
    },
    async login(username, password) {
      await fetch('http://localhost:3003/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            console.log(res);
            throw new Error(res.error);
          } else {
            console.log(`Setting token: ${res.token}`);
            setCookie('token', res.token);
          }
        });
    },
    logout() {
      setCookie('token', '');
      this.loggedIn = false;
    },
    async sendMessage(message) {
      console.log(`Sending message: ${message}`);
    },
    async findFriends() {
      console.log('Finding friends');
    }
  }
})
