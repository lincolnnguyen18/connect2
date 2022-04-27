<script>
import { useMainStore } from './store'
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
  mounted () {
    console.log(this.store.socket)
    this.store.socket = io();
    this.store.socket.on('connect', () => {
      console.log('connected')
      this.store.socket.emit('login', getCookie('token'))
    })
  },
}
</script>

<template>
<RouterView />
</template>

<style>
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
</style>
