<script>
import { useMainStore } from './store'
// import Loading from './Loading.vue'
import { debounce } from 'lodash'
export default {
  setup() {
    const store = useMainStore()
    return { store }
  },
  // components: {
  //   Login,
  //   Register
  // },
  // data () {
  //   return {
  //   }
  // },
  // methods: {
  // },
  mounted() {
    this.store.finishLoading = debounce(this.store.finishLoadingSub, 300)
  },
  // components: {
  //   Loading
  // },
  computed: {
    progessbarWidth() {
      return `${this.store.loadingProgress}%`
    }
  } 
}
</script>

<template>
<div class="progress-bar" v-show="store.loading"></div>
<!-- <div class="loading-screen" v-show="store.loading">
  <Loading :width="100" color="black"></Loading>
</div> -->
<!-- <div class="progress-bar"></div> -->
<RouterView />
</template>

<style>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-screen * {
  user-select: none;
  pointer-events: none;
}
.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 5px;
  background: rgb(105, 105, 105);
  z-index: 100;
  /* width: 100%; */
  width: v-bind(progessbarWidth);
  transition: width 0.2s ease-in-out;
}
html, body, #app {
  height: 100%;
  width: 100%;
  display: flex;
  gap: 48px;
  justify-content: center;
}
body {
  margin: 0;
  background: #EAEFF6;
  font-family: 'Roboto', sans-serif;
}
.input {
  margin-bottom: 10px;
}
input[type="text"], input[type="password"] {
  width: 100%;
  border: 1px solid #EFEFEF;
  box-sizing: border-box;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  background: #fff;
  padding: 7px;
  font-size: 16px;
  color: #333;
}
button {
  border: 1px solid #EFEFEF;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px;
  background: #FDFDFD;
  padding: 7px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;
}
button:hover {
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
}
.h1 {
  font-size: 20px;
  font-weight: bold;
}
.h2 {
  font-size: 16px;
  font-weight: bold;
}
.material-icons, .material-symbols-outlined, .material-icons-round {
  user-select: none;
  cursor: pointer;
}
.material-icons:hover, .material-symbols-outlined:hover, .material-icons-round:hover {
  opacity: 0.5;
}
.not-button {
  pointer-events: none;
}
.invisible {
  visibility: hidden;
}
.disabled {
  opacity: 0.1;
  pointer-events: none;
  user-select: none;
}
</style>
