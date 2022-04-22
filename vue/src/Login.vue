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
    login: async function () {
      try {
        await this.store.login(this.username, this.password)
        this.$router.replace('/')
      } catch (err) {
        alert(err)
      }
    }
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
      <router-link class="link" to="/register">Register</router-link>
    </span>
    <button @click="login">Login</button>
  </div>
</div>
</template>

<style scoped>
html, body, #app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
  color: black;
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