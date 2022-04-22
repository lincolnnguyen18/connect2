<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
<script>
// import { RouterLink, RouterView } from 'vue-router'
// import Login from './Login.vue'
// import Register from './Register.vue'
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
  data () {
    return {
    }
  },
  methods: {
  },
  mounted () {
    console.log('App mounted')
  },
}
</script>

<template>
<RouterView />
</template>

<style>
body {
  margin: 0;
  background: #EAEFF6;
  font-family: 'Roboto', sans-serif;
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
</style>
