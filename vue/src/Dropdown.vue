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
    },
    startIndex: {
      type: Number,
      required: true
    },
  },
  methods: {
    updateScroll() {
      // scroll item at current index to middle of viewport
      // console.log(this.$refs[`item${this.curIndex}`][0])
      this.$refs[`item${this.curIndex}`][0].scrollIntoView({ block: 'center' })
    }
  },
  data() {
    return {
      keydown: null,
      curIndex: this.startIndex,
      refs: {}
    }
  },
  mounted() {
    // scroll dropdown so that startIndex is visible
    this.$nextTick(() => {
      this.updateScroll()
    });
    // listen for down and up arrow keys
    this.keydown = (e) => {
      if (e.key === 'ArrowDown' && this.curIndex < this.items.length - 1) {
        this.curIndex++
        this.updateScroll()
      } else if (e.key === 'ArrowUp' && this.curIndex > 0) {
        this.curIndex--
        this.updateScroll()
      } else if (e.key === 'Enter') {
        this.$emit('select', this.curIndex)
      // listen for alphabetical keys
      } else if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
        // find first item with a matching letter
        let index = this.items.findIndex(item => item.toLowerCase().startsWith(e.key.toLowerCase()))
        if (index !== -1) {
          this.curIndex = index
          this.updateScroll()
        }
      }
    }
    document.addEventListener('keydown', this.keydown)
  },
  unmounted() {
    document.removeEventListener('keydown', this.keydown)
  }
}
</script>


<template>
  <div class="dropdown" ref="dropdown">
    <div class="item" v-for="(item, index) in items" @click="$emit('select', index)" :class="{ 'item-selected': index === curIndex }" :ref="'item' + index">{{ item }}</div>
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
  left: 0;
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
.item-selected {
  background: #efefef;
}
</style>