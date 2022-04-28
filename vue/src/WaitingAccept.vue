<script>
import { useMainStore } from './store'
export default {
  setup() {
    const store = useMainStore()
    return { store }
  },
  // data () {
  //   return {
  //     cancelRequestOpen: true,
  //   }
  // },
  methods: {
    decline: async function() {
      this.store.startLoading()
      await this.store.declineFriendRequest()
      this.$router.push('/')
    },
    cancel: async function() {
      this.store.startLoading()
      await this.store.cancelFriendRequest()
      this.$router.push('/')
    },
  },
  // props: {
  //   message: {
  //     type: Object,
  //     required: true
  //   }
  // },
  computed: {
    align() {
      return this.store.messagesOpenForRequest.direction === 'requester' ?  'flex-end' : 'flex-start'
    },
    bubbleWrapper() {
      return this.store.messagesOpenForRequest.direction === 'requester' ? 'right-bubble-wrapper' : 'left-bubble-wrapper'
    },
    text() {
      if (this.store.messagesOpenForRequest.direction === 'requester')
        return `Waiting for ${this.store.messagesOpenForRequest.username} to accept friend request...`
      else
        return `Accept friend request from ${this.store.messagesOpenForRequest.username}?`
    },
    isRequester() {
      return this.store.messagesOpenForRequest.direction === 'requester'
    },
    loaded() {
      this.store.messagesOpenForRequest
    }
  }
}
</script>

<template>
<div :class="bubbleWrapper">
  <div class="bubble-wrapper">
    <div class="bubble">
      {{ text }}
      <div class="buttons" v-show="!isRequester">
        <span class="material-icons" @click="decline">close</span>
        <span class="material-icons" @click="store.acceptFriendRequest">check</span>
      </div>
    </div>
  </div>
</div>
<div :class="bubbleWrapper" v-show="isRequester">
  <div class="bubble-wrapper">
    <div class="bubble">
      <div v-show="isRequester">Cancel request?</div>
      <div class="buttons" v-show="isRequester">
        <span class="material-icons" @click="$router.push('/')">close</span>
        <span class="material-icons" @click="cancel">check</span>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
/* .bubble-wrapper {
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
}
.date {
  font-size: 12px;
  color: #8e8e8e;
} */
.bubble-wrapper:first-child {
  margin-top: 32px;
}
.buttons {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}
</style>