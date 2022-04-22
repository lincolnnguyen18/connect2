<script>
import { useMainStore } from './store'
export default {
  setup() {
    const store = useMainStore()
    return { store }
  },
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
  }
}
</script>

<template>
<div class="box">
  <div class="top">
    <div class="input">
      <div>Username</div>
      <input type="text" v-model="username" />
    </div>
    <div class="input">
      <div>Password</div>
      <input type="password" v-model="password" />
    </div>
  </div>
  <div class="bottom">
    <span>
      <div>Don't have an account?</div>
      <div class="link">Register</div>
    </span>
    <button @click="login">Login</button>
  </div>
</div>
</template>

<style>
body {
  margin: 0;
  background: #EAEFF6;
  font-family: 'Roboto', sans-serif;
}
html, body, #app {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  margin-bottom: 10px;
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
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.link {
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}
.box {
  background: white;
  border-radius: 16px;
  width: 250px;
  height: 270px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>