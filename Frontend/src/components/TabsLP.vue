<template>
    <div>
        <div class="contenedorMovil">
            <div class="barra">
                <vs-navbar square v-model="menu">
                    <vs-navbar-item :active="menu == 'inicio'" id="inicio">
                        <span class="material-icons-outlined">
                            group
                        </span>
                        <p style="margin: 0;">Carpooling</p>
                    </vs-navbar-item>
                    <vs-navbar-item :active="menu == 'viajar'" id="viajar">
                        <span class="material-icons-outlined">
                            directions_car_filled
                        </span>
                        <p style="margin: 0;"> Viajar</p>
                    </vs-navbar-item>
                    <vs-navbar-item :active="menu == 'seguridad'" id="seguridad">
                        <span class="material-icons-outlined">
                            health_and_safety
                        </span>
                        <p style="margin: 0;">Seguridad</p>
                    </vs-navbar-item>
                </vs-navbar>
                <br><br><br><br>
                <div class="tab1" v-if="menu == 'inicio'">
                    <div class="grid">
                        <vs-row>
                            <vs-col>
                                <h1>CARPOOLING</h1>
                                <div class="centrar-div">
                                    <img style="height: 20vh" src="https://i.ibb.co/qmsNTvn/logo.png">
                                </div>

                            </vs-col>
                        </vs-row>
                        <vs-row>
                            <vs-col>
                                <div class="centrar-div">
                                    <p class="block">
                                        El carpooling consiste en viajar varias personas en un mismo vehículo al mismo
                                        destino. Lo que se conoce como compartir el auto. El fin es evitar el uso de varios
                                        vehículos para un mismo trayecto y reducir costos varios.
                                    </p>
                                </div>

                                <div class="centrar-div">
                                    <vs-button color="#f79034" flat :active="active2 == 0" @click="active2 = 0">
                                        Conoce más acerca de Carpooling universitario
                                    </vs-button>
                                </div>
                                <div class="centrar-div">
                                    <h1>Beneficios para todos</h1>

                                </div>

                                <div class="centrar-div">
                                    <img style="height: 50vh;"
                                        src="https://ceroplastico.org/wp-content/uploads/2019/09/Infografia_carpooling_2-1-819x1024.jpg">
                                </div>
                                <div class="centrar-div">
                                    <p class="block">
                                        Si tienes auto, realizas viajes repetitivos y tiendes a tener tu auto vacóo, puedes
                                        crear anuncios con esta aplicación para invitar
                                        a tus compañeros a que viajen contigo. No solo reducirás el tráfico, ayudarás al
                                        medio ambiente y cuidarás a tus compañeros,
                                        sino que podrías llegar más temprano a tu hogar y tendrás la opción de pedir una
                                        tarifa si lo deseas.
                                    </p>
                                </div>
                            </vs-col>
                        </vs-row>


                    </div>

                </div>
                <div v-if="menu == 'viajar'">
                    <div class="grid">
                        <vs-row>
                            <vs-col>
                                <div class="centrar-div">
                                    <h1>Antes de viajar</h1>
                                </div>
                                <div class="centrar-div">
                                    <vs-card>
                                        <template #title>
                                            <h3>Regístrate en DTI</h3>
                                        </template>
                                        <template #img>
                                            <img src="https://i.ibb.co/zRDsdqN/laboratorios.jpg" alt="">
                                        </template>
                                        <template #text>
                                            <p>
                                                Ve al edificio verde y pide que te registren, ahí deberás expecificar si
                                                deseas ser
                                                pasajero, conductor o ambas.
                                            </p>
                                        </template>

                                    </vs-card>

                                </div>
                            </vs-col>
                        </vs-row>
                        <vs-row>
                            <vs-col>
                                <div>
                                    <h1 style="padding-top: 15px;">Empieza a viajar</h1>
                                    <div style="display: flex; justify-content: center;">
                                        <vs-button color="#f79034" class="btn-ingresar" flat size="xl"
                                            @click="active = !active">
                                            Ingresar
                                        </vs-button>
                                    </div>
                                </div>
                            </vs-col>
                        </vs-row>
                    </div>

                </div>
                <div class="contenedorSeg" v-if="menu == 'seguridad'">

                    <h1>Medidas de seguridad</h1>
                    <img src="https://i.ibb.co/d5bTFYw/facultad.jpg" alt="">
                    <vs-alert square>
                        <template #title>
                            Todos los usuarios son de la universidad
                        </template>
                        No estarás con extraños durante tus viajes, solo tus compañeros o funcionarios de
                        la universidad usarán esta aplicación.
                    </vs-alert>

                    <img src="https://blog.adt.cl/wp-content/uploads/2018/06/boton-de-panico.png" alt="">
                    <vs-alert square>
                        <template #title>
                            Botón de Pánico
                        </template>
                        En caso de no sentirte seguro/a, presiona el botón de pánico y los contactos
                        que selecciones recibirán un mensaje de emergencia.
                    </vs-alert>

                    <img src="https://imagekit.androidphoria.com/wp-content/uploads/Mejores-apps-grabar-audio.jpg">

                    <vs-alert square>
                        <template #title>
                            Graba el audio de tus viajes
                        </template>
                        Puedes grabar las conversaciones que ocurran dentro del auto haciendo click en el botón "Grabar"
                        durante tu viaje.

                    </vs-alert>

                </div>
            </div>
        </div>
        <vs-dialog not-close not-padding blur v-model="active">
            <Login />
        </vs-dialog>
        <div class="foot">
            <div style="text-align: center;">
                <a target="_blank" class="nav-link">
                    <span class="material-icons-outlined" style=" color: white; margin: 12px; cursor:pointer"
                        @click="toTop">
                        home

                    </span>
                </a>
                <a href="https://icc.utalca.cl/" target="_blank" class="nav-link">
                    <span class="material-icons-outlined" style="color: white; margin: 12px; cursor:pointer;">
                        group
                    </span>
                </a>




            </div>
            <div style="color:white; text-align: center; cursor:default; ">Taller de Software@2023</div>
        </div>

    </div>
</template>
  
<script>
import Login from "./login.vue"
export default {
    components: {
        Login
    },
    data: () => ({
        menu: 'inicio',
        active: false,
        active2: 0
    }),
    methods: {
        toTop: function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
    },
}
</script>
<style scoped>
.contenedorSeg {
    display: flex;
    flex-direction: column;
    width: 100%;
}

h1 {
    text-align: center;
}

span {
    color: #36568c;
}

.barra {
    position: relative;
    bottom: 0;
    width: 100%;

    /* border-top: 5px solid rgba(0, 0, 0, 0.1); */
}

.contenedorMovil {
    display: flex;
    justify-content: center;
    width: 100%;
    font-family: helvetica;
    overflow: auto;

}

.centrar-div {
    display: flex;
    justify-content: center;
}

.btn-ingresar {
    margin-bottom: 20px;
    width: 30vh;


}

.block {
    width: 90%;
    text-align: justify;
}

.foot {
    background-color: #253a5f;
    font-family: helvetica;
    color: white;
}
</style>