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
                    <vs-button :class="estilo_btnChofer" color="#377BA3" circle @click="getConductor">
                        <span class="material-icons-outlined">
                            face
                        </span>
                    </vs-button>
                    <vs-dialog overflow-hidden full-screen v-model="activeinfo">
                        <InformacionChofer :conductor="this.conductorInfo" :comentarios="comentarios"
                            :valoraciontotal="valoraciontotal" :imagenperfil="imagenperfil" />
                    </vs-dialog>

                    <vs-button circle dark>
                        <span class="material-icons-outlined">
                            calendar_month
                        </span>
                    </vs-button>

                    <div  class="fecha">
                        <p>{{ viajeSeleccionado.fecha }}</p>
                        <p>{{ viajeSeleccionado.horainicio }}</p>
                    </div>
                </div>
                <div class="mini2">
                    <vs-button :class="estilo_btnViajar" circle success @click="seleccionarViaje">
                        <span class="material-icons-outlined">
                            add_location_alt
                        </span>
                        <span class="material-icons-outlined">
                            chevron_right
                        </span>
                    </vs-button>
                </div>
            </div>


        </div>


    </div>
</template>

<script>
import InformacionChofer from './InformacionChofer.vue';
import API from '@/api';
export default {
    name: "G2ProyTaller12023ChatView",
    data() {
        return {
            activeinfo: false,
            conductorInfo: null,
            comentarios: [],
            valoraciontotal: 0,
            imagenperfil: ""
        };
    },
    mounted() {
        /* this.getConductor() */
    },
    methods: {
        seleccionarViaje() {
            this.$store.state.vistaViaje = this.viajeSeleccionado;
            console.log(this.$store.state.vistaViaje._id);
        },
        hola() {
            console.log(this.viajeSeleccionado);
        },
        async getConductor() {
            this.activeinfo = !this.activeinfo
            this.conductorInfo = await API.getuserbyid(this.viajeSeleccionado.choferid)
            console.log(this.conductorInfo)
            this.imagenperfil = this.conductorInfo.imagenperfil

            this.cargar_comentarios()
        },
        async cargar_comentarios() {
            this.valoraciontotal = 0
            this.comentarios = await API.getcalificacionbychofer(this.viajeSeleccionado.choferid)
            console.log("comentarios")
            console.log(this.comentarios)
            if (this.comentarios.length > 0) {


                this.comentarios.forEach(element => {
                    this.valoraciontotal += element.nota
                });
                this.valoraciontotal = this.valoraciontotal / this.comentarios.length

                this.comentarios = this.comentarios.reverse()
            }
            else {
                console.log('No tiene comentarios')
            }
        }

    },
    props: {
        viajeSeleccionado: Object,
        estilo_btnChofer: { type: String },
        estilo_btnViajar: { type: String },
    },
    components: { InformacionChofer }
};
</script>

<style scoped>
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
    font-size: 15px;
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