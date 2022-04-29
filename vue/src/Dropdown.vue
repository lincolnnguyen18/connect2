<script>
import { useMainStore } from './store'
export default {
  setup() {
    const store = useMainStore()
    return { store }
  },
  props: {
    fromTop: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  }
}
</script>


<template>
  <div class="dropdown">
    <div class="item" v-for="item in items">{{ item }}</div>
  </div>
</template>

<style scoped>
.dropdown {
  position: absolute;
  background: white;
  border: 1px solid #EFEFEF;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  top: v-bind('fromTop');
  height: v-bind('height');
  overflow: auto;
}
.item {
  border-bottom: 1px solid #efefef;
  padding: 4px 8px;
  position: relative;
}
.item:hover {
  background: #efefef;
}
</style>