<script>
import { useMainStore } from './store'
import Friends from './Friends.vue'
import Chat from './Chat.vue'
import InputBar from './InputBar.vue'
export default {
  components: { Friends, Chat, InputBar },
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
    openMessages: async function(username) {
      console.log(`Opening messages for ${username}`)
      this.$router.push({ name: 'messages', params: { username } })
      this.messages = await this.store.getMessages(username)
    },
  },
  mounted: async function() {
    // scroll right to bottom
    this.$refs.right.scrollTop = this.$refs.right.scrollHeight
    const { username } = this.$route.params
    this.store.messagesOpenFor = username
    // this.store.getMessages(username).then(messages => {
    //   this.messages = messages
    // })
    this.messages = await this.store.getMessages(username)
  },
  watch: {
    '$route' (to, from) {
      // console.log(`Route changed from ${from.name} to ${to.name}`)
      console.log(this.$route.params)
      const { username } = this.$route.params
      this.store.messagesOpenFor = username
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
  <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  </div>
  <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
  </div>
  <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  </div>
  <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  </div>
  <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
  </div>
  <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  </div>
  <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  </div>
  <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
  </div>
  <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  </div>
  <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  </div>
  <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
  </div>
  <div class="left-bubble-wrapper">
    <Chat side="left" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  </div>
  <div class="right-bubble-wrapper">
    <Chat side="right" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
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
  margin-bottom: 100px;
}
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
.close-message {
  position: fixed;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 16px;
  z-index: 22;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  top: 16px;
  right: 16px;
}
.invisible {
  visibility: hidden;
}
</style>