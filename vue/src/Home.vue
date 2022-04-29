<script>
import { useMainStore } from './store'
import Friends from './Friends.vue'
import Chat from './Chat.vue'
import InputBar from './InputBar.vue'
import WaitingAccept from './WaitingAccept.vue'
export default {
  components: { Friends, Chat, InputBar, WaitingAccept },
  setup() {
    const store = useMainStore()
    return { store }
  },
  data () {
    return {
      messages: []
    }
  },
  methods: {
    openMessages: async function(request) {
      console.log('Opening messages for', request)
      this.$router.push({ name: 'messages', params: { username: request.username } })
      this.messages = await this.store.getMessages(request.username)
    },
  },
  mounted: async function() {
    // scroll right to bottom
    this.$refs.right.scrollTop = this.$refs.right.scrollHeight
    await this.store.getFriendRequests()
    const { username } = this.$route.params
    if (username) {
      this.store.messagesOpenFor = username
      // this.store.getMessages(username).then(messages => {
      //   this.messages = messages
      // })
      try {
        this.messages = await this.store.getMessages(username)
      } catch (err) {
        console.log(err)
        this.$router.push('/')
      }
    }
    // console.log(this.messages)
    // if (!this.messages || this.messages.length === 0) this.$router.push('/')
  },
  watch: {
    '$route' (to, from) {
      // console.log(`Route changed from ${from.name} to ${to.name}`)
      // console.log(this.$route.params)
      const { username } = this.$route.params
      this.store.messagesOpenFor = username
    }
  },
  computed: {
    waitingEnabled() {
      return this.store.messagesOpenForRequest && !this.store.messagesOpenForRequest.accepted_at
    }
  }
}
</script>

<template>
<div class="left">
  <Friends @open-messages="openMessages" />
</div>
<div class="right" ref="right" :class="{ 'invisible': !store.messagesOpenFor }">
  <InputBar />
  <!-- <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  </div> -->
  <Chat :message="message" v-for="message in messages" />
  <WaitingAccept v-if="waitingEnabled" />
  <div class="close-messages">
    <span class="material-icons button" @click="$router.push('/')">close</span>
  </div>
</div>
</template>

<style scoped>
.left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: 100%;
}
.right {
  /* background: red; */
  width: 100%;
  max-width: 850px;
  height: 100%;
  overflow: auto;
  padding-right: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 7px;
}
.right > div:nth-child(2) {
  margin-top: 32px;
}
.right > div:last-child {
  margin-bottom: 40px;
}
</style>
<style>
.left-bubble-wrapper, .right-bubble-wrapper {
  width: 100%;
  /* background: pink; */
  display: flex;
}
.left-bubble-wrapper {
  justify-content: flex-start;
}
.right-bubble-wrapper {
  justify-content: flex-end;
}
.bubble-wrapper {
  display: flex;
  flex-direction: column;
  align-items: v-bind('align');
  gap: 12px;
  max-width: 400px;
}
.bubble {
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 16px;
  /* text-align: justify; */
}
.date {
  font-size: 12px;
  color: #8e8e8e;
}
.close-messages {
  position: absolute;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  z-index: 10;
  right: 0px;
}
</style>