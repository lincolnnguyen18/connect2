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
window.offHr = -1 * Math.floor(new Date().getTimezoneOffset() / 60);
window.offMin = new Date().getTimezoneOffset() % 60;

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    loggedIn: false,
    input: '',
    user: null,
    messagesOpenFor: null,
    socket: null,
    loading: false,
    loadingProgress: 50,
    finishLoading: null
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    startLoading() {
      if (!this.loading) {
        this.loadingProgress = 0
        this.loading = true
        setTimeout(() => {
          this.loadingProgress = 70
        }, 100)
        console.log(`START LOADING ${this.totalLoading}`)
      }
    },
    finishLoadingSub() {
      console.log(`FINISH LOADING ${this.totalLoading}`)
      this.loadingProgress = 100
      setTimeout(() => {
        this.loading = false
        console.log(this.loadingProgress, this.loading)
      }, 400)
    },
    async register(username, password) {
      await fetch('/api/register', {
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
            // console.log(`Setting token: ${res.token}`);
            // setCookie('token', res.token);
          }
        });
    },
    async checkIfLoggedIn() {
      await fetch('/api/is-loggedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(res => {
          if (res.user) {
            this.loggedIn = true;
            this.user = res.user;
            this.socket = io();
            this.socket.on('connect', () => {
              console.log('connected')
              this.socket.emit('login', getCookie('token'))
            })
          }
        });
    },
    async login(username, password) {
      if (!username || !password) {
        return;
      }
      await fetch('/api/login', {
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
            // console.log(`Setting token: ${res.token}`);
            // setCookie('token', res.token);
          }
        });
    },
    logout() {
      setCookie('token', '');
      this.loggedIn = false;
      this.user = null;
    },
    async sendMessage(message) {
      console.log(`Sending message: ${message}`);
    },
    async findFriends(username) {
      if (username) {
        return await fetch(`/api/get-users?username=${encodeURIComponent(username)}`)
          .then(res => res.json())
          .then(res => {
            return res;
          });
      }
    },
    async sendFriendRequest(username) {
      await fetch(`/api/send-friend-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            console.log(res);
            throw new Error(res.error);
          }
        });
    },
    async getFriendRequests() {
      this.startLoading()
      return await fetch(`/api/get-friend-requests`)
        .then(res => res.json())
        .then(res => {
          this.finishLoading()
          return res;
        });
    },
    async getMessages(username) {
      this.startLoading()
      if (username) {
        let limit = Math.floor(window.innerHeight / 77);
        // get timezoneOffsetHr and timezoneOffsetMin
        return await fetch(`/api/get-messages?username=${encodeURIComponent(username)}&limit=${limit}&offHr=${offHr}&offMin=${offMin}`)
          .then(res => res.json())
          .then(res => {
            this.finishLoading()
            console.log(res)
            return res;
          });
      }
    },
  }
})
