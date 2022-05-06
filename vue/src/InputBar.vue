<script>
import { useMainStore } from './store'
import Pulse from './Pulse.vue'
export default {
  setup() {
    const store = useMainStore()
    return { store }
  },
  data () {
    return {
    }
  },
  components: {
    Pulse
  },
  methods: {
    close: async function () {
      this.store.noLoading = true
      this.store.loading = true
      this.store.messagesOpenFor = null;
      this.store.messages = [];
      await this.$router.push('/')
    },
    scrollDown: function() {
      this.store.autoScroll = true
      this.store.scrollMessages()
    },
    toggleMic: function() {
      this.store.micOn = !this.store.micOn
      if (this.store.micOn) this.store.startRecording()
      else this.store.stopRecording()
    }
  },
  computed: {
    inputBarEnabled() {
      return this.store.messagesOpenForRequest && this.store.messagesOpenForRequest.accepted_at
    }
  }
}
</script>

<template>
<div class="input-bar">
  <div class="scroll-down" :class="{ 'invisible2': store.atBottom }" @click="scrollDown">
    <span class="material-icons button" @click="scrollDown">arrow_downward</span>
  </div>
  <input type="text" v-model="store.input" @keyup.enter="store.sendMessage(store.input)" :class="{ 'disabled': !this.inputBarEnabled }" placeholder="Type a message..." />
  <div class="buttons">
    <Pulse v-show="store.micOn" :width="24" :radius1="9" :radius2="4" :step="0.05" @click="toggleMic" />
    <span class="material-symbols-outlined" :class="{ 'disabled': !this.inputBarEnabled }" @click="toggleMic" v-show="!store.micOn">mic</span>
    <!-- <span class="material-symbols-outlined" :class="{ 'disabled': !this.inputBarEnabled }">arrow_downward</span> -->
    <span class="material-icons button" @click="close">close</span>
  </div>
</div>
</template>

<style scoped>
.input-bar {
  display: flex;
  position: fixed;
  background: white;
  width: 100%;
  max-width: 837px;
  bottom: 0;
  margin-bottom: 38px;
  align-items: center;
  padding: 7px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
}
.buttons {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 7px;
}
.scroll-down {
  position: absolute;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  z-index: 10;
  right: -100px;
  bottom: 70px;
  transition: opacity 0.1s;
}
</style>