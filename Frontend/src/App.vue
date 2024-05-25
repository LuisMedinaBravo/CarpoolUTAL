<template>
  <div>
    <div id="app">
      <div class="cosasO">
        <div class="cosaoscura">
        </div>
        <div class="cosaoscura2">
        </div>
      </div>

      <router-view />
    </div>
  </div>
</template>

<script>
import API from './api';
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
}
</script>
<style >
* {
  font-family: 'poppins', sans-serif;
}

.cosaoscura {
  background-color: transparent;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  /* border-top-right-radius: 15px;
  border-top-left-radius: 15px; */
  box-shadow: -23px -23px 0 0 rgb(0, 0, 0);
}

.cosaoscura2 {
  
  background-color: transparent;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  /* border-top-right-radius: 15px;
  border-top-left-radius: 15px; */
  box-shadow: 23px -23px 0 0 rgb(0, 0, 0);
}

.cosasO {
  pointer-events: none;
  position: fixed;
  display: flex;
  justify-content: space-between;
  width: 100vw;
  z-index: 999999;
}
</style>
