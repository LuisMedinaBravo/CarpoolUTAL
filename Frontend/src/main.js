import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuesax from 'vuesax'
import 'material-icons/iconfont/material-icons.css';
import 'vuesax/dist/vuesax.css' //Vuesax styles
import Mapbox from "mapbox-gl";
import responsive from 'vue-responsive'
import * as VueGoogleMaps from 'vue2-google-maps';
import TextareaAutosize from 'vue-textarea-autosize'
import 'animate.css';

Vue.use(TextareaAutosize)

export const NotiBus = new Vue();
export const NotiBusVista = new Vue();
export const viajeBus = new Vue();


Vue.use(VueAxios, axios)


Vue.use(responsive)
Vue.config.productionTip = false
// Agregamos la URL base de nuestra API
axios.defaults.baseURL = 'https://backend-taller-production-a403.up.railway.app/api/';
/* axios.defaults.baseURL="http://localhost:8000/api/" */

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBtT0lGLaafi59-5u1lX81HZLJha5_iOMg',
    libraries: 'places,drawing,geometry', 
  },
});


Vue.use(Vuesax, {
  colors: {
    primary:'#36568c',
    success:'#f79034',
    danger:'rgb(242, 19, 93)',
    warning:'rgb(255, 130, 0)',
    dark:'rgb(36, 33, 69)'
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')