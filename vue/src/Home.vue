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
    }
  },
  methods: {
  }
}
</script>

<template>
<div class="left">
  <Friends />
</div>
<div class="right">
  <InputBar />
  <div class="left-bubble-wrapper">
    <Chat align="left" />
  </div>
  <div class="right-bubble-wrapper">
    <Chat align="right" />
  </div>
  <div class="left-bubble-wrapper">
    <Chat align="left" />
  </div>
  <div class="right-bubble-wrapper">
    <Chat align="right" />
  </div>
  <div class="left-bubble-wrapper">
    <Chat align="left" />
  </div>
  <div class="right-bubble-wrapper">
    <Chat align="right" />
  </div>
  <div class="left-bubble-wrapper">
    <Chat align="left" />
  </div>
  <div class="right-bubble-wrapper">
    <Chat align="right" />
  </div>
  <div class="left-bubble-wrapper">
    <Chat align="left" />
  </div>
  <div class="right-bubble-wrapper">
    <Chat align="right" />
  </div>
  <div class="left-bubble-wrapper">
    <Chat align="left" />
  </div>
  <div class="right-bubble-wrapper">
    <Chat align="right" />
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
}
.right > div:nth-child(2) {
  margin-top: 32px;
}
.right > div:last-child {
  margin-bottom: 200px;
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
</style>