<template>
    <div class="contenedor">
        <div v-if="viajeSeleccionado.haciautalca" class="despla">
            DESDE UTALCA
        </div>
        <div v-else class="despla2">
            HACIA UTALCA
        </div>
        <div class="info5">
            <div class="text">
                <p v-if="viajeSeleccionado.haciautalca">Destino: {{ viajeSeleccionado.destino.nombre }}</p>
                <p v-else>Origen: {{ viajeSeleccionado.origen.nombre }}</p>

                <p>Asientos: {{ viajeSeleccionado.disponibles }} / 4</p>
                <p>Precio: ${{ viajeSeleccionado.precio }}</p>
            </div>

            <div class="botones">
                <div class="mini">

                    <vs-button color="#8CD1A7" @click="verViaje()"> Visualizar ruta
                        <span class="material-icons-outlined">
                            route
                        </span>
                    </vs-button>


                </div>
                <div class="mini2">
                    <vs-button circle success @click="repetirviaje">
                        <span class="material-icons-outlined">
                            new_label
                        </span>

                    </vs-button>
                </div>
            </div>


        </div>

        <vs-dialog v-if="viajeSeleccionado != null" overflow-hidden full-screen v-model="activemapa">
            <div style="display: flex; min-width: calc(100vw - 50px); min-height: calc(100vh - 50px);">
                <Presolicitud :origen="origen" :destino="destino" />
            </div>

        </vs-dialog>

        <vs-dialog v-if="viajeSeleccionado != null" overflow-hidden v-model="repetir">

                <h2 style="text-align: center;">Crea tu viaje</h2>


                <div style="display: flex;">
                    <vs-input :state="'dark'" style="width: 40%; margin-left: 10px; margin-right: 10px; margin-top: 10px;"
                        v-model="precio" icon-after placeholder="Precio" label="Precio">
                        <template #icon>
                            <span class="material-icons-outlined">
                                attach_money
                            </span>
                        </template>
                    </vs-input>
                    <br>

                    <vs-select :state="'dark'" :label="'dark'"
                        style="width: 50%; margin-left: 10px; margin-right: 10px; margin-top: 10px;"
                        label="Asientos Disponibles" v-model="asientos">

                        <vs-option v-for="(item, index) in 4" :key="index" :label="index + 1" :value="index + 1">
                            {{ index + 1 }}
                        </vs-option>
                    </vs-select>
                </div>
                <br>
                <div style="display: flex;">
                    <vs-input :state="'dark'" style="width: 50%; margin-left: 10px; margin-right: 10px;" type="date"
                        :min="fechaActual" v-model="fecha" label="Fecha" />

                    <vs-select :state="'dark'" :label="'dark'" filter
                        style="width: 40%; margin-left: 10px; margin-right: 10px; margin-top: 10px;" label="Hora"
                        v-model="hora">

                        <vs-option v-for="(item, index) in horas" :key="index" :label="item" :value="item">
                            {{ item }}
                        </vs-option>
                    </vs-select>
                </div>
                
                <div style="display: flex; justify-content: center; margin-top: 10px;">

                    <vs-button circle @click="creaviaje">
                        Crear Viaje
                        <img style="width: 45px; height: 50px; margin-left: 10px;" :src="require('@/assets/rutawhite.png')"
                            alt="">
                    </vs-button>

                </div>
            
        </vs-dialog>
    </div>
</template>

<script>
import InformacionChofer from './InformacionChofer.vue';
import API from '@/api';
import Presolicitud from './Presolicitud.vue';
import { viajeBus } from "../main.js";
export default {
    name: "G2ProyTaller12023ChatView",
    data() {
        return {
            fecha: "",
            hora: "",
            asientos: 0,
            precio: 0,
            option: false,
            origen: null,
            destino: null,
            fechaActual: null,
            horaActual: null,
            NumeroPattern: /^\d+$/,
            picked: null,
            isCreando: null,
            activemapa: false,
            repetir: false,
            origen: null,
            destino: null,
            precio: 0,
            asientos: 0,
            fechaActual: null,
            fecha: null,
            hora: null,
            NumeroPattern: /^\d+$/,
            horas: [
                "00:00", "00:15", "00:30", "00:45",
                "01:00", "01:15", "01:30", "01:45",
                "02:00", "02:15", "02:30", "02:45",
                "03:00", "03:15", "03:30", "03:45",
                "04:00", "04:15", "04:30", "04:45",
                "05:00", "05:15", "05:30", "05:45",
                "06:00", "06:15", "06:30", "06:45",
                "07:00", "07:15", "07:30", "07:45",
                "08:00", "08:15", "08:30", "08:45",
                "09:00", "09:15", "09:30", "09:45",
                "10:00", "10:15", "10:30", "10:45",
                "11:00", "11:15", "11:30", "11:45",
                "12:00", "12:15", "12:30", "12:45",
                "13:00", "13:15", "13:30", "13:45",
                "14:00", "14:15", "14:30", "14:45",
                "15:00", "15:15", "15:30", "15:45",
                "16:00", "16:15", "16:30", "16:45",
                "17:00", "17:15", "17:30", "17:45",
                "18:00", "18:15", "18:30", "18:45",
                "19:00", "19:15", "19:30", "19:45",
                "20:00", "20:15", "20:30", "20:45",
                "21:00", "21:15", "21:30", "21:45",
                "22:00", "22:15", "22:30", "22:45",
                "23:00", "23:15", "23:30", "23:45"
            ]


        };
    },
    mounted() {
        console.log(this.viajeSeleccionado)
        this.DiaActual()
        this.origen = this.viajeSeleccionado.origen
        this.destino = this.viajeSeleccionado.destino
        this.precio = this.viajeSeleccionado.precio
        this.hora = this.viajeSeleccionado.horainicio
        this.asientos = this.viajeSeleccionado.disponibles
        /* this.getConductor() */
    },
    methods: {

        async verViaje(mensaje) {


            this.activemapa = !this.activemapa


        },
        repetirviaje() {
            this.repetir = !this.repetir
        }, DiaActual() {
            const hoy = new Date();
            const mes = hoy.getMonth() + 1;
            const dia = hoy.getDate();
            const year = hoy.getFullYear();
            this.fechaActual = `${year}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`;
            this.fecha = this.fechaActual


        }, async creaviaje() {

            if (this.fecha !== "" && this.hora !== "" && (this.NumeroPattern.test(this.precio) && this.precio >= 0)
                && (this.NumeroPattern.test(this.asientos) && this.asientos > 0 && this.asientos <= 5)) {
                const token = JSON.parse(localStorage.getItem("carpooltoken"))




                var resp = await API.addviaje(
                    {
                        "disponibles": parseInt(this.asientos),
                        "precio": parseInt(this.precio),
                        "origen": this.origen,
                        "destino": this.destino,
                        "choferid": token._id,
                        "haciautalca": this.viajeSeleccionado.haciautalca,
                        "pasajeros": [],
                        "fecha": this.fecha,
                        "horainicio": this.hora,
                        "esfrecuente": false,
                        "estado": "Activo",
                        "chat": [],
                    }
                )

                console.log("AXIOS " + token._id + ", " + resp._id)
                // SOCKET IO, ENVIAMOS UN VIAJE A TIEMPO REAL A TODOS LOS USUARIOS
                console.log("Emitiendo viaje")
                var data_viaje = {
                    chofer: token._id,
                    actividad: token.actividad
                }
                viajeBus.$emit('enviarViaje', data_viaje);
                // Emite el viaje creado
                this.$emit('viajecreado')
                await this.axios.put(`updateusuario`, {
                    "userid": token._id,
                    "viajeid": resp._id
                })
                this.openNotification("Tu viaje ha sido creado con exito", 3000, "", "#27F055")
            } else {

                if (!this.NumeroPattern.test(this.asientos) || (this.asientos <= 0 || this.asientos > 5)) {

                    this.openNotification("Numero de asientos invalido", 3000, "", "danger")
                } else if (!this.NumeroPattern.test(this.precio)) {
                    if (this.precio !== 0) {
                        this.openNotification("Necesitas ingresar un precio valido", 3000, "", "danger")
                    }

                } else if (this.hora === "") {
                    this.openNotification("Necesitas ingresar una hora valida", 3000, "", "danger")
                } else {
                    this.openNotification("Debes marcar Desde/Hacia utalca ", 3000, "", "danger")

                }
            }

        },
        openNotification(titulo, duration, text, color, position) {
            // Envia una notificacion (es de vuesax)
            this.$vs.notification({
                color: color,
                duration: duration,
                title: titulo,
                text: text
            })
        }

    },
    props: {
        viajeSeleccionado: Object,

    },
    components: { InformacionChofer, Presolicitud }
};
</script>

<style scoped>
.contadmin2 {
    display: flex;
    flex-direction: column;
}

.boton {
    display: flex;
    justify-content: center;
}

.checkfrecuente {
    display: flex;
    justify-content: center;
}

.info5 {
    display: flex;
    flex-direction: column;
    height: auto;
    background: #36568c;
    margin-left: 3%;
    margin-right: 3%;
    margin-top: 0;
    padding: 3%;
    padding-bottom: 0;

    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border-top-right-radius: 12px;
}

.repetirviaje {
    margin-top: 5%;
}

.boton {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 50px;
}

.despla {
    display: flex;
    position: relative;
    background-color: #6E809F;
    color: white;
    margin-left: 3%;
    margin-top: 3%;
    width: 34%;
    padding-left: 5%;
    padding-right: 5%;
    padding-top: 2%;
    padding-bottom: 2%;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    border-bottom: 1px solid white;

    font-size: 15px;
}

.despla2 {
    display: flex;
    position: relative;
    background-color: #f79034;
    color: white;
    margin-left: 3%;
    margin-top: 3%;
    width: 34%;
    padding-left: 5%;
    padding-right: 5%;
    padding-top: 2%;
    padding-bottom: 2%;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    border-bottom: 1px solid white;
    font-size: 15px;
}

.text {
    padding: 5%;
    padding-top: 0;
    font-size: 14px;
    padding-bottom: 0;
    display: flex;
    flex-direction: column;
    color: white;
}

.text p {
    margin: 0;
}

.botones {
    display: flex;
    height: 58px;
    justify-content: space-between;
    margin-bottom: 4%;
}

.fecha {
    position: relative;
    display: flex;
    flex-direction: column;
    color: white;
    text-align: center;
    top: 12%;
}

.fecha p {
    margin: 0;
}

.mini {
    display: flex;
}

.mini2 {
    display: flex;
}

/*Bounce*/
@keyframes kreep {
    0% {
        -webkit-transform: scale(1.1, .9);
        transform: scale(1.1, .9);
    }

    50% {
        -webkit-transform: scale(.9, 1.1) translateY(-.5rem)
    }

    70% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

.material-icons-outlined.downward.kreep {

    /*name-duration-function(ease,eas-in,linear)-delay-count-direction */
    animation: kreep 0.7s ease 0.1s infinite alternate;
}
</style>