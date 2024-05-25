<template>
  <div>
    <loading v-if="isLoading"></loading>
    <div>

      <div class="navbar" style="display: flex;">
        <vs-button @click="volver()">
          <span class="material-icons-outlined">
            arrow_back
          </span>
        </vs-button>

        <div v-if="!isLoading" style="display: flex; justify-content: flex-end;">

          <div v-for="(usuario, index) in ensala ">
            <div style="width: 50px; height: 50px; border: 3px solid white; border-radius: 30px; margin-right: 5px;">
              <img style="width: 50px; height: 50px;border-radius: 30px;" :src=usuario.imagenperfil alt="">
            </div>
          </div>

        </div>

        <div class="iniciar_menu">

          <vs-button id="boton-iniciar" v-if="isChoferViaje && this.viajeSeleccionado.estado == 'Activo'"
            @click="iniciarViaje()">
            INICIAR
          </vs-button>
          <vs-button id="boton-iniciar" success v-if="isChoferViaje && this.viajeSeleccionado.estado == 'En curso'"
            @click="finalizarViaje()">
            FINALIZAR
          </vs-button>

          <div class="menuinicio">
            <MenuInicioViaje />
          </div>

        </div>
      </div>

      <div v-if="this.$store.state.opcion == 'chat'" class="chatcontenedor">
        <chatusuarios @cambioestado="cambio2" />
      </div>

      <div id="map" ref="map"></div>
    </div>
  </div>
</template>
<script>
import loading from "@/components/loading.vue";
import API from "@/api";
import mapboxgl from "!mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxClient from "@mapbox/mapbox-sdk";
import MapboxDirections from "@mapbox/mapbox-sdk/services/directions";
import Vue from 'vue'
import Vuesax from 'vuesax'
import chatusuarios from "../components/chatusuarios.vue"
import Loading from '../components/loading.vue';
import InformacionChofer from "@/components/InformacionChofer.vue";
import MenuInicioViaje from "@/components/MenuInicioViaje.vue";
Vue.use(Vuesax)
export default {
  name: "MapboxMap",
  data() {
    return {
      activeinfo: false,
      conductorInfo: null,
      value2: '',
      map: null,
      geocoder: null,
      marker1: null,
      marker2: null,
      marker3: null,
      mapboxGeocoder: null,
      routeLayer: null,
      coordinates: null,
      routeGeoJSON: null,
      zoom: 0,
      origen: this.$store.state.origenseleccionado,
      destino: this.$store.state.destinoseleccionado,
      puntosdeparada: [],
      mostrar: false,
      chat: this.$store.state.activarchat,
      eschoferdelviaje: false,
      infochofer: false,
      active: 0,
      active2: 0,
      isChoferViaje: null,
      viajeSeleccionado: null,
      isLoading: null,
      conectadosroom: [],
      viajeActualizado: null,
      pasajerosActualizados: [],
      conectadosroomNombres: [],
      conectadosroomID: [],
      origenviajeSeleccionado: null,
      destinoviajeSeleccionado: null,
      intervalID: null,
      origin: null,
      destination: null,
      markerchofer: null,
      viajeiniciado: false,
      ensala: [],
      watchId: null

    };
  },
  async beforeMount() {



  },
  async mounted() {

    this.isLoading = true
    this.$store.state.opcion = null

    this.$store.commit('conectarSocketRoom');
    this.$store.commit('unirSalaSocket');

    console.log(localStorage.getItem("gpspermisos"))
    await this.obtenerViaje()
    this.obtenerUsuariosTiempoReal()
    mapboxgl.accessToken =
      "pk.eyJ1IjoidGhlcm9kcm9nbyIsImEiOiJjbDIxOWFueHUweWk0M2NvNjV3M2I0ZWcwIn0.-HRLRZ2Adj0LExGfnJiajQ";
    await this.initializeMap();
    this.$store.state.historialviajeseleccionado
    this.recibirCoordenadas()
    this.recibirInicioSocketRoom()
    this.$store.state.historialviajeseleccionado
    this.isLoading = false



  },

  async beforeDestroy() {
    this.$store.commit('desconectarSocketRoom');
    if (this.intervalID != null) {
      clearInterval(this.intervalID);
      navigator.geolocation.clearWatch(this.watchId);
    }

  },
  methods: {
    recibirInicioSocketRoom(){
      this.$store.state.socketRoom.on('RecibirInicio', () => {
        this.viajeSeleccionado.estado="En curso"
        if(this.viajeSeleccionado.choferid !=  JSON.parse(localStorage.getItem("carpooltoken"))._id){
this.openNotification("El chofer ha iniciado el viaje ", 2000, "", "success")
        }
      });
    },
    IniciarViajeSocketRoom() {
      this.$store.state.socketRoom.emit('iniciarViaje',this.$store.state.historialviajeseleccionado)
    },
    async obtenerGPS() {
      console.log("#")

      console.log(this.viajeSeleccionado.estado)

      if (this.viajeSeleccionado.choferid == await JSON.parse(localStorage.getItem("carpooltoken"))._id
      ) {

        var options = {
          enableHighAccuracy: true, // Habilita la máxima precisión posible
          

        };
        this.intervalID= setInterval(() => {
          if(this.viajeSeleccionado.estado =="En curso"){
            this.watchId =  navigator.geolocation.getCurrentPosition(
            (position) => {
              this.EnviarCoordenadas([position.coords.longitude, position.coords.latitude])
              this.markerchofer.setLngLat([position.coords.longitude, position.coords.latitude])
              localStorage.setItem("gpspermisos","activo")
            },
            (error) => {
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  this.error = "El usuario ha denegado el acceso a la ubicación.";
                  break;
                case error.POSITION_UNAVAILABLE:
                  this.error = "Información de ubicación no disponible.";
                  break;
                case error.TIMEOUT:
                  this.error = "La solicitud para obtener la ubicación del usuario ha expirado.";
                  break;
                case error.UNKNOWN_ERROR:
                  this.error = "Un error desconocido ocurrió.";
                  break;
              }
            },
            {
              enableHighAccuracy: true,
              
             
            }
          );
          }
          /*  navigator.geolocation.clearWatch(this.watchId);
           this.watchId = navigator.geolocation.watchPosition(
           (position) => {
             //this.openNotification(position.coords.longitude +" "+ position.coords.latitude, 3000, "", "danger", "top-right")


             //this.$store.commit('EnviarCoordenadas', [this.markerchofer.getLngLat().lng, this.markerchofer.getLngLat().lat])
             this.$store.commit('EnviarCoordenadas', [position.coords.longitude, position.coords.latitude])


           },
           (error) => {
             console.error('Error al obtener la ubicación:', error);
           },options
 
         ); */
        }, 2000)

      }
    },

    recibirCoordenadas() {
      this.$store.state.socketRoom.on('recibirCoordenadas', (coordenadas) => {
        if(this.viajeSeleccionado.estado =="En curso" && this.viajeSeleccionado.choferid != JSON.parse(localStorage.getItem("carpooltoken"))._id) {
          this.markerchofer.setLngLat(coordenadas)
          console.log(coordenadas)
        }
        
        





      });
    },
    EnviarCoordenadas(coordenadas) {
      this.$store.state.socketRoom.emit('enviarCoordenadas', this.$store.state.historialviajeseleccionado, coordenadas)
    },
    async getConductor() {
      this.activeinfo = !this.activeinfo
      this.conductorInfo = await API.getuserbyid(this.viajeSeleccionado.choferid)
    },
    async iniciarViaje() {
     
        this.isIniciandoviaje = true
        this.isLoading = true
        const data = {
          viajeid: this.$store.state.historialviajeseleccionado,
          estado: "En curso"
        }
        this.viajeiniciado = true
        await API.changeStateViajebyid(data)
        await this.obtenerViaje()
        this.IniciarViajeSocketRoom()
        const cambioPasajero = {
          viajeid: this.$store.state.historialviajeseleccionado,
          pasajeros: this.conectadosroomID
        }
        this.conectadosroomID = [...new Set(this.conectadosroomID)]
        this.pasajerosActualizados = this.conectadosroomID

        await API.updatePasajerosViaje(cambioPasajero)

        console.log(this.pasajerosActualizados)

        this.isLoading = false
        this.$vs.notification({
          color: "success",
          title: "Viaje iniciado",
          text: "El viaje ha iniciado con éxito",df
        })
        this.isIniciandoviaje = false
      

    },
    async finalizarViaje() {
      this.isFinalizandoviaje = true
      this.isLoading = true
      const data = {
        viajeid: this.$store.state.historialviajeseleccionado,
        estado: "Finalizado"
      }

      await API.changeStateViajebyid(data)
      // Enviamos la notificacion a la base de datos por si no esta conectado al socket
      const now = new Date(Date.now());
      const day = now.getDate();
      const monthIndex = now.getMonth();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      const month = monthNames[monthIndex];

      // Primero obtenemos los pasajeros del viaje
      this.pasajerosActualizados = await API.getviajebyid(this.$store.state.historialviajeseleccionado)
      console.log("ENVINDO NOTI DE CALIFICACION!!!!!!!!!!", this.pasajerosActualizados)
      this.pasajerosActualizados.pasajeros.forEach(async element => {
        var usuario = await API.getuserbyid(element._id)
        console.log("USUARIO", usuario, "ELEMENT", element)
        const notificacion = {
          emisor: null,
          receptor: usuario._id,
          tipo: "Viaje finalizado",
          estado: false,
          fecha: day + " de " + month + " a las " + hours + ":" + minutes,
          idviaje: this.$store.state.historialviajeseleccionado,
          origen: "",
          destino: "",
          nombrepasajero: usuario.nombre,
          parada: null,
          vistoemisor: false,
          vistoreceptor: false,
        }
        console.log("CALIFICACION PARA EL USER", usuario, " ESTA ES SU NOTI", notificacion)
        await API.addNotificacion(notificacion)
      });
      this.isLoading = false
      this.$vs.notification({
        duration: 2000,
        color: "success",
        title: "Viaje finalizado",
        text: "El viaje ha finalizado con éxito",
      })
      this.isFinalizandoviaje = false
      this.$router.push({ path: '/cliente' })
    },
    async obtenerUsuariosTiempoReal() {
      await this.$store.state.socketRoom.on('usuariosActualizado', async (users) => {
        var viaje = await API.getviajebyid(this.$store.state.historialviajeseleccionado)
        console.log('Tiempo real - Usuarios en la sala:', users);
        this.conectadosroom = []
        this.ensala = []
        users.forEach(async element => {
          const usuario = await API.getuserbyid(element)
          if (usuario._id != JSON.parse(localStorage.getItem("carpooltoken"))._id) {
            this.conectadosroomNombres.push(usuario.nombre)
            this.conectadosroomID.push(usuario._id)
            this.ensala.push(usuario)
            this.conectadosroomID = [...new Set(this.conectadosroomID)]
            this.conectadosroomNombres = [...new Set(this.conectadosroomNombres)]
            this.ensala = [...new Set(this.ensala)]

            console.log("USUARIO EN SALA WIAJAJA", this.ensala)
          }
        });
        await this.$vs.notification({
          color: 'success',
          title: 'Actualizacion usuarios en la sala',
          position: "top"
        })
      });
    },

    volver() {
      this.$router.push({ path: '/cliente' })
    },
    cambiarOpcion(opcion) {
      if (opcion == "chat") {
        this.$store.state.opcion = "chat"
      }
      else {
        this.$store.state.opcion = "info"
      }
      console.log(this.$store.state.opcion)
    }, openNotification(titulo, duration, text, color, position) {
      // Envia una notificacion (es de vuesax)
      this.$vs.notification({
        color: color,
        duration: duration,
        title: titulo,
        text: text,
        position: position
      })
    },
    async obtenerViaje() {

      await API.getviajebyid(this.$store.state.historialviajeseleccionado)
        .then((viajeSeleccionado) => {
          this.viajeSeleccionado = viajeSeleccionado;
          this.origenviajeSeleccionado = viajeSeleccionado.origen;
          this.destinoviajeSeleccionado = viajeSeleccionado.destino;
          this.puntosdeparada = this.viajeSeleccionado.parada
          this.viajeiniciado = viajeSeleccionado.estado
          console.log('tag', 'viaje selecionado')
          console.log(this.viajeSeleccionado)

          if (viajeSeleccionado.choferid == JSON.parse(localStorage.getItem("carpooltoken"))._id) {
            this.isChoferViaje = true
            this.obtenerGPS()


          } else {
            this.isChoferViaje = false
          }
          // La llamada a la API fue exitosa, puedes continuar con el código aquí

        })
        .catch((error) => {
          // Ocurrió un error durante la llamada a la API, puedes manejarlo aquí
          console.error('Error al obtener el viaje seleccionado:', error);
        });


    },
    activarinfochofer() {
      this.infochofer = !this.infochofer
    },
    createMarkerElement(iconUrl) {
      const markerElement = document.createElement("div");
      markerElement.style.backgroundImage = `url(${iconUrl})`;
      markerElement.style.width = "50px";
      markerElement.style.height = "50px";
      markerElement.style.backgroundRepeat = 'no-repeat';
      markerElement.style.backgroundSize = "contain";
      return markerElement;
    },

    initializeMap() {
      const mapboxClient = MapboxClient({ accessToken: mapboxgl.accessToken });
      this.directionsClient = MapboxDirections(mapboxClient);

      this.map = new mapboxgl.Map({
        container: this.$refs.map,
        style: "mapbox://styles/therodrogo/clg72edy900cs01pp0z1rf0r9",
        center: [-71.23025064539733, -35.00254581757482],
        zoom: 13,
      })


      this.map.on("load", () => {
        this.markerchofer = new mapboxgl.Marker({
          draggable: false,
          element: this.createMarkerElement("https://i.ibb.co/JHhpNxB/auto.png"),
        }).setLngLat([0, 0])
          .addTo(this.map);

        if (this.destinoviajeSeleccionado.nombre == "Universidad de talca, sede Los niches") {
          //origen
          this.marker1 = new mapboxgl.Marker({
            draggable: false,
            element: this.createMarkerElement("https://i.ibb.co/px8KtHj/logogps.png"),
          })
            .setLngLat([this.origenviajeSeleccionado.lng, this.origenviajeSeleccionado.lat])
            .addTo(this.map);
          //marker de destino
          this.marker2 = new mapboxgl.Marker({
            draggable: false,
            element: this.createMarkerElement("https://i.ibb.co/z2gLGgb/logofacultadgps.png"),
          })
            .setLngLat([this.destinoviajeSeleccionado.lng, this.destinoviajeSeleccionado.lat])
            .addTo(this.map);


        } else {
          //origen
          this.marker1 = new mapboxgl.Marker({
            draggable: false,
            element: this.createMarkerElement("https://i.ibb.co/z2gLGgb/logofacultadgps.png"),
          })
            .setLngLat([this.origenviajeSeleccionado.lng, this.origenviajeSeleccionado.lat])
            .addTo(this.map);

          //marker de destino
          this.marker2 = new mapboxgl.Marker({
            draggable: false,
            element: this.createMarkerElement("https://i.ibb.co/px8KtHj/logogps.png"),
          })
            .setLngLat([this.destinoviajeSeleccionado.lng, this.destinoviajeSeleccionado.lat])
            .addTo(this.map);


        }

        this.centrarruta()

        this.map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: [],
              },
            },
          },
          layout: {
            "line-join": "bevel",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#DB423F",
            "line-width": 6,
            'line-opacity': 0.7,
          },
        });

        this.updateRoute();


      });

    },
    updateRoute() {

      this.origin = this.marker1.getLngLat();
      this.destination = this.marker2.getLngLat();


      this.directionsClient
        .getDirections({
          profile: "driving",
          waypoints: [
            { coordinates: [this.origin.lng, this.origin.lat] },
            { coordinates: [this.destination.lng, this.destination.lat] },

          ],
          geometries: "geojson",
        })
        .send()
        .then(response => {



          this.routeGeoJSON = response.body.routes[0].geometry;
          this.map.getSource("route").setData(this.routeGeoJSON);
          console.log(this.viajeSeleccionado.pasajeros)

          console.log(this.puntosdeparada)
          for (let index = 0; index < this.puntosdeparada.length; index++) {
            if ((this.viajeSeleccionado.pasajeros[index]._id == JSON.parse(localStorage.getItem("carpooltoken"))._id)
              || this.viajeSeleccionado.choferid == JSON.parse(localStorage.getItem("carpooltoken"))._id) {
              const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML('<div class="custom-popup">' + this.viajeSeleccionado.pasajeros[index].nombre + '</div>');
              if (this.destinoviajeSeleccionado.nombre == "Universidad de talca, sede Los niches") {
                //sube

                this.coordinates = this.routeGeoJSON.coordinates
                this.marker3 = new mapboxgl.Marker({
                  draggable: false,
                  element: this.createMarkerElement("https://i.ibb.co/C504QXV/subidasi.png"),
                })
                  .setLngLat(this.puntosdeparada[index])
                  .setPopup(popup)
                  .addTo(this.map);
                const markerElement = this.marker3.getElement();

                // Establece el estilo de fondo del marcador para que no se repita la imagen
                markerElement.style.backgroundRepeat = 'no-repeat';
              } else {
                //baja
                this.coordinates = this.routeGeoJSON.coordinates
                this.marker3 = new mapboxgl.Marker({
                  draggable: false,


                  element: this.createMarkerElement("https://i.ibb.co/Zxn9JYy/bajada.png"),
                })

                  .setLngLat(this.puntosdeparada[index])
                  .setPopup(popup)
                  .addTo(this.map);
              }

            }


          }



        })
        .catch(error => {
          console.error("Error al obtener la ruta:", error);
        });
    }
    , centrarruta() {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend({ lng: this.marker2.getLngLat().lng, lat: this.marker2.getLngLat().lat });
      bounds.extend({ lng: this.marker1.getLngLat().lng, lat: this.marker1.getLngLat().lat });
      this.map.fitBounds(bounds, { padding: 150 });

    }, mostrarBotones() {
      this.mostrar = !this.mostrar;
    }, activarchat() {
      this.chat = !this.chat
      this.$store.state.activarchat = !this.$store.state.activarchat
    }, cambio2() {
      this.chat = !this.chat
      this.$store.state.activarchat = !this.$store.state.activarchat
    }, cambio3() {

      this.infochofer = !this.infochofer;

    }

  }, components: {
    chatusuarios,
    Loading,
    InformacionChofer,
    MenuInicioViaje
  }
}
</script>
 
<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
}

.menuinicio {
  position: fixed;
  z-index: 40;
}

.navbar {
  position: fixed;
  z-index: 40;
  width: 100vw;
  height: 55px;
  background-color: rgba(255, 255, 255, 0.445);
}

.mapboxgl-ctrl-top-right .mapboxgl-ctrl {
  float: right;
  margin: 10px 10px 0 22px;
}

.boton-centrado {
  position: fixed;
  bottom: 20px;
  left: 20px;
  /* ajustar la propiedad left para mover el botón a la izquierda */
  text-align: center;
  z-index: 499;
}

.boton-encima-mapa {
  z-index: 500;
}

.botones-adicionales {
  margin-top: 10px;
}

.chatcontenedor {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 10001;
}

.custom-popup {
  font-size: 20px;
}

.infochofercontenedor {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 10001;
}

#boton-volver {
  position: fixed;
  top: 20px;
  z-index: 10001;
}

.iniciar_menu {
  display: flex;

  position: fixed;
  width: 100vw;
  justify-content: center;

  bottom: 55px;
  z-index: 10001;

  z-index: 10001;
}

.chatinfo {
  display: flex;
}

#info {
  position: fixed;
  top: 2%;
  right: 5%;
  margin: 10px;
  z-index: 10001;
}

.usuarios {
  position: absolute;
  top: 2%;
  right: 5%;
  margin: 10px;
  z-index: 10002;
}


#boton-chat {

  height: 50px;
}

#boton-chat img {
  height: 27px;
  color: white;
}

#boton-info {
  height: 50px;
}

#boton-iniciar {
  width: 50%;

}
</style>