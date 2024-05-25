<template>
    <div>
        <div class="center">
            <vs-avatar color="#FFFFFF" style="margin-top: 3px;" @click="activarNotificacion" badge-color="danger"
                badge-position="top-right">
                <span class="material-icons-outlined" style="color:#36568c;">
                    notifications
                </span>
                
            </vs-avatar>
            <div style="position: fixed; top: 0; left: 0; z-index: 20000;" v-if="$store.state.notificacionActiva">
                <Notificaciones />
            </div>

        </div>
    </div>
</template>
<script>
import { NotiBus } from '../main.js';
import API from '@/api';
import CalificarChofer from './CalificarChofer.vue';
import Notificaciones from './Notificaciones.vue';
export default {
    components: {
        CalificarChofer,
        Notificaciones
    },
    data: () => ({
        active: false,

        persona: {
            mensaje: ''
        },
        mensajes: [],
        estadonoti: false,
        descrip: -1,
        boton: [],
        notificaciones_activas: 0,
        idUsuario: null,
        isLoading: false,
        data_anterior: null,
    }),
    methods: {
        activarNotificacion() {
            console.log("muestra")
            this.$store.state.notificacionActiva = true
        },
        async obtenerSocketNotificaciones() {

                this.$store.state.socket.on("mensaje:recibido", async (data) => {
                    // Envio a un usuario en especifico
                    if (data.receptor == JSON.parse(localStorage.getItem("carpooltoken"))._id) {
    
                        this.notificaciones_activas++;
                        await API.addNotificacion(data);
                        this.openNotification(data.tipo);
                        this.mensajes.push(data);
    
                    }
                });
            
        },
        async enviarNot(tipo) {
            if (tipo == "Solicitud unirse viaje") {
                console.log("Enviando notificacion");
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

                let data = {
                    emisor: JSON.parse(localStorage.getItem("carpooltoken"))._id,
                    receptor: this.$store.state.vistaViaje.choferid,
                    tipo: tipo,
                    estado: null,
                    idviaje: this.$store.state.vistaViaje._id,
                    origen: this.$store.state.vistaViaje.origen.nombre,
                    destino: this.$store.state.vistaViaje.destino.nombre,
                    nombrepasajero: JSON.parse(localStorage.getItem("carpooltoken")).nombre,
                    parada: [this.$store.state.posicionseleccionada.lng, this.$store.state.posicionseleccionada.lat],// añadir el objeto del punto(lo de pablek)
                    fecha: day + " de " + month + " a las " + hours + ":" + minutes,
                    vistoemisor: false,
                    vistoreceptor: false
                }
                var data_actual = data
                console.log("¿(data_anterior)", this.data_anterior, "==null" + "?")
                console.log("¿(data_anterior)", this.data_anterior, "!=(data_actual)", data_actual, "?")
                if (this.data_anterior == null || this.data_anterior != data_actual) {
                    this.data_anterior = data_actual
                    console.log("1")
                    console.log("|", data, "|")
                    this.$store.state.idchoferseleccionado = null
                    this.$store.state.idviaje = null

                    this.$store.state.socket.emit("mensaje:enviado", data);
                } else {
                    this.data_anterior = data_actual
                    console.log("Error Socket")
                }
                this.data_anterior = data_actual
            } else if (tipo == "Resultado solicitud unirse viaje") {
                // SE NECESITA QUE LOS BOTONES FUNCIONEN (--EN DESARROLLO--)

            } else {
                // OTRA COSA

            }
        },
        async leerTodo() {
            // Leemos todos las notificaciones
            this.mensajes = await API.getallnotificaciones();

            this.mensajes.forEach(element => {
                var emisor_receptor = "";
                if (element.emisor == JSON.parse(localStorage.getItem("carpooltoken"))._id) {
                    emisor_receptor = "Emisor";
                } else if (element.receptor == JSON.parse(localStorage.getItem("carpooltoken"))._id) {
                    emisor_receptor = "Receptor";
                } else {
                    console.log("Error en la notificacion");
                }
                const data_visto = {
                    notificacionId: element._id,
                    emisor_receptor: emisor_receptor,
                    visto: true
                }
                API.updateVisto(data_visto);
            });
            this.notificaciones_activas = 0;
            await this.obtenerNotificaciones();
            console.log("Leer todo")
        },
        activarNoti(index) {
            this.boton[index] = !this.boton[index]
            if (this.descrip == index) {
                this.descrip = -1
            }
            else {
                this.descrip = index
            }
        },
        openNotification(titulo) {
            // Envia una notificacion (es de vuesax)
            this.$vs.notification({
                duration: 2000,
                title: titulo,
                text: ''
            })
        },
        async obtenerNotificaciones() {
            this.mensajes = []
            this.mensajes = await API.getallnotificaciones();
            console.log(this.mensajes)
            this.mensajes.forEach(element => {
                if (element.receptor == JSON.parse(localStorage.getItem("carpooltoken"))._id) {
                    if (element.vistoreceptor == false) {
                        this.notificaciones_activas++;
                    }
                } else {
                    if (element.vistoemisor == false) {
                        this.notificaciones_activas++;
                    }
                }
            });
        },
        async accionVotar(notificacion, voto) {
            console.log("notificacion --> ", notificacion)
            const loading = this.$vs.loading({
                type: 'default'
            })
            let data = {
                notificacionId: notificacion._id,
                tipo: "",
                estado: voto
            }
            if (voto) {
                data.tipo = "Solicitud unirse viaje aceptada"
            } else {
                data.tipo = "Resultado solicitud unirse viaje rechazada"
            }
            console.log("ENVIANDO...", data)
            console.log(data)
            const resp = await API.actualizarEstadoNotificacion(data)
            console.log("RECIBIDO, ", resp)

            if (voto) {
                var dataPasajero = {
                    idviaje: notificacion.idviaje,
                    pasajeroAgregar: notificacion.emisor,
                    parada: notificacion.parada
                }
                console.log * ("dataPasajero", dataPasajero)
                await API.addpasajeroviaje(dataPasajero)
            }
            await this.obtenerNotificaciones()
            loading.close()
        },
    },
    created() {
        // Creamos el evento para que se ejecute la funcion cuando se llame
        NotiBus.$on('enviarNotificacion', this.enviarNot);
        NotiBus.$on('leerNotificacion', this.leerTodo);

        this.idUsuario = JSON.parse(localStorage.getItem("carpooltoken"))._id
    },
    mounted() {
        this.obtenerNotificaciones()
        this.obtenerSocketNotificaciones()
    },
}
</script>
<style scoped>
.vs-button span {
    margin-left: 0px;
    color: rgb(255, 255, 255);
}

.noti {
    display: block;
    width: 60%;
    height: auto;
}

.datos_mensaje span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: center;
    margin: auto;
    font-size: .5rem;
}

.vs-dialog__content {
    height: 500px;
    overflow: auto;
}
</style>