<template>
    <div>
        <div v-if="this.$store.state.vistaViaje == null">
            <loading v-if="isLoading"></loading>
            <div class="caja">
                <div class="tab">
                    <div class="buscarGrande">
                        <div class="buscar">
                            <vs-input style="width: 80%;" v-model="value1" @keyup="buscar" placeholder="Buscar destino">
                            </vs-input>
                            <div class="botonBuscar">
                                <vs-button id="btnBuscar" success>
                                    <span class="material-icons-outlined">
                                        search
                                    </span>
                                </vs-button>
                                <vs-button id="btnBorrar" success style="display: none;">
                                    <span class="material-icons-outlined">
                                        delete
                                    </span>
                                </vs-button>
                            </div>
                        </div>
                        <div class="filtro" id="Filtrar">
                            <vs-select v-model="value2">
                                <vs-option label="Fecha más reciente" value="1">
                                    Fecha más reciente
                                </vs-option>
                                <vs-option label="Fecha más antigüa" value="2">
                                    Fecha más antigüa
                                </vs-option>
                                <vs-option label="Precio más barato" value="3">
                                    Precio más barato
                                </vs-option>
                                <vs-option label="Precio más caro" value="4">
                                    Precio más caro
                                </vs-option>


                            </vs-select>
                            <!-- switch desde hacia utalca -->
                            <div style="margin: auto;">
                                <vs-switch style="width: fit-content;" v-model="switch_desde_hacia_utalca" success>
                                    <template #on>
                                        Hacia UTALCA
                                    </template>
                                    <template #off>
                                        Desde UTALCA
                                    </template>
                                </vs-switch>
                            </div>
                        </div>


                    </div>


                </div>
                <div id="here">
                    <div>
                        <div v-for="(item, index) in viajesBusqueda" :key="index">
                            <div>
                                <CardViaje :viaje-seleccionado="item" />
                            </div>
                        </div>
                        <div class="vacio" v-if="viajesBusqueda.length == 0">
                            <div class="vacio-content">
                                <img src="https://i.ibb.co/qmsNTvn/logo.png" alt="">
                                <p>No se encuentran viajes disponibles intentelo más tarde</p>
                            </div>

                        </div>

                    </div>
                </div>
            </div>


        </div>
        <div class="contenedor" v-if="$store.state.vistaViaje != null">
            <div class="mapa">
                <Elegirviaje :origen="this.$store.state.vistaViaje.origen"
                    :destino="this.$store.state.vistaViaje.destino" />
            </div>

            <div class="contenElegir">

                <div class="botonVolver">
                    <vs-button @click="$store.state.vistaViaje = null, obtenerViajes">
                        <span class="material-icons">arrow_back</span>
                    </vs-button>
                </div>
                <div class="unirse2">
                    <vs-button @click="revisardistancia">
                        <p>
                            UNIRSE
                        </p>
                    </vs-button>
                    <!-- fonts style -->
                    <!-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
            <vs-button id="startRecording" @click="startRecording" class="start-recording-button" v-if="showStartButton" >  <i class="fa fa-microphone"></i> </vs-button>
            <vs-button id="stopRecording" @click="stopRecording" class="stop-recording-button" v-if="showStopButton" >{{ formatTime(recordingTime) }}</vs-button> -->
                </div>

            </div>
        </div>
    </div>
</template>
    
<script>
import API from '@/api';
import loading from './loading.vue';
import { viajeBus } from '@/main';
import CardViaje from './CardViaje.vue';
import Elegirviaje from './Elegirviaje.vue'

import { NotiBus } from '../main.js';


export default {
    components: { loading, CardViaje, Elegirviaje },
    data: () => ({

        // showStartButton: true,
        // showStopButton: false,
        // recording: false,
        // chunks: [],
        // mediaRecorder: null,
        // audioRef: null,
        // audioUrl: null,
        // recordingTime: 0,
        select1Normal: '',
        select1: 2,
        active: 1,
        active2: 0,
        active3: false,
        value1: '',
        value2: 1,
        viajes: [],
        viajesBusqueda: [],
        input: '0',
        active5: true,
        newArr: [],
        newObj: [],
        copyOfArray: [],
        flag: 0,
        cont: 0,
        isLoading: null,
        userId: null,
        usuariologeado: "",
        switch_desde_hacia_utalca: false,

    }),


    methods: {
        test() {
            console.log(this.viajesBusqueda)
        },
        async obtenerViajes() {
            // LOADING
            this.isLoading = true
            this.viajes = await API.getallviajes();


            //ordenar por fecha más actual a más antigüo
            function convertirFecha(fechaString) {

                var fechaSp = fechaString.split("-");
                var anio = new Date().getFullYear();

                if (fechaSp.length == 3) {
                    anio = fechaSp[2];
                }

                var mes = fechaSp[1] - 1;
                var dia = fechaSp[0];

                return new Date(anio, mes, dia);
            }
            this.viajes.sort(function (a, b) {
                return convertirFecha(b.fecha) - convertirFecha(a.fecha);
            })
            // Mostrar los viajes donde el usuario no es pasajero ni chofer
            var viajes_no_usuario = []
            this.viajes.forEach(async element => {
                console.log(element.choferid + " != " + JSON.parse(localStorage.getItem('carpooltoken'))._id)

                if (element.choferid != JSON.parse(localStorage.getItem('carpooltoken'))._id && element.estado == 'Activo' && element.disponibles > 0) {

                    if (!element.pasajeros.includes(JSON.parse(localStorage.getItem('carpooltoken'))._id)) {
                        await viajes_no_usuario.push(element)
                    }
                }
            });
            this.viajes = viajes_no_usuario

            // Mostrar los viajes en donde el usuario solo sea del mismo rol del conductor
            var viajes_no_actividad = []
            this.viajes.forEach(async element => {
                var choferviaje = await API.getuserbyid(element.choferid)
                console.log("¿" + choferviaje.actividad + "==" + JSON.parse(localStorage.getItem('carpooltoken')).actividad + "?")
                if (choferviaje.actividad == JSON.parse(localStorage.getItem('carpooltoken')).actividad) {
                    await viajes_no_actividad.push(element)
                }
            });
            console.log("VIAJES NO ACTIVIDAD ", viajes_no_actividad)
            this.viajes = viajes_no_actividad
            console.log("VIAJES FINAL", this.viajes)

            this.viajesBusqueda = this.viajes;
            console.log("VIAJES BUSKEDA", this.viajesBusqueda)


            this.isLoading = false
        },
        async revisardistancia() {
            const turf = require('@turf/turf');
            var umbralDistancia = 500;
            const lineString = turf.lineString(this.$store.state.coordenadas);
            const marker = turf.point([this.$store.state.posicionseleccionada.lng, this.$store.state.posicionseleccionada.lat])
            const nearestPointOnLine = turf.nearestPointOnLine(lineString, marker);
            const distanceToLine = turf.distance(nearestPointOnLine, marker, { units: 'meters' });

            if (distanceToLine <= umbralDistancia) {
                this.active = "viajar"
                /*  this.openNotification("Viaje seleccionado",3000,"revisa la información de tu viaje en tu apartado de viajes","success")
               */   // Enviamos la not
                const notificaciones = await API.getallnotificaciones()

                notificaciones.forEach(e => {
                    if (e.idviaje == this.$store.state.vistaViaje._id && e.emisor == JSON.parse(localStorage.getItem('carpooltoken'))._id) {
                        this.seEnvio = true
                    }
                });

                if (this.seEnvio) {
                    console.log('Solicitud repetida')
                    this.openNotification("Solicitud", 2000, "La solicitud esta repedida.", 'danger', 'bottom')
                    this.$store.state.vistaViaje = null
                    this.obtenerViajes()
                }
                else {
                    NotiBus.$emit('enviarNotificacion', 'Solicitud unirse viaje');
                    this.$store.state.vistaViaje = null
                    this.obtenerViajes()
                }

            } else {
                this.openNotification("Posición incorrecta para subir", 2000, "Estas a " + Math.trunc(distanceToLine) + " metros del punto de parada más cercano ", "danger",
                    "bottom")
            }

            /* const distanceToLine = turfdistance(nearestPointOnLine, turf.point(this.$store.state.posicionseleccionada));
            Console.log(distanceToLine ) */
        },
        async obtenerSocketViajes() {
           
                this.$store.state.socket.on("viaje:recibido", (data) => {
                    var toker_carpool = JSON.parse(localStorage.getItem('carpooltoken'))
                    if (data.actividad == toker_carpool.actividad && data.choferid != toker_carpool._id) {
                        const loading = this.$vs.loading({
                            type: 'default'
                        })
                        this.obtenerViajes();
                        loading.close()
                    }
                });
            
        },
        enviarViajes(data) {
            this.$store.state.socket.emit("viaje:enviado", data);
        },
        buscar() {
            this.value1 = this.value1.toLowerCase()
            if (this.value1 == "") {
                this.viajesBusqueda = this.viajes
            } else {
                var viajeCambiado
                if (this.active3) {
                    viajeCambiado = this.viajes.filter(viaje => viaje.destino.nombre.toLowerCase().indexOf(this.value1) !== -1)
                } else {
                    viajeCambiado = this.viajes.filter(viaje => viaje.origen.nombre.toLowerCase().indexOf(this.value1) !== -1)
                }
                this.viajesBusqueda = viajeCambiado
            }
        },
        filtrar() {
            switch (this.value2) {
                case "1": // Fecha más reciente
                    this.viajesBusqueda.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                    break;
                case "2": // Fecha más antigüa
                    this.viajesBusqueda.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                    break;
                case "3": // Precio más barato
                    this.viajesBusqueda.sort((a, b) => a.precio - b.precio);
                    break;
                case "4": // Precio más caro
                    this.viajesBusqueda.sort((a, b) => b.precio - a.precio);
                    break;
            }
        },
        desdeHaciaUtalca() {
            //True=haciautalca False=desdeutalca
            if (this.switch_desde_hacia_utalca) {
                //console.log("desde")
                let viajes = this.viajes;
                //this.viajesBusqueda = this.viajesBusqueda.filter(viaje => viaje.haciautalca == true);

                viajes = this.viajes.filter(function (el) {
                    return el.haciautalca == false
                }
                );
                this.viajesBusqueda = viajes;
            } else {
                //console.log("hacia")
                //this.viajesBusqueda = this.viajesBusqueda.filter(viaje => viaje.haciautalca == false);
                let viajes = this.viajes;
                //this.viajesBusqueda = this.viajesBusqueda.filter(viaje => viaje.haciautalca == true);

                viajes = this.viajes.filter(function (el) {
                    return el.haciautalca == true
                }
                );
                this.viajesBusqueda = viajes;
            }
            //console.log(this.viajesBusqueda)

        },
        openNotification(titulo, duration, text, color, position) {
            // Envia una notificacion (es de vuesax)
            this.$vs.notification({
                position,
                color: color,
                duration: duration,
                title: titulo,
                text: text
            })
        }, getchofer() {
            const token = JSON.parse(localStorage.getItem("carpooltoken"))
            console.log(token)

            this.userId = token._id
        },
    },
    mounted() {
        this.obtenerViajes()
        this.getchofer()
        this.usuariologeado = JSON.parse(localStorage.getItem("carpooltoken"))._id;
    },
    created() {
        // Creamos el evento para que se ejecute la funcion cuando se llame
        this.obtenerSocketViajes()
        viajeBus.$on('enviarViaje', this.enviarViajes);
    },
    watch: {
        value2() {
            this.filtrar();
        },
        switch_desde_hacia_utalca() {
            this.desdeHaciaUtalca();
        },
    },
}
</script>
    
<style  scoped>
.vacio {
    display: flex;
    width: 100%;
    justify-content: center;
    color: #36568c;
}

.vacio-content {
    margin-top: 10%;
    display: flex;
    text-align: center;
    justify-content: center;
    flex-direction: column;
}

.vacio-content img {
    position: relative;
    left: 15%;
    width: 70%;
    opacity: 0.8;
}

.unirse2 {
    position: fixed;
    bottom: 80px;
    left: 33%;
    width: 100px;
    z-index: 500;
    font-size: 200px;

}

.unirse2 .vs-button p {
    font-size: 15px;
    padding-left: 30px;
    padding-right: 30px;
}

.botonVolver {
    height: 60px;

}

.contenElegir {
    display: flex;
}

.caja {
    display: flex;
    flex-direction: column;
    background: white;

}


.tab {
    display: flex;
    background-color: #36568c;
    height: 100px;
    padding-bottom: 5px;
}


.buscar {
    display: flex;
    justify-content: center;
    margin: auto;
    width: 100%;

}

.filtro {
    margin-left: 3%;
    display: flex;
}

.buscarGrande {
    display: flex;
    flex-direction: column;
    width: 100vw;
}


.material-icons-outlined {
    margin-left: 0px;
}


/* .start-recording-button {
  font-size: 40px;
  padding: 12px 20px; 
  background-color: red;
  border-radius: 80%;
  animation: pulse 1s infinite;
  left:300%;
}

.stop-recording-button {
  font-size: 40px; 
  padding: 12px 20px; 
  background-color: rgb(25, 16, 202);
  border-radius: 80%;
  animation: pulse 1s infinite;
  left:300%;
} */

/* @keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
} */
</style>