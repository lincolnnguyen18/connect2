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
      return this.message.direction === 'sender' ? 'flex-start' : 'flex-end'
    },
    bubbleWrapper() {
      return this.message.direction === 'sender' ? 'left-bubble-wrapper' : 'right-bubble-wrapper'
    },
    date() {
      // mysql utc date (2022-04-27T00:19:00.000Z) to local date time
      let date = new Date(Date.parse(this.message.created_at.substring(0, 19)))
      return date.toLocaleString()
    }
  }
}
</script>

<template>
<div :class="bubbleWrapper">
  <div class="bubble-wrapper">
    <div class="bubble">{{ this.message.body }}</div>
    <!-- <div class="date">7:27 PM · April 21, 2022</div> -->
    <div class="date">{{ this.date }}</div>
  </div>
</div>
</template>

<style>
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