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
  },
  props: {
    direction: {
      type: String,
      required: true
    }
  },
  computed: {
    align() {
      return this.direction === 'sender' ? 'flex-start' : 'flex-end'
    },
    bubbleWrapper() {
      return this.direction === 'sender' ? 'left-bubble-wrapper' : 'right-bubble-wrapper'
    },
    text() {
      return this.direction === 'sender' ? this.store.leftInterim : this.store.rightInterim
    }
  }
}
</script>

<template>
<div :class="bubbleWrapper">
  <div class="bubble-wrapper">
    <div class="bubble">{{ this.text }}</div>
  </div>
</div>
</template>

<style scoped>
.bubble-wrapper {
  align-items: v-bind('align');
}
.bubble {
  min-height: 19px;
}
</style>