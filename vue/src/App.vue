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
</style>
