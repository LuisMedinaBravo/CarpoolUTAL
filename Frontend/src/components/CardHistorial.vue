<template>
    <div class="contenedorHistorial">
        <div class="estados">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <div style="display: flex; width: 50%;margin-top: 3%;margin-left: 6px;">

                    <div class="mio" v-if="viaje.choferid == idLocal">
                        <span class="material-icons-outlined">
                            face
                        </span>
                    </div>

                    <div class="desde" v-if="viaje.haciautalca" style="color: #36568c;">DESDE UTALCA</div>
                    <div class="desde" v-else style="color: #36568c;">HACIA UTALCA</div>


                </div>
                <div class="desde" v-if="viaje.estado == 'Activo'" style="background-color: #7d33ff;">
                    <p>Activo</p>
                </div>
                <div class="desde" v-if="viaje.estado == 'En curso'" style="background-color: #F3C541;">
                    <p>En curso</p>
                </div>
                <div class="desde" v-if="viaje.estado == 'Finalizado'" style="background-color: white; color: #36568c;">
                    <p>Finalizado</p>
                </div>

            </div>
        </div>

        <div class="historial">

            <div class="infogeneral">

                <p v-if="viaje.haciautalca">Destino: {{ viaje.destino.nombre }}</p>
                <p v-else>Origen: {{ viaje.origen.nombre }}</p>
                <div class="doble">
                    <div class="asiento">
                        <p>Disponibles: {{ viaje.disponibles }}</p>
                        <p>Precio: ${{ viaje.precio }}</p>
                    </div>
                    <div class="fecha">
                        <vs-button dark circle style="width: 40px;" :active="1 == 1">
                            <span class="material-icons-outlined">
                                calendar_month
                            </span>
                        </vs-button>
                        <div class="date" style="display: flex; flex-direction: column;">
                            <p>{{ viaje.fecha }}</p>
                            <p>{{ viaje.horainicio }}</p>
                        </div>

                    </div>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <vs-button style="width: 170px;" @click="activeparticipante = !activeparticipante">
                        Ver participantes
                        <span v-if="activeparticipante == false" class="material-icons-outlined">
                            keyboard_arrow_down
                        </span>
                        <span v-else class="material-icons-outlined">
                            keyboard_arrow_up
                        </span>

                    </vs-button>
                    <vs-button shadow style="width: 100px; border: 1px solid grey;" @click="getAudio()">
                        Audios
                        <span class="material-icons-outlined">
                            audio_file
                        </span>
                    </vs-button>
                    <vs-dialog overflow-hidden full-screen v-model="audioActivo">
                        <div style=" overflow-y: scroll; height: 92vh; margin-top: 10px;">
                            <div v-for="item in mensajesaudio" :key="item.id">
                                <CardAudio :audioUrl="item.enlace" :audioFecha="item.fecha" />
                            </div>
                        </div>


                    </vs-dialog>
                </div>
                <div class="acordion" :class="{ 'active': activeparticipante == true }">
                    <div class="participantes">
                        <div class="participante">
                            <b>Conductor:</b>
                            <p>{{ nombrechofer }}</p>
                        </div>
                        <div v-for="item in pasajeros">
                            <div class="participante">
                                <b>Pasajero:</b>
                                <p>{{ item }}</p>
                            </div>
                        </div>

                    </div>
                </div>
                <div style="display: flex; justify-content: flex-end; width: 100%;">
                    <vs-button success style="width: 100%;" @click="salaEspera(viaje)">
                        <p>Sala de espera</p>
                        <span class="material-icons-outlined" style="margin-left: 10px;">
                            chair
                        </span>
                    </vs-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import API from '@/api';
import CardAudio from '@/components/CardAudio.vue'
import { getAddressInfo } from '@mapbox/mapbox-gl-geocoder/lib/utils';
import rhumbDistance from '@turf/rhumb-distance';
export default {
    name: 'G2ProyTaller12023ChatView',

    data() {
        return {
            activePasa: 0,
            activeparticipante: false,
            pasajeros: [],
            nombrechofer: '',
            audioActivo: false,
            mensajesaudio: [],
            idLocal: ""
        };
    },

    mounted() {
        this.getPasajeros()
        this.idLocal = JSON.parse(localStorage.getItem("carpooltoken"))._id
    },
    components: {
        CardAudio
    },

    methods: {
        mostrarPasajeros() {
            if (this.activePasa == 0) {
                this.activePasa = 1
            }
            else {
                this.activePasa = 0
            }
        },
        async getPasajeros() {
            this.viaje.pasajeros.forEach(async element => {

                const pass = await API.getuserbyid(element)
                this.pasajeros.push(pass.nombre)
            });
            const chofer = await API.getuserbyid(this.viaje.choferid)
            this.nombrechofer = chofer.nombre
        },
        async salaEspera(viaje) {

            this.comprobacion_bloqueado()
            this.$store.state.historialviajeseleccionado = viaje._id
            this.$store.state.idchofermenu = viaje.choferid
            localStorage.setItem('historialviajeseleccionado', viaje._id)
            this.$router.push({ path: '/subida' })
        },
        async getAudio() {
            this.audioActivo = !this.audioActivo
            var raudios = await API.getallaudio();
            this.mensajesaudio = raudios.filter(r => r.emisoraudio == JSON.parse(localStorage.getItem("carpooltoken"))._id);
            this.mensajesaudio = this.mensajesaudio.filter(r => r.idviaje == this.viaje._id)
        },
        async comprobacion_bloqueado() {
            var token = JSON.parse(localStorage.getItem("carpooltoken"))
            var user = await API.getuserbyid(token._id)
            if (user.contPanico > 0) {
                console.log("BLOQUEADO")
                localStorage.removeItem("carpooltoken")
                await this.$router.push({ path: '/Forbidden' })
            } else {
                console.log("NO BLOQUEADO")
            }
        }
    },
    props: {
        viaje: Object
    }
};
</script>

<style scoped>
.contenedorHistorial {
    display: flex;
    width: 100vw;
    justify-content: center;
    flex-direction: column;

}

.acordion {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease;
}

.acordion.active {
    max-height: 1000px;
    transition: max-height 1s ease;
}

.participantes {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    left: 5%;
}

.participantes p {
    margin: 0;

}

.participante {
    display: flex;

}

b {
    margin-right: 10px;
}

.estados {
    display: flex;

    margin: 0;
}

.desde {
    display: flex;
    /* background-color: #36568c; */
    padding: 2%;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    color: white;
    margin-left: 3%;
    margin-right: 3%;
    margin-bottom: 0;
    margin-top: 3%;
}

.desde p {
    margin: 0;
}

.mio {
    display: flex;
    /* background-color: #36568c; */
    padding: 2%;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    color: rgb(255, 255, 255);
    margin-left: 3%;
    background-color: #36568c;

    margin-bottom: 0;
    margin-top: 3%;
}

.mio p {
    margin: 0;
}

.doble {
    display: flex;
    justify-content: space-between;
}

.asiento {
    display: flex;
    flex-direction: column;
}

.historial {
    display: flex;
    /*  background-color: #36568c; */
    border: 2px solid #36568c;
    color: #36568c;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    flex-direction: column;

    margin: 3%;
    margin-top: 0;
}

.fecha {
    display: flex;
    text-align: center;
}

.fecha p {
    margin: 0;
}

.infogeneral {
    display: flex;
    flex-direction: column;
    margin: 3%;
}

.infogeneral p {
    margin: 0;
}
</style>