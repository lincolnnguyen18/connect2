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
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    align() {
      return this.message.directiona === 'sender' ? 'flex-start' : 'flex-end'
    },
    bubbleWrapper() {
      return this.message.direction === 'sender' ? 'left-bubble-wrapper' : 'right-bubble-wrapper'
    },
    date() {
      // mysql utc date (2022-04-27T00:19:00.000Z) to local date time
      // let date = new Date(Date.parse(this.message.created_at.substring(0, 19)))
      // return date.toLocaleString()
      // return date.toString()
      return ""
      // return this.message.created_at
    }
  }
}
</script>

<template>
<div :class="bubbleWrapper">
  <div class="bubble-wrapper">
    <div class="bubble">{{ this.message.body }}</div>
    <!-- <div class="date">7:27 PM · April 21, 2022</div> -->
    <!-- <div class="date">{{ this.date }}</div> -->
  </div>
</div>
</template>

<style scoped>
.bubble-wrapper {
  align-items: v-bind('align');
}
</style>