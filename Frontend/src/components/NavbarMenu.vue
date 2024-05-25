<template>
    <div>
        <vs-navbar shadow square center-collapsed v-model="active">

            <div style="display: flex; width: 100vw; height: 50px; z-index: 10; position: fixed; background-color: white;">

                <vs-button transparent style="height: 40px; width: 40px; margin-top: 5px; margin-left: 10px;"
                    @click="activeSidebar = !activeSidebar">
                    <span class="material-icons-outlined" style="color:#36568c;">
                        menu
                    </span>
                </vs-button>


                <div style=" display: flex; width: 100%; justify-content: center; margin-top: 10px;">

                    <img style="" :src="require('@/assets/carpool2.png')" />
                </div>

                <NotificacionBotonVue />
            </div>

        </vs-navbar>

        <vs-sidebar shadow v-model="active" :open.sync="activeSidebar">

            <div style="display: flex; width: min-width: calc(100vw - 50px) ; justify-content:center; width: 100%; margin-top:20px; margin-bottom:40px;">

                <div style="width: 80px; height: 80px; border: 3px solid white; border-radius: 50px; margin-right: 5px;">
                    <img style="width: 100px; height: 100px; border-radius: 50px;" :src="fotoperfil" alt="">
                </div>
                <div class="cajanombre">
                    <p style="margin: 0; margin-left: 20px; margin-top: 25px;">{{ nombreUser }}</p>
                </div>

            </div>

            <vs-sidebar-item class="dinamic" id="perfil" :class="{ 'active': active == 'perfil' }">

                <div @click="test" class="dinamicInto">
                    <span class="material-icons-outlined">
                        account_circle
                    </span>
                    <p>Mi Perfil</p>
                </div>

            </vs-sidebar-item>
                
            <vs-sidebar-item  class="dinamic" id="viajar" :class="{ 'active': active == 'viajar' }">

                <div  @click="test" class="dinamicInto">
                    <span class="material-icons-outlined">
                        directions_car_filled
                    </span>
                    <p>Viajar</p>
                </div>
            </vs-sidebar-item>

            <vs-sidebar-item class="dinamic" id="crear" v-if="eschofer" :class="{ 'active': active == 'crear' }">

                <div @click="test" class="dinamicInto">
                    <span class="material-icons-outlined">
                        add_circle
                    </span>
                    <p>Crear Viaje</p>
                </div>
            </vs-sidebar-item>

            <vs-sidebar-item class="dinamic" id="frecuente" v-if="eschofer" :class="{ 'active': active == 'frecuente' }">

                <div @click="test" class="dinamicInto">
                    <span class="material-icons-outlined">
                        repeat
                    </span>
                    <p>Viajes frecuentes</p>
                </div>
            </vs-sidebar-item>

            <vs-sidebar-item class="dinamic" id="historialviajes" :class="{ 'active': active == 'historialviajes' }">

                <div @click="test" class="dinamicInto">
                    <span class="material-icons-outlined">
                        description
                    </span>
                    <p>Historial de Viajes</p>
                </div>
            </vs-sidebar-item>

            <vs-sidebar-item @click="cerrarSesion" to="/" class="dinamic" id="salir"
                :class="{ 'active': active == 'salir' }">

                <div @click="test" class="dinamicInto">
                    <span class="material-icons-outlined">
                        logout
                    </span>
                    <p>Cerrar Sesion</p>
                </div>
            </vs-sidebar-item>
        </vs-sidebar>
        <div class="contenedorMenu">
            <div v-if="active === 'viajar'">
                <ListaVehiculosMovil @mostrarviaje="cambiarviaje" />

            </div>
            <div v-if="active === 'misviajes'">
                <MisViajes />

            </div>
            <div v-if="active === 'crear' && eschofer">
                <CrearViaje @viajecreado="creado" />

            </div>

            <div v-if="active === 'perfil'">
                <PerfilUsuario @cambiarfoto="cambiofoto" />
            </div>
            <div v-if="active == 'historialviajes'">
                <HistorialViajes />
            </div>
            <div v-if="active === 'frecuente' && eschofer">
                <ViajesFrecuentes @viajecreado="creado" />
            </div>
        </div>
    </div>
</template>
<script>
import CrearViaje from './CrearViaje.vue';
import ListaVehiculosMovil from './ListaVehiculosMovil.vue'
import MisViajes from './MisViajes.vue';
import PerfilUsuario from './PerfilUsuario.vue';
import HistorialViajes from './HistorialViajes.vue';
import NotificacionBotonVue from './NotificacionBoton.vue';
import ViajesFrecuentes from './ViajesFrecuentes.vue';
import API from '@/api';

export default {
    data: () => ({
        nombreUser: '',
        active: 'viajar',
        activeSidebar: false,
        eschofer: true,
        fotoperfil: "",
        GPS: null,
        active2: true,



    }),

    async mounted() {


        this.usuario()
    },
    watch: {
        active(newActive) {
            if (newActive === "viajar" || newActive === "misviajes" || newActive === "crear" || newActive === "perfil" || newActive === "historialviajes" || newActive === "frecuente") {
                this.comprobacion_bloqueado();
            }
        }
    },
    methods: {
        test(){
            console.log("se preciona cerrar")
            this.activeSidebar = !this.activeSidebar

        },
        sinPermisos() {
            this.GPS = "denegado"
            this.active2 = false
        },

        async activarGPS() {

            this.GPS = await this.$store.dispatch("solicitudGPS")
            this.active2 = false

        },
        cerrarSesion() {
            localStorage.removeItem('carpooltoken');
            console.log("se borro")
        },
        usuario() {
            const token = JSON.parse(localStorage.getItem("carpooltoken"))
            this.nombreUser = token.nombre
            this.eschofer = token.eschofer
            this.fotoperfil = token.imagenperfil
            console.log(this.eschofer)
        },
        cambiarviaje() {
            this.active = "elegirviaje"
        },
        volverlista() {
            this.active = "viajar"
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
        }, creado() {
            this.active = "historialviajes"
        }, async cambiofoto() {

            this.fotoperfil = this.$store.state.urlperfil
        },
        async comprobacion_bloqueado() {
            var token = JSON.parse(localStorage.getItem("carpooltoken"))
            var user = await API.getuserbyid(token._id)
            if (user.contPanico > 0) {
                console.log("BLOQUEADO")
                localStorage.removeItem("carpooltoken")
                this.$router.push({ path: '/Forbidden' })
            } else {
                console.log("NO BLOQUEADO")
            }
        }

    },
    components: {
        ListaVehiculosMovil,
        CrearViaje,
        MisViajes,
        PerfilUsuario,
        NotificacionBotonVue,
        HistorialViajes,
        ViajesFrecuentes
    }
}
</script>

<style scoped>
.vs-sidebar__item {
    /* padding: 5%;
   padding-left: 10px; */
    padding: 10px 16px;
}

.dinamic {
    background-color: white;
    color: #36568c;

    transition: padding 0.5s ease;
}

.dinamic.active {
    background-color: #36568c;
    color: rgba(255, 255, 255, 0.866);
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    transition: padding 1s ease;
}

.dinamic.active .dinamicInto span {

    background-color: rgb(255, 255, 255);

    color: #36568c;
    border-radius: 30px;
    padding: 3%;
}

.dinamic.active .dinamicInto p {

    padding: 3%;
}

.dinamicInto {
    display: flex;
    min-width: calc(70vw - 50px)
}

.dinamicInto p {
    margin: 0;
    margin-left: 3%;
}

.contenedorMenu {
    display: flex;
    position: relative;
    top: 6%;
    width: 100vw;
    height: 94.5vh;
}

img {
    position: absolute;

    height: 35px;
    z-index: 5000;
}

.material-icons-outlined {
    margin-left: 0;
}

.cajanombre {
    display: flex;
    width: 60%;
    margin-bottom: 10px;
}

.button-container {
    position: absolute;
    top: 0px;
    left: 0;
    margin: 10px;
    display: flex;
    align-items: center;

}

.back-button,
.forward-button {
    margin-right: 10px;
    height: 40px;
}

.back-button .material-icons,
.forward-button .material-icons {
    font-size: 20px;
    margin-right: 5px;
    color: white;
}

.elemento {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}

.boton {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5%;
}
</style>