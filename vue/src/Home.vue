<script>
import { useMainStore } from './store'
import Friends from './Friends.vue'
import Chat from './Chat.vue'
import Interim from './Interim.vue'
import InputBar from './InputBar.vue'
import WaitingAccept from './WaitingAccept.vue'
export default {
  components: { Friends, Chat, InputBar, WaitingAccept, Interim },
  setup() {
    const store = useMainStore()
    return { store }
  },
  // data () {
  //   return {
  //     messages: []
  //   }
  // },
  methods: {
    openMessages: async function(request) {
      // console.log('Opening messages for', request)
      this.$router.push({ name: 'messages', params: { username: request.username } })
      this.store.messagesOpenFor = request.username
      await this.store.getMessages()
    },
    onScroll: function(e) {
      // detect scroll to bottom
      console.log(Math.ceil(e.target.scrollTop + e.target.clientHeight), e.target.scrollHeight)
      if (Math.ceil(e.target.scrollTop + e.target.clientHeight) >= e.target.scrollHeight) {
        this.store.atBottom = true
        this.store.autoScroll = true
      } else {
        this.store.atBottom = false
        this.store.autoScroll = false
      }
      if (this.scrolling || this.store.reachedLastMessage) return
      if (e.target.scrollTop === 0) {
        // detect scroll to top
        setTimeout(async () => {
          if (e.target.scrollTop === 0) {
            // this.store.startLoading()
            this.scrolling = true
            // console.log('Scrolled to top')
            this.store.scrollBehavior = 'auto'
            await this.store.getMoreMessagesReverse(this.$refs.right.scrollHeight)
            this.store.scrollBehavior = 'smooth'
          }
          this.scrolling = false
        }, 100)
      }
    }
  },
  mounted: async function() {
    setTimeout(() => {
      // console.log('test')
      this.store.socket.emit('interim', 'test')
    }, 3000)
    this.store.rightRef = this.$refs.right
    // scroll right to bottom
    this.store.scrollMessages = () => {
      if (!this.store.autoScroll) return
      // console.log('scrolling')
      this.$nextTick(() => {
        this.$refs.right.scrollTop = this.$refs.right.scrollHeight
      });
    }
    this.store.scrollMessagesDownSmall = (oldScrollHeight) => {
      // console.log(this.$refs.right.scrollHeight - oldScrollHeight)
      // scroll down by height of refs.right
      this.$refs.right.scrollTop = this.$refs.right.scrollHeight - oldScrollHeight
    }
    this.store.initAtBottom = () => {
      if (this.$refs.right.scrollHeight <= this.$refs.right.clientHeight)
        this.store.atBottom = true
      else
        this.store.atBottom = false
      // console.log('atBottom', this.store.atBottom)
    }
    const { username } = this.$route.params
    this.store.messagesOpenFor = username
    await this.store.getFriendRequests()
    if (username) {
      await this.store.getMessages()
      this.$refs.right.scrollTop = this.$refs.right.scrollHeight
    }
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
<div class="right" ref="right" :class="{ 'invisible': !store.messagesOpenFor }" @scroll="onScroll">
  <InputBar />
  <div class="messages">
    <Chat :message="message" v-for="message in store.messages" />
    <WaitingAccept v-if="waitingEnabled" />
    <Interim direction="recipient" v-if="store.messagesOpenFor" :class="{ 'invisible': !store.rightInterim }" />
    <Interim direction="sender" v-if="store.messagesOpenFor" :class="{ 'invisible': !store.leftInterim }" />
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
  scroll-behavior: v-bind('store.scrollBehavior');
}
/* .right > div:nth-child(3) {
  margin-top: 32px;
}
.right > div:last-child {
  margin-bottom: 40px;
} */
.messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.messages > div:first-child {
  margin-top: 38px;
}
.messages > div:last-child {
  margin-bottom: 110px;
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
</style>