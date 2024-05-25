import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import SocketioService from "../services/socketio.service";
import * as io from "socket.io-client";

export default new Vuex.Store({
  state: {
    validlogin:false
  },
  getters: {
    menu: state => state.menu
  },
  mutations: {
    cambiarviaje(state, valor) {
      state.menu = valor
    },
    conectarSocket() {
      console.log("conectando...")
      this.socket = io("https://socketnotificacion-wacd334doa-tl.a.run.app");
     /*  this.socket = io("https://carpoolsocketnotificacion-wacd334doa-tl.a.run.app"); */
      this.socket.on("connect_error", (err) => {
        console.log(err.message);
      })
      SocketioService.socket = this.socket;
    },
    desconectarSocket() {
      console.log("desconectando...")
      this.socket.disconnect();
      SocketioService.disconnect();
    }

  },
  actions: {
  },
  modules: {
  }
})
