import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { io } from 'socket.io-client';
import SocketioService from "../services/socketio.service";
export default new Vuex.Store({
  state: {
    idchofermenu: "",
    comentarioActico: false,
    gpspermisos: "sin permisos",
    notificacionActiva: false,
    vistaViaje: null,
    precio: 0,
    asientos: 0,
    fecha: "",
    hora: "",
    haciautalca: true,
    opcion: 0,
    iduser: null,
    marker1: {
      nombre: "",
      lng: 0,
      lat: 0
    },
    activarcomentario: true,
    marker2: {
      nombre: "Universidad de talca, sede Los niches",
      lng: -71.23025064539733,
      lat: -35.00254581757482
    },
    menu: "viajar",
    origenseleccionado: {
      nombre: "",
      lng: 0,
      lat: 0
    },
    destinoseleccionado: {
      nombre: "",
      lng: 0,
      lat: 0
    },
    coordenadas: [],
    posicionseleccionada: {
      lng: 0,
      lat: 0
    },
    salaesperaviaje: null,
    rutavalida: false,
    idchoferseleccionado: null,
    SocketioService: SocketioService,
    idviaje: null,
    activarchat: false,
    historialviajeseleccionado: null,
    socket: null,
    socketRoom: null,
    enviarPajaseros: [], // Para Socket Pasajeros reales
  },
  getters: {
    menu: state => state.menu,
    gethaciautalca: state => state.haciautalca
  },
  mutations: {
    setgpspermisos(state, gpspermisos) {
      state.gpspermisos = gpspermisos;
    },
    cambiarviaje(state, valor) {
      state.menu = valor
    },
    async conectarSocket() {
      console.log("conectando...")
      /* this.state.socket = io("http://localhost:5003"); */

      //google link
      /* this.state.socket = io("https://socketnormal-wacd334doa-tl.a.run.app"); */

      //rail way
      this.state.socket = io("https://socketnormal-production.up.railway.app");

      await this.state.socket.on("connect_error", (err) => {
        console.log(err.message);
      })
    },
    async desconectarSocket() {
      console.log("desconectando...")
      await this.state.socket.disconnect();
    },
    async conectarSocketRoom() {

      /* this.state.socketRoom = io('http://localhost:5050'); */
      //google link
      /* this.state.socketRoom = io('https://socketsalaespera-wacd334doa-tl.a.run.app'); */
     
      //rail way
      this.state.socketRoom = io('https://socketroom-production.up.railway.app/');

      // Nos conectamos al socket
      await this.state.socketRoom.on('connect', () => {
        console.log('Usuario room conectandose...');
      });
    },
    async desconectarSocketRoom() {
      await this.state.socketRoom.disconnect();
      localStorage.removeItem('historialviajeseleccionado')
      console.log("Usuario room desconectando...")
    },
    async unirSalaSocket() {

      this.state.historialviajeseleccionado = localStorage.getItem('historialviajeseleccionado')
      console.log("xxxxadsda")
      console.log(this.state.historialviajeseleccionado)
      await this.state.socketRoom.emit('set id', JSON.parse(localStorage.getItem("carpooltoken"))._id);
      await this.state.socketRoom.emit('join room', this.state.historialviajeseleccionado);
    }
  },
  actions: {

  },
  modules: {
  }
})
