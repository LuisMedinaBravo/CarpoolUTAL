<template>
  <div class="contenedorapp">

    <Navbar />
    <TabsLP></TabsLP>

 
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import TabsLP from '../components/TabsLP.vue';
export default {
  components: { Navbar, TabsLP },

  name: 'FrontHomeView',

  data() {
    return {
      
    };
  },

  mounted() {
    
    localStorage.removeItem('carpooltoken');
  },

  methods: {
    
  },
};
</script>

<style  scoped>
.contenedorapp{
  width: 100%;
  height: 100%;
}


</style>