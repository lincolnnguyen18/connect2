<script>
import { useMainStore } from './store'
import Dropdown from './Dropdown.vue'
export default {
  setup() {
    const store = useMainStore()
    return { store }
  },
  components: {
    Dropdown
  },
  data () {
    return {
      normalView: true,
      findFriendsView: false,
      settingsView: false,
      search: '',
      lastSearch: '',
      findFriendsUsers: [],
      username: '',
      languagesOpen: false,
      langAbbrevs: ["af-ZA","id-ID","ms-MY","ca-ES","cs-CZ","de-De","en-AU","en-CA","en-IN","en-NZ","en-ZA","en-GB","en-US","es-AR","es-BO","es-CL","es-CO","es-CR","es-EC","es-SV","es-ES","es-US","es-GT","es-HN","es-MX","es-NI","es-PA","es-PY","es-PE","es-PR","es-DO","es-UY","es-VE","eu-ES","fr-FR","gl-ES","hr-HR","zu-ZA","is-IS","it-IT","it-CH","hu-HU","nl-NL","nb-NO","pl-PL","pt-BR","pt-PT","ro-RO","sk-SK","fi-FI","sv-SE","tr-TR","bg-BG","ru-RU","sr-RS","ko-KR","cmn-Hans-CN","cmn-Hans-HK","cmn-Hant-TW","yue-Hant-HK","ja-JP","la"],
      langFulls: ["Afrikaans","Bahasa Indonesia","Bahasa Melayu","Català","Čeština","Deutsch","English (Australia)","English (Canada)","English (India)","English (New Zealand)","English (South Africa)","English (United Kingdom)","English (United States)","Español (Argentina)","Español (Bolivia)","Español (Chile)","Español (Colombia)","Español (Costa Rica)","Español (Ecuador)","Español (El Salvador)","Español (España)","Español (Estados Unidos)","Español (Guatemala)","Español (Honduras)","Español (México)","Español (Nicaragua)","Español (Panamá)","Español (Paraguay)","Español (Perú)","Español (Puerto Rico)","Español (República Dominicana)","Español (Uruguay)","Español (Venezuela)","Euskara","Français","Galego","Hrvatski","IsiZulu","Íslenska","Italiano (Italia)","Italiano (Svizzera)","Magyar","Nederlands","Norsk bokmål","Polski","Português (Brasil)","Português (Portugal)","Română","Slovenčina","Suomi","Svenska","Türkçe","български","Pусский","Српски","한국어","中文 普通话 (中国大陆)","中文 普通话 (香港)","中文 中文 (台灣)","中文 粵語 (香港)","日本語","Lingua latīna"],
    }
  },
  methods: {
    switchView(view) {
      console.log('switchView', view)
      this.normalView = view === 'normal'
      this.findFriendsView = view === 'findFriends'
      this.settingsView = view === 'settings'
      if (view === 'findFriends') {
        setTimeout(() => {
          this.$refs.search.select()
        }, 1)
      } else {
        this.search = ''
        this.lastSearch = ''
      }
    },
    doSearch: async function () {
      let users = await this.store.findFriends(this.search)
      this.lastSearch = this.search
      console.log(users)
      this.findFriendsUsers = users
    },
    logout() {
      this.store.logout()
      this.$router.push('/login')
      // console router route
      console.log(`PATH: ${this.$route.path}`)
      // console.log(this.store.loggedIn, this.store.user)

    },
    sendFriendRequest: async function(username) {
      try {
        await this.store.sendFriendRequest(username)
        await this.store.getFriendRequests()
        this.switchView('normal')
        this.$router.push(`/messages/${username}`)
      } catch (err) {
        alert(err)
      }
    }
  },
  mounted() {
    this.username = this.store.user.username
  }
}
</script>

<template>
<div class="friends">
  <div class="top" v-if="normalView">
    <div class="left">
      <span class="h1">Friends</span>
      <span class="material-icons" @click="switchView('findFriends')">add</span>
    </div>
    <!-- <span class="material-icons">chevron_left</span> -->
    <span class="material-icons" @click="switchView('settings')">settings</span>
  </div>
  <div class="top" v-if="settingsView">
    <div class="left">
      <span class="h1">Settings</span>
      <!-- <span class="material-icons">chevron_left</span> -->
    </div>
    <span class="material-icons-round" @click="switchView('normal')">close</span>
  </div>
  <div class="top" v-if="findFriendsView">
    <div class="left">
      <input type="text" v-model="search" @keyup.enter="doSearch" placeholder="Enter username" ref="search" />
    </div>
    <span class="material-icons-round" @click="switchView('normal')">close</span>
  </div>
  <div class="middle settings-middle" v-if="settingsView">
    <div class="languages-wrapper">
      <div class="h2">Microphone language</div>
      <div class="languages" @click="languagesOpen=!languagesOpen">
        <span>English</span>
        <span class="material-icons not-button">arrow_drop_down</span>
        <Dropdown fromTop="30px" height="400px" :items="langFulls" v-if="languagesOpen" @click.stop />
      </div>
    </div>
  </div>
  <div class="middle" v-if="normalView">
    <div class="friend normal-friend" v-for="request in store.requests" @click="this.$emit('open-messages', request)" :class="{ 'active-friend': request.username === store.messagesOpenFor }">
      <span>{{ request.username }}</span>
      <span v-if="!request.accepted_at && request.direction === 'recipient'" class="material-icons-round not-button">priority_high</span>
      <span v-if="!request.accepted_at && request.direction === 'requester'" class="material-icons not-button">schedule</span>
      <span v-if="request.accepted_at" class="material-icons" @click.stop>menu</span>
      <div class="divider"></div>
    </div>
  </div>
  <div class="middle" v-if="findFriendsView">
    <span class="search" v-if="lastSearch">Searching for "{{lastSearch}}"</span>
    <div class="friend" v-for="user in findFriendsUsers" v-if="lastSearch">
      <span>{{ user.username }}</span>
      <span class="material-icons" @click="sendFriendRequest(user.username)">person_add</span>
    </div>
  </div>
  <div class="logout-wrapper">
    <span>Logged in as <b>{{ this.username }}</b></span>
    <span class="material-icons" @click="logout">logout</span>
  </div>
</div>
</template>

<style scoped>
.friends {
  display: flex;
  flex-direction: column;
  width: 270px;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  height: 90%;
  max-height: 700px;
  /* padding: 16px; */
}
input {
  width: 200px!important;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 16px;
  padding-top: 16px;
}
.top .left {
  display: flex;
  align-items: center;
  gap: 4px;
}
.middle {
  height: 100%;
  margin: 12px 0;
  /* background: red; */
  display: flex;
  flex-direction: column;
}
.friend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* border-bottom: 1px solid #efefef; */
  padding: 6px 16px;
  position: relative;
}
.divider {
  position: absolute;
  bottom: 0;
  width: 100%;
  margin: 0 auto;
  background: #efefef;
  height: 1px;
  left: 0;
}
.normal-friend {
  cursor: pointer;
}
.normal-friend:hover {
  background: #f5f5f5;
}
.active-friend {
  background: #f5f5f5;
}
.logout-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  padding-bottom: 16px;
}
.languages-wrapper {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 12px;
}
.languages {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  user-select: none;
}
.search {
  font-size: 14px;
  font-weight: bold;
  margin: 0 16px;
  margin-bottom: 3px;
}
.settings-middle {
  padding: 0 16px;
}
</style>