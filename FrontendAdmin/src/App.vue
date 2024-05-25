<template>
  <div>
    <div id="app">
      <loadingVue v-if="loader" />
      <router-view v-else />
    </div>
  </div>
</template>

<script>
import API from './api';
import loadingVue from './components/loading.vue';
export default {
  methods: {
    async getuserbyid() {
      const resp = await API.getallviajes()
    }
  },
  data: () => ({
    active: 0,
    menu: 'home',
    loader: true
  }),
  components: {
    loadingVue
  }
  ,mounted() {
    this.interval = setTimeout(() => {
      this.loader = false;
    }, 1200)
  }
}
</script>
<style >

* {
  
  font-family: 'poppins', sans-serif;
}
</style>
