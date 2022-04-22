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
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    register: async function () {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match')
        return
      } else if (this.username.length < 3) {
        alert('Username must be at least 3 characters')
        return
      } else if (this.password.length < 3) {
        alert('Password must be at least 3 characters')
        return
      } else {
        try {
          await this.store.register(this.username, this.password)
          this.$router.replace('/')
        } catch (err) {
          alert(err)
        }
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
    <div class="input">
      <div>Confirm Password</div>
      <input type="password" v-model="confirmPassword" @keyup.enter="register" />
    </div>
  </div>
  <div class="bottom">
    <span>
      <router-link class="link" to="/login">Back</router-link>
    </span>
    <button @click="register">Register</button>
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