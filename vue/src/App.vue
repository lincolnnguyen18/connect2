<script>
import Login from './Login.vue'
import Register from './Register.vue'
import { useMainStore } from './store'
export default {
  setup() {
    const store = useMainStore()
    return { store }
  },
  components: {
    Login,
    Register
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<template>
<Login v-if="store.page == 'login'" />
<Register v-if="store.page == 'register'" />
</template>

<style>
</style>
