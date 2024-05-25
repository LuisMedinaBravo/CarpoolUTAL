<template>
  <div>

    <Navbar></Navbar>
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
    if (!localStorage.getItem('reloaded')) {
      localStorage.removeItem('carpooltoken');
      localStorage.setItem('reloaded', 'true');
      location.reload();
    } else {
      localStorage.removeItem('reloaded');
    }
  },

  methods: {
    
  },
};
</script>

<style  scoped>



</style>