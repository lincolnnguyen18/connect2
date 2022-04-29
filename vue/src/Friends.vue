<script>
import { useMainStore } from './store'
export default {
  setup() {
    const store = useMainStore()
    return { store }
  },
  data () {
    return {
      normalView: true,
      findFriendsView: false,
      settingsView: false,
      search: '',
      lastSearch: '',
      findFriendsUsers: [],
      username: ''
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
      <div class="languages">
        <span>English</span>
        <span class="material-icons not-button">arrow_drop_down</span>
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