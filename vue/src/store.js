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
    rightRef: null,
    messages: [],
    scrollMessages: null,
    scrollMessagesDownSmall: null,
    initAtBottom: null,
    messageSending: false,
    scrolling: false,
    reachedLastMessage: false,
    noLoading: false,
    atBottom: false,
    autoScroll: true,
    micOn: false,
    recognition: new webkitSpeechRecognition(),
    leftInterim: "",
    rightInterim: "",
    scrollBehavior: "smooth",
    langIndex: 60,
    langAbbrevs: ["af-ZA","id-ID","ms-MY","ca-ES","cs-CZ","de-De","en-AU","en-CA","en-IN","en-NZ","en-ZA","en-GB","en-US","es-AR","es-BO","es-CL","es-CO","es-CR","es-EC","es-SV","es-ES","es-US","es-GT","es-HN","es-MX","es-NI","es-PA","es-PY","es-PE","es-PR","es-DO","es-UY","es-VE","eu-ES","fr-FR","gl-ES","hr-HR","zu-ZA","is-IS","it-IT","it-CH","hu-HU","nl-NL","nb-NO","pl-PL","pt-BR","pt-PT","ro-RO","sk-SK","fi-FI","sv-SE","tr-TR","bg-BG","ru-RU","sr-RS","ko-KR","cmn-Hans-CN","cmn-Hans-HK","cmn-Hant-TW","yue-Hant-HK","ja-JP","la"],
    langFulls: ["Afrikaans","Bahasa Indonesia","Bahasa Melayu","Català","Čeština","Deutsch","English (Australia)","English (Canada)","English (India)","English (New Zealand)","English (South Africa)","English (United Kingdom)","English (United States)","Español (Argentina)","Español (Bolivia)","Español (Chile)","Español (Colombia)","Español (Costa Rica)","Español (Ecuador)","Español (El Salvador)","Español (España)","Español (Estados Unidos)","Español (Guatemala)","Español (Honduras)","Español (México)","Español (Nicaragua)","Español (Panamá)","Español (Paraguay)","Español (Perú)","Español (Puerto Rico)","Español (República Dominicana)","Español (Uruguay)","Español (Venezuela)","Euskara","Français","Galego","Hrvatski","IsiZulu","Íslenska","Italiano (Italia)","Italiano (Svizzera)","Magyar","Nederlands","Norsk bokmål","Polski","Português (Brasil)","Português (Portugal)","Română","Slovenčina","Suomi","Svenska","Türkçe","български","Pусский","Српски","한국어","中文 普通话 (中国大陆)","中文 普通话 (香港)","中文 中文 (台灣)","中文 粵語 (香港)","日本語","Lingua latīna"],
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
    startRecording() {
      this.micOn = true
      this.recognition.start()
    },
    stopRecording() {
      this.micOn = false
      this.recognition.stop()
      this.leftInterim = ""
    },
    updateLang() {
      let wasOn = false
      if (this.micOn) {
        this.stopRecording()
        wasOn = true
      }
      this.recognition.lang = this.langAbbrevs[this.langIndex]
      // console.log(`lang set to ${this.langAbbrevs[this.langIndex]}`)
      setTimeout(() => {
        if (wasOn) this.startRecording()
      }, 100)
    },
    initRecognition() {
      this.recognition.interimResults = true
      this.updateLang()
      this.recognition.onresult = (e) => {
        if (this.autoScroll) this.scrollMessages()
        if (!this.messagesOpenForRequest) {
          this.stopRecording()
          return
        }
        this.leftInterim = "";
        for (let i = 0; i < e.results.length; i++) {
          if (e.results.length > 0) {
            if (e.results[i].isFinal) {
              // this.messages.push({
              //   text: e.results[i][0].transcript,
              //   side: 'left'
              // });
              // this.sendFinal(e.results[i][0].transcript);
              // console.log(`final: ${e.results[i][0].transcript}`)
              this.sendMessage(e.results[i][0].transcript).then(() => {
                this.leftInterim = "";
                this.socket.emit('interim', {
                  to: this.messagesOpenForRequest.username,
                  interim: this.leftInterim
                });
              });
              // this.sendInterim(this.leftInterim);
            } else {
              this.leftInterim += e.results[i][0].transcript;
              this.socket.emit('interim', {
                to: this.messagesOpenForRequest.username,
                interim: this.leftInterim
              });
              // console.log(`interim: ${this.leftInterim}`)
              // this.sendInterim(this.leftInterim);
            }
          }
        }
      }
      this.recognition.onstart = () => {
        // console.log('started');
        this.micOn = true;
      }
      this.recognition.onend = () => {
        // console.log('ended');
        if (this.micOn)
          this.startRecording();
      }
      this.recognition.onerror = (e) => {
        // console.log(e);
      }
    },
    startLoading() {
      if (!this.loading) {
        if (this.noLoading) {
          this.loadingProgress = 0
          this.loading = false
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
        this.noLoading = false
        return
      }
      console.log(`FINISH LOADING ${this.totalLoading}`)
      this.loadingProgress = 100
      setTimeout(() => {
        this.loading = false
        // console.log(`HIDE LOADING ${this.totalLoading}`)
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
              })
              this.socket.on('new-message', async () => {
                // console.log('new-message')
                await this.getMoreMessages()
              });
              this.socket.on('interim', async (interim) => {
                console.log('interim', interim)
                this.rightInterim = interim
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
    async sendMessage(message) {
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
    async deleteFriend(username) {
      await fetch(`/api/delete-friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
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
          if (!this.messagesOpenForRequest) {
            router.push('/')
            this.messagesOpenFor = null;
            this.messages = [];
          }
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
            console.log(res)
            this.finishLoading()
            this.messagesOpenFor = username;
            // if (res.length == 0) console.log('NO MESSAGES', res);
            // else console.log('MESSAGES', res);
            this.messages = res.reverse();
            this.reachedLastMessage = false
            this.autoScroll = true;
            this.scrollMessages()
            this.autoScroll = false;
            this.atBottom = true;
          });
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
          await this.scrollMessages()
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
          // this.finishLoading()
        }
      }
    }
  }
})
