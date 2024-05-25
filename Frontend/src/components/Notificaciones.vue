<template>
    <div style="display: flex; flex-direction: column;">

        <div class="notificacionMenu">
            <div style="display: flex; justify-content: space-between; padding: 2%;">
                <p style="margin: 0; font-size: 20px; padding: 2%; color: #36568c;">

                    Notificaciones

                </p>
                <div style="display: flex;">

                    <vs-button shadow style="height: 20px; top: 10px;" @click="leerNotificaciones()">
                        <p style="font-size: 11px; margin: 0; margin-right: 5px;">Marcar leído</p>
                        <span style="font-size: 18px;" class="material-icons-outlined">
                            done_all
                        </span>
                    </vs-button>
                    <vs-button circle style="height: 40px; width: 40px;"
                        @click="$store.state.notificacionActiva = !$store.state.notificacionActiva">
                        <span class="material-icons-outlined">
                            close
                        </span>
                    </vs-button>


                </div>
            </div>
            <div class="infoCommend" v-if="mensaje.tipo == 'Viaje finalizado'" v-for="(mensaje, index) in mensajes"
                :key="mensaje._id">
                <div>
                    <div style="display: flex;">
                        <div
                            style=" display: flex; flex-direction: column; width:100%;margin-bottom: 3%;  justify-content: center; text-align: left;">
                            <div style="display: flex; width: 75%;">
                                <span style="padding-right: 2%;" class="material-icons-outlined">
                                    new_releases
                                </span>

                                <div style="display: flex; flex-direction: column;">
                                    <p style="font-size: 11px;">{{ mensaje.fecha }}</p>
                                    <p>
                                        {{ mensaje.tipo }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; width: 100%; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between;">
                            <div style="display:flex; width: 100%; justify-content: space-between;">
                                <vs-button @click="getViaje(mensaje.idviaje, index)"
                                    style="text-align: center; width: 100px; background-color: rgb(54, 86, 140); border-radius: 12px; font-size: 13px; color: white; cursor: pointer;">
                                    Ver más
                                </vs-button>
                                <vs-button @click="$store.state.comentarioActico = !$store.state.comentarioActico" success
                                    style="width: 150px;">
                                    Calificar chofer
                                </vs-button>
                            </div>
                            <div>
                                <CalificarChofer :notificacion="mensaje" />
                            </div>



                        </div>
                        <div class="acordion" :class="{ 'active': activedialog == index }">
                            <CardNotificacion :viajeSeleccionado="viajeSeleccionado" :emisor="vacio"
                                :haciautalca="haciautalca" :id="id" :destino="destino" :origen="origen" :fecha="fecha"
                                :horainicio="horainicio" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Solicitud de viajes -->
            <div class="infoGeneral" :class="{ 'active': borrar == index }"
                v-if="mensaje.tipo != 'Viaje finalizado' && (mensaje.visto == null || mensaje.visto == false)"
                v-for="(mensaje, index) in mensajes" :key="mensaje._id">
                <div class="info">
                    <div>
                        <div style="display: flex;">
                            <div
                                style="display: flex; flex-direction: column; width:100%;margin-bottom: 3%;  justify-content: center; text-align: left;">
                                <div style="display: flex; width: 100%;">
                                    <span style="padding-right: 2%; margin-top: 5px; font-size:30px;"
                                        class="material-icons-outlined">
                                        list_alt
                                    </span>
                                    <div style="display: flex; flex-direction: column;">
                                        <p style="font-size: 11px;">{{ mensaje.fecha }}</p>
                                        <p>
                                            {{ mensaje.tipo }}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div style="display: flex; width: 100%; flex-direction: column;">
                            <div style="display: flex; justify-content: space-between; height: 35px; margin-bottom: 3%">

                                <vs-button :active="1 == 1" @click="getViaje(mensaje.idviaje, index)"
                                    style="text-align: center; width: 100px; height: 100%; background-color: rgb(54, 86, 140); border-radius: 12px; font-size: 13px; color: white; cursor: pointer;">
                                    Ver más
                                </vs-button>
                                <span @click="verViaje(mensaje)"
                                    style=" background-color: #f79034; color: white; border-radius: 17px; padding: 5px;"
                                    class="material-icons-outlined">
                                    place
                                </span>

                                <div @click="test(index)" style=" width: 40%;">

                                </div>

                                <div style="display: flex; width: 25%; justify-content: flex-end;"
                                    v-if="mensaje.receptor == userid && mensaje.tipo == 'Solicitud unirse viaje'">
                                    <span @click="accionVotar(mensaje, true)"
                                        style=" background-color: #8CD1A7; color: white; border-radius: 17px; padding: 5px; margin-right: 10px;"
                                        class="material-icons-outlined">
                                        done
                                    </span>
                                    <span @click="accionVotar(mensaje, false)"
                                        style=" background-color: #DD7063; color: white; border-radius: 17px; padding: 5px;"
                                        class="material-icons-outlined">
                                        close
                                    </span>
                                </div>
                                <div v-else style="display: flex; width: 25%; justify-content: flex-end;">
                                    <span v-if="mensaje.tipo == 'Resultado solicitud unirse viaje rechazada'"
                                        style=" background-color: #DD7063; color: white; border-radius: 17px; padding: 5px; margin-right: 10px;"
                                        class="material-icons-outlined">
                                        close
                                    </span>
                                    <span v-if="mensaje.tipo == 'Solicitud unirse viaje aceptada'"
                                        style=" background-color: #8CD1A7; color: white; border-radius: 17px; padding: 5px; margin-right: 10px;"
                                        class="material-icons-outlined">
                                        done
                                    </span>
                                </div>
                            </div>
                            <div class="acordion" :class="{ 'active': activedialog == index }">
                                <CardNotificacion :viajeSeleccionado="viajeSeleccionado" :emisor="mensaje.emisor"
                                    :haciautalca="haciautalca" :id="id" :destino="destino" :origen="origen" :fecha="fecha"
                                    :horainicio="horainicio" />

                            </div>
                        </div>

                    </div>

                </div>
                <div class="acordion2" :class="{ 'active': borrar == index }" @click="eliminarNotificacion(mensaje)">
                    <span style="display: flex; justify-content: center; flex-direction: column;"
                        class="material-icons-outlined">
                        delete
                    </span>
                </div>

            </div>
        </div>

        <vs-dialog v-if="viajeSeleccionado != null" overflow-hidden full-screen v-model="activemapa">
            <div style="display: flex; min-width: calc(100vw - 50px); min-height: calc(100vh - 50px);">
                <Presolicitud :origen="viajeSeleccionado.origen" :destino="viajeSeleccionado.destino" :solicitud="parada" />
            </div>

        </vs-dialog>
    </div>
</template>

<script>
import CardNotificacion from '@/components/CardNotificacion.vue';
import CardViaje from '@/components/CardViaje.vue';
import API from '@/api';
import CalificarChofer from './CalificarChofer.vue';
import { NotiBusVista } from '../main.js';
import { NotiBus } from '../main.js';
import Presolicitud from './Presolicitud.vue';
export default {
    name: 'G2ProyTaller12023ChatView',

    data() {
        return {
            activenofi: true,
            activenofi2: false,
            activedialog: -1,
            colorsi: "#36568c",
            infoOrange: false,
            mensajes: [],
            viajeSeleccionado: null,
            userid: "",
            vacio: 'vacio',
            haciautalca: true,
            id: "",
            destino: "",
            origen: "",
            fecha: "",
            horainicio: "",
            borrar: -1,
            activemapa: false,
            parada: null,
        };
    },
    created() {
        // Creamos el evento para que se ejecute la funcion cuando se llame
        NotiBusVista.$on('actualizarNotificacion', this.obtenerNotificaciones);
    },
    mounted() {
        this.obtenerNotificaciones()
        this.userid = JSON.parse(localStorage.getItem("carpooltoken"))._id
    },
    props: {

    },

    methods: {
        async eliminarNotificacion(data) {
            const loading = this.$vs.loading({
                type: 'default'
            })
            var emisor_receptor = ""
            if (data.emisor == JSON.parse(localStorage.getItem("carpooltoken"))._id) {
                emisor_receptor = "Emisor";
            } else if (data.receptor == JSON.parse(localStorage.getItem("carpooltoken"))._id) {
                emisor_receptor = "Receptor";
            } else {
                console.log("Error al eliminar notificacion")
            }
            const data_visto = {
                notificacionId: data._id,
                emisor_receptor: emisor_receptor,
                visto: true
            }
            await API.updateVisto(data_visto);
            await this.obtenerNotificaciones()
            loading.close()
        },
        test(index) {
            if (this.borrar == -1) {
                this.borrar = index
            }
            else if (this.borrar == index) {
                this.borrar = -1
            }
            else {
                this.borrar = index
            }
            console.log(this.borrar)
        },
        async leerNotificaciones() {
            const loading = this.$vs.loading({
                type: 'default'
            })
            console.log("Click leer")
            await NotiBus.$emit('leerNotificacion');
            await this.obtenerNotificaciones()
            loading.close()
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

                const viajenoti = await API.getviajebyid(notificacion.idviaje)
                const data2 = {
                    idviaje: notificacion.idviaje,
                }
                await API.updateNumAsientos(data2)

            } else {
                data.tipo = "Resultado solicitud unirse viaje rechazada"
            }
            console.log("ENVIANDO...", data)
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
        async obtenerNotificaciones() {
            var todasnotificaciones = await API.getallnotificaciones();
            var todasnotificacionesactivas = [];
            todasnotificaciones.forEach(element => {
                if (element.emisor == JSON.parse(localStorage.getItem("carpooltoken"))._id) {
                    element.visto = element.vistoemisor
                    todasnotificacionesactivas.push(element)
                } else {
                    element.visto = element.vistoreceptor
                    todasnotificacionesactivas.push(element)
                }
            });
            this.mensajes = await todasnotificaciones.filter(n => n.receptor == JSON.parse(localStorage.getItem("carpooltoken"))._id || n.emisor == JSON.parse(localStorage.getItem("carpooltoken"))._id)

            console.log(this.mensajes)
            this.mensajes = this.mensajes.reverse()
        },
        async verViaje(data) {

            await API.getviajebyid(data.idviaje)
                .then((viaje) => {

                    this.viajeSeleccionado = viaje
                    this.parada = data.parada
                    this.activemapa = !this.activemapa
                }).
                catch((error) => {
                    console.log(error)
                })

        },
        async getViaje(id, index) {

            this.cambiar(index)
            this.viajeSeleccionado = await API.getviajebyid(id)
            console.log(this.viajeSeleccionado)
            this.haciautalca = this.viajeSeleccionado.haciautalca
            this.id = this.viajeSeleccionado._id
            this.destino = this.viajeSeleccionado.destino.nombre
            this.origen = this.viajeSeleccionado.origen.nombre
            this.fecha = this.viajeSeleccionado.fecha
            this.horainicio = this.viajeSeleccionado.horainicio

        },
        cambiar(index) {
            if (this.activedialog == -1) {
                this.activedialog = index
            }
            else if (this.activedialog == index) {
                this.activedialog = -1
            }
            else {
                this.activedialog = index
            }

        }
    },
    components: {
        CardViaje,
        CardNotificacion,
        CalificarChofer,
        Presolicitud
    }
};
</script>

<style scoped>
.infoGeneral {
    display: block;
}

.infoGeneral.active {
    display: flex;
}

.notificacionMenu {
    position: fixed;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100vw;
    z-index: 10;
    overflow-y: scroll;
    top: 0;
    backdrop-filter: blur(100px);
}


.acordion {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease;
}

.acordion.active {
    max-height: 400px;
    transition: max-height 1s ease;
}

.acordion2 {
    display: flex;
    justify-content: center;
    max-width: 0;
    overflow: hidden;
}

.acordion2.active {
    display: flex;
    justify-content: center;
    border-radius: 15px;
    background-color: #DD7063;
    color: white;
    margin: 3%;
    margin-left: 0;
    padding: 3%;
    height: 90px;
    max-width: 100px;
    transition: max-width 1s ease;
}

.info {
    display: flex;
    flex-direction: column;
    background-color: rgba(54, 86, 140, 0.839);
    /* background-color: #e3e3e3d6; */
    /* border: 2px solid #36568c; */
    border-radius: 15px;
    /* color: #36568c; */
    color: white;
    padding: 3%;
    margin: 3%;
    width: 90%;
}

.infoCommend {
    display: flex;
    flex-direction: column;
    background-color: #e3e3e3d6;
    /* background-color: #e3e3e3d6; */
    /* border: 2px solid #36568c; */
    border-radius: 15px;
    /* color: #36568c; */
    color: #36568c;
    padding: 3%;
    margin: 3%;
}


.info p {
    font-size: 14px;
    margin: 0;
}

.info p {
    margin: 0;
}

.visto {
    display: flex;

    position: fixed;
    width: 200px;
    margin-left: 20px;
    justify-content: center;

    top: 55px;
    z-index: 10001;

    z-index: 10001;
}
</style>