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
    close: function () {
      this.store.noLoading = true
      this.$router.push('/')
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
  <input type="text" v-model="store.input" @keyup.enter="store.sendMessage" :class="{ 'disabled': !this.inputBarEnabled }" />
  <div class="buttons">
    <span class="material-symbols-outlined" :class="{ 'disabled': !this.inputBarEnabled }">mic</span>
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
</style>