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
      search: '',
      lastSearch: '',
      findFriendsUsers: [],
    }
  },
  methods: {
    switchView(view) {
      this.normalView = view === 'normal'
      this.findFriendsView = view === 'findFriends'
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
      this.$router.replace('/login')
    }
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
    <span class="material-icons">chevron_left</span>
  </div>
  <div class="top" v-if="findFriendsView">
    <div class="left">
      <input type="text" v-model="search" @keyup.enter="doSearch" placeholder="Enter username" ref="search" />
    </div>
    <span class="material-icons-round" @click="switchView('normal')">close</span>
  </div>
  <div class="middle" v-if="normalView">
    <div class="friend">
      <span>Lincoln</span>
      <span class="material-icons">menu</span>
    </div>
    <div class="friend">
      <span>Maimi</span>
      <span class="material-icons">menu</span>
    </div>
  </div>
  <div class="middle" v-if="findFriendsView">
    <span class="search" v-if="lastSearch">Searching for "{{lastSearch}}"</span>
    <div class="friend" v-for="user in findFriendsUsers" v-if="lastSearch">
      <span>{{ user.username }}</span>
      <span class="material-icons">person_add</span>
    </div>
  </div>
  <div class="languages-wrapper">
    <div class="h2">Microphone language</div>
    <div class="languages">
      <span>English</span>
      <span class="material-icons not-button">arrow_drop_down</span>
    </div>
  </div>
  <div class="logout-wrapper">
    <span>Logged in as <b>{{ store.user.username }}</b></span>
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
  padding: 16px;
}
input {
  width: 220px;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
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
  border-bottom: 1px solid #efefef;
  padding: 6px 0;
}
.logout-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  margin-bottom: 3px;
}
</style>