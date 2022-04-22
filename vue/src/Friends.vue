<script>
import { useMainStore } from './store'
export default {
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
<div class="friends">
  <div class="top">
    <div class="left">
      <span class="h1">Friends</span>
      <span class="material-icons">add</span>
    </div>
    <span class="material-icons">chevron_left</span>
  </div>
  <div class="middle">
    <div class="friend">
      <span>Lincoln</span>
      <span class="material-icons">menu</span>
    </div>
    <div class="friend">
      <span>Maimi</span>
      <span class="material-icons">menu</span>
    </div>
  </div>
  <div class="bottom">
    <div class="left">
      <div class="h2">Microphone language</div>
      <div class="languages">
        <span>English</span>
        <span class="material-icons not-button">arrow_drop_down</span>
      </div>
    </div>
    <span class="material-icons">logout</span>
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
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}
.friend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #efefef;
  padding: 6px 0;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bottom .left {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.languages {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>