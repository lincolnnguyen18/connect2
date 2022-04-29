import { defineStore, storeToRefs } from 'pinia'
import router from './router'

window.getCookie = (key) => {
  let cookie = document.cookie.split('; ')
  for (let i = 0; i < cookie.length; i++) {
    let arr = cookie[i].split('=')
    if (arr[0] === key && arr[1]) {
      return arr[1]
    }
  }
  return ''
}
window.setCookie = (key, value) => {
  document.cookie = `${key}=${value}`
}
window.eraseCookie = (name) => {
  // document.cookie = name + '=; Max-Age=0'
  document.cookie="token='';path=/"
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
    messagesOpenForRequest: null,
    socket: null,
    loading: false,
    loadingProgress: 50,
    finishLoading: null,
    requests: [],
    messages: [],
    scrollMessages: null,
    scrollMessagesDownSmall: null,
    messageSending: false,
    scrolling: false,
    reachedLastMessage: false,
    noLoading: false,
    atBottom: false,
    autoScroll: false,
    micOn: false,
    scrollBehavior: "smooth",
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
    messagesOpenForRequest: (state) => {
      // get request with username matching messagesOpenFor
      if(state.messagesOpenFor)
        return state.requests.find(r => r.username === state.messagesOpenFor)
      return null
    }
  },
  actions: {
    startLoading() {
      if (!this.loading) {
        if (this.noLoading) {
          this.loading = true
          return
        }
        this.loadingProgress = 0
        this.loading = true
        setTimeout(() => {
          this.loadingProgress = 70
        }, 100)
        console.log(`START LOADING ${this.totalLoading}`)
      }
    },
    finishLoadingSub() {
      if (!this.loading) return
      if (this.noLoading) {
        this.loading = false
        return
      }
      console.log(`FINISH LOADING ${this.totalLoading}`)
      this.loadingProgress = 100
      setTimeout(() => {
        this.loading = false
        console.log(`HIDE LOADING ${this.totalLoading}`)
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
        },
        body: JSON.stringify({ token: getCookie('token') })
      })
        .then(res => res.json())
        .then(res => {
          if (res.user) {
            this.loggedIn = true;
            this.user = res.user;
            this.socket = io();
            this.socket.on('connect', () => {
              // console.log('connected')
              this.socket.emit('login', getCookie('token'))
              this.socket.on('friend-request', async () => {
                // console.log('friend-request')
                await this.getFriendRequests()
                if (!this.messagesOpenForRequest) router.push('/')
              })
              this.socket.on('new-message', async () => {
                // console.log('new-message')
                await this.getMoreMessages()
              });
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
      // setCookie('token', '');
      eraseCookie('token');
      this.loggedIn = false;
      this.user = null;
      this.messagesOpenFor = null;
      this.requests = [];
      this.messages = [];
      this.socket.disconnect();
    },
    async sendMessage() {
      let message = this.input;
      if (message.trim().length === 0 || this.messageSending) return;
      // console.log(`Sending message: ${message}`);
      this.messageSending = true;
      await fetch(`/api/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: this.messagesOpenFor, message })
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            console.log(res);
            throw new Error(res.error);
          }
        });
      this.noLoading = true;
      if (this.messages.length) {
        await this.getMoreMessages();
      } else {
        await this.getMessages();
      }
      this.input = '';
      this.messageSending = false;
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
    async cancelFriendRequest() {
      await fetch(`/api/cancel-friend-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: this.messagesOpenForRequest.username })
      })
        .then(res => res.json())
        .then(res => {
          this.getFriendRequests()
          if (res.error) {
            console.log(res);
            throw new Error(res.error);
          }
        });
    },
    async declineFriendRequest() {
      await fetch(`/api/decline-friend-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: this.messagesOpenForRequest.username })
      })
        .then(res => res.json())
        .then(res => {
          this.getFriendRequests()
          if (res.error) {
            console.log(res);
            throw new Error(res.error);
          }
        });
    },
    async acceptFriendRequest() {
      await fetch(`/api/accept-friend-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: this.messagesOpenForRequest.username })
      })
        .then(res => res.json())
        .then(res => {
          this.getFriendRequests()
          if (res.error) {
            console.log(res);
            throw new Error(res.error);
          }
        });
    },
    async getFriendRequests() {
      this.startLoading()
      await fetch(`/api/get-friend-requests`)
        .then(res => res.json())
        .then(res => {
          this.finishLoading()
          this.requests = res;
          // if (!this.messagesOpenForRequest) this.messagesOpenFor = null;
        });
    },
    async getMessages() {
      this.startLoading()
      let username = this.messagesOpenFor
      // console.log(`Getting messages for: ${username}`);
      if (username) {
        let limit = Math.floor(window.innerHeight / 77);
        await fetch(`/api/get-messages?username=${encodeURIComponent(username)}&limit=${limit}&offHr=${offHr}&offMin=${offMin}`)
          .then(res => res.json())
          .then(res => {
            this.finishLoading()
            this.messagesOpenFor = username;
            // if (res.length == 0) console.log('NO MESSAGES', res);
            // else console.log('MESSAGES', res);
            this.messages = res.reverse();
            this.reachedLastMessage = false
          });
        this.scrollMessages()
      }
    },
    async getMoreMessages() {
      if (!this.messages.length) {
        this.getMessages()
      } else {
        let username = this.messagesOpenFor
        if (username) {
          let limit = Math.floor(window.innerHeight / 77);
          // get timezoneOffsetHr and timezoneOffsetMin
          await fetch(`/api/get-messages-offset?username=${encodeURIComponent(username)}&limit=${limit}&offHr=${offHr}&offMin=${offMin}&offset=${this.messages[this.messages.length - 1].id}`)
            .then(res => res.json())
            .then(res => {
              this.messagesOpenFor = username;
              // if (res.length == 0) console.log('NO MORE MESSAGES', res);
              // else console.log('MORE MESSAGES', res);
              this.messages = this.messages.concat(res.reverse());
            });
          this.scrollMessages()
        }
      }
    },
    async getMoreMessagesReverse(oldScrollHeight) {
      if (!this.messages.length) {
        this.getMessages()
      } else {
        let username = this.messagesOpenFor
        let hadMore = false
        if (username) {
          let limit = Math.floor(window.innerHeight / 77);
          // get timezoneOffsetHr and timezoneOffsetMin
          await fetch(`/api/get-messages-offset-reverse?username=${encodeURIComponent(username)}&limit=${limit}&offHr=${offHr}&offMin=${offMin}&offset=${this.messages[0].id}`)
            .then(res => res.json())
            .then(res => {
              this.messagesOpenFor = username;
              if (res.length == 0) {
                // console.log('NO MORE MESSAGES', res);
              } else {
                // console.log('MORE MESSAGES', res);
                hadMore = true
              }
              this.messages = res.reverse().concat(this.messages);
            });
          if (hadMore) {
            this.scrollMessagesDownSmall(oldScrollHeight)
            this.reachedLastMessage = false
          } else
            this.reachedLastMessage = true
          this.finishLoading()
        }
      }
    }
  }
})
