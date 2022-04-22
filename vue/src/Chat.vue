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
    side: {
      type: String,
      required: true
    }
  },
  computed: {
    align() {
      return this.side === 'left' ? 'flex-start' : 'flex-end'
    }
  }
}
</script>

<template>
<div class="bubble-wrapper">
  <div class="bubble">Test test test Test test testTest test testTest test testTest test testTest test test</div>
  <div class="date">7:27 PM · April 21, 2022</div>
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
  text-align: justify;
}
</style>