<template>
    <div class="contenedor">
        <loading v-if="isLoading"></loading>
        <!-- Cambiar contraseña, paso = 0 -->
        <div v-if="paso == 0">
            <vs-alert gradient success class="titulo pagina">
                Actualiza tu contraseña
            </vs-alert>

            <div class="formulario CambiarContra">

                <p class="tituloformulario"><br>Ingresa tu nueva contraseña:</p>
                <div class="input password">
                    <vs-input type="password" v-model="valor_contraseña_input1" label="Nueva contraseña"
                        :progress="barra_progreso" :visiblePassword="contraseñaVisible_input1" icon-after
                        @click-icon="contraseñaVisible_input1 = !contraseñaVisible_input1">
                        <template #icon>
                            <span v-if="!contraseñaVisible_input1" class="material-icons-outlined">
                                visibility
                            </span>
                            <span v-else class="material-icons-outlined">
                                visibility_off
                            </span>

                        </template>
                        <template v-if="barra_progreso >= 100" #message-success>
                            Contraseña segura
                        </template>

                    </vs-input>
                </div>
                <div class="input password">
                    <vs-input type="password" v-model="valor_contraseña_input2" label="Reingrese la contraseña"
                        :visiblePassword="contraseñaVisible_input2" icon-after
                        @click-icon="contraseñaVisible_input2 = !contraseñaVisible_input2">
                        <template #icon>
                            <span v-if="!contraseñaVisible_input2" class="material-icons-outlined">
                                visibility
                            </span>
                            <span v-else class="material-icons-outlined">
                                visibility_off
                            </span>

                        </template>

                    </vs-input>
                </div>


                <div class="btncontinuar" @click="actualizarContraseña()">
                    <vs-button class="botoncontinuar" color="#f79034">
                        Continuar
                        <template #animate>
                            <span class="material-icons-outlined flecha">
                                arrow_forward
                            </span>
                        </template>
                    </vs-button>

                </div>



            </div>
        </div>
        <!-- Cambiar fotos, paso = 1 -->
        <div v-else-if="paso == 1">
            <vs-alert v-if="!cambioimagen" gradient success class="titulo pagina">
                Actualiza tu Foto de Perfil
            </vs-alert>
            <vs-alert v-else gradient success class="titulopaginaimgAuto">
                Actualiza la Imagen de tu Vehiculo
            </vs-alert>
            <div class="formulario CambiarImagenes">
                <p class="titulocambiarfoto">Haz click en el icono del lapiz para elegir una foto:</p>

                <!-- aun no cambia imagen, mostrar cambiar foto de perfil -->
                <div v-if="!cambioimagen" class="contimg">

                    <img class="circle" height="128" width="128" :src="imagenPerfil" alt="No imagen" id="input">
                    <div @click="abrirSelectorDeArchivos(true)"
                        style="position: absolute; top:260px; margin-left: 260px;border-radius: 20px; 
                        height: 30px; width: 30px; cursor: pointer; z-index: 1;">
                        <span style="padding: 1%;" class="material-icons-outlined kreep">
                            edit
                        </span>
                    </div>

                </div>
                <!-- mostrar cambiar imagen del auto -->
                <div v-if="cambioimagen" class="contimg">
                    <img class="circle" height="128" width="128" :src="vehiculo.imagen" alt="No imagen" id="input">
                    <div @click="abrirSelectorDeArchivos(false)"
                        style="position: absolute; top:25%; right: 26%;border-radius: 20px; height: 30px; width: 30px; cursor: pointer;">
                        <span style="padding: 1%;" class="material-icons-outlined kreep">
                            edit
                        </span>
                    </div>

                </div>
            </div>
        </div>
        <!-- Tutorial paso = 2  -->
        <div class="formulario Tutorial" v-else-if="paso == 2">
            <!-- imagen que aparece siempre durante el tuto -->
            <img src="https://i.imgur.com/meRdiDP.png" class="responsive">

            <div class="btntutorial">
                <!-- Boton retroceder pagina -->
                <div>
                    <vs-button v-if="pagina != 0" circle icon success flat @click="pagina = pagina + - 1">
                        <span class="material-icons-outlined " style="color: white;">
                            arrow_back
                        </span>
                    </vs-button>

                </div>
                <div class="centro ">
                    <h1 v-if="pagina == 0">Revisa la lista de viajes</h1>
                    <h1 v-if="pagina == 1">Verifica la información de los choferes</h1>
                    <h1 v-if="pagina == 2">Selecciona el viaje que más te convenga</h1>
                    <h1 v-if="pagina == 3">Selecciona tu punto de parada con el marker azul y haz click en Unirse</h1>
                    <h1 v-if="pagina == 4">Espera que el conductor acepte tu solicitud... Recibirás una notificación</h1>
                    <h1 v-if="pagina == 5">Puedes hablar con los otros participantes en el chat</h1>
                    <h1 v-if="pagina == 6">En caso de emergencia, no dudes en usar el botón de pánico o grabar el audio de
                        tu viaje</h1>
                    <h1 v-if="pagina == 7">Viaja tranquilamente y no olvides calificar a tu chofer contandonos tu
                        experiencia!</h1>
                </div>
                <!-- boton avanzar pagina -->
                <div>
                    <!-- fin tutorial termina el tutorial si llegamos a pagiona = 8, hay que cambiarlo a mano -->
                    <vs-button circle icon success flat @click="pagina = pagina + 1; fin_tutorial()">
                        <span class="material-icons-outlined forward" style="color: white;">
                            arrow_forward
                        </span>
                    </vs-button>
                </div>
            </div>


            <div class="pagina animate__animated animate__zoomIn" v-if="pagina == 0">
                <CardViaje :viaje-seleccionado="item"
                    v-for="(                  item, index                  ) in                   viajesHardcoded                  "
                    :key="index" id="card_no_events " />
            </div>

            <div class="pagina" v-if="pagina == 1">

                <CardViaje :viaje-seleccionado="viajesHardcoded[1]" id="card_no_events"
                    estilo_btnChofer="material-icons-outlined downward kreep" />

            </div>
            <div class="pagina" v-if="pagina == 2">

                <CardViaje :viaje-seleccionado="viajesHardcoded[1]" id="card_no_events"
                    estilo_btnViajar="material-icons-outlined downward kreep" />




            </div>
            <div v-if="pagina == 3">
                <div style="display: flex;">
                    <PuntosdeSubidaTutorial texto_btn="UNIRSE"
                        estilo_btnUnirse="animate__animated animate__bounceInUp animate__delay-3s animate__slow"
                        mostrar_BtnInfoChofer="no_mostrar" mostrar_menu="no_mostrar" :activar_menu=false />

                </div>
            </div>
            <div v-if="pagina == 4">
                <div>
                    <vs-navbar shadow square center-collapsed>
                        <template #left>
                            <span class="material-icons-outlined" style="color:#36568c;">
                                menu
                            </span>
                        </template>
                        <img class="imgNavbar" src="https://i.ibb.co/kM1Tm5S/otroauto.png" />

                        <template #right>
                            <div>
                                <div class="center">
                                    <vs-avatar class="animate__animated animate__wobble animate__slow animate__infinite"
                                        color="#FFFFFF" style="margin-top: 3px;" badge-color="danger"
                                        badge-position="top-right">
                                        <span class="material-icons-outlined" style="color:#36568c;">
                                            notifications
                                        </span>
                                        <template #badge>
                                            1
                                        </template>
                                    </vs-avatar>

                                </div>
                            </div>
                        </template>
                    </vs-navbar>
                </div>



            </div>
            <div v-if="pagina == 5">
                <div style="display: flex;">
                    <PuntosdeSubidaTutorial estilo_btnUnirse="no_mostrar " mostrar_BtnInfoChofer="no_mostrar"
                        mostrar_menu="animate__animated animate__bounce animate__repeat-1" :activar_menu=true
                        boton_chat="animate__animated animate__rubberBand animate__infinite" />
                </div>

            </div>
            <div v-if="pagina == 6">
                <div style="display: flex;">
                    <PuntosdeSubidaTutorial estilo_btnUnirse="no_mostrar " mostrar_BtnInfoChofer="no_mostrar"
                        :activar_menu=true boton_panicoygrabar="animate__animated animate__rubberBand animate__infinite" />
                </div>
            </div>
            <div style="display: flex; flex-direction: column;" v-if="pagina == 7">
                <div class="notificacionMenu">
                    <div class="infoCommend">
                        <div>
                            <div
                                style=" display: flex; flex-direction: column; width:100%;margin-bottom: 3%;  justify-content: center; text-align: left;">
                                <div style="display: flex; width: 75%;">
                                    <span style="padding-right: 2%;" class="material-icons-outlined">
                                        new_releases
                                    </span>
                                    <p style="margin: 0;">
                                        Viaje finalizado
                                    </p>
                                </div>
                            </div>
                            <div style="display: flex; width: 100%; flex-direction: column;">
                                <div style="display: flex; justify-content: space-between;">
                                    <div style="display:flex; width: 100%; justify-content: space-between;">
                                        <vs-button @click=" getViaje(mensaje.idviaje, index)"
                                            style="text-align: center; width: 100px; background-color: rgb(54, 86, 140); border-radius: 12px; font-size: 13px; color: white; cursor: pointer;">
                                            Ver más
                                        </vs-button>
                                        <vs-button class="animate__animated animate__rubberBand animate__infinite"
                                            @click="active = !active" success style="width: 150px;">
                                            Calificar chofer
                                        </vs-button>
                                    </div>
                                    <div>
                                        <vs-dialog width="550px" not-center v-model="active" prevent-close>
                                            <template #header>
                                                <h4 class="not-margin">
                                                    Añade una calificación
                                                </h4>
                                            </template>
                                            <div class="con-content">
                                                <p>
                                                    Puntua con una calificación de 1 a 5 la calidad del viaje.
                                                </p>
                                            </div>
                                            <div class="contenedorestrellas">
                                                <span :style="{ color: estrellaColor0 }"
                                                    class="material-icons-outlined estrella" id="1" @mouseover=" hola(1)">
                                                    star
                                                </span>

                                                <span :style="{ color: estrellaColor1 }"
                                                    class="material-icons-outlined estrella" id="2" @mouseover=" hola(2)">
                                                    star
                                                </span>

                                                <span :style="{ color: estrellaColor2 }"
                                                    class="material-icons-outlined estrella" id="3" @mouseover=" hola(3)">
                                                    star
                                                </span>

                                                <span :style="{ color: estrellaColor3 }"
                                                    class="material-icons-outlined estrella" id="4" @mouseover=" hola(4)">
                                                    star
                                                </span>

                                                <span :style="{ color: estrellaColor4 }"
                                                    class="material-icons-outlined estrella" id="5" @mouseover=" hola(5)">
                                                    star
                                                </span>

                                            </div>
                                            <div>

                                                <h4 class="not-margin">
                                                    Añade una comentario(OPCIONAL)
                                                </h4>

                                                <vs-input placeholder="ingresa un comentario aqui ..."
                                                    @input="limitarcaracteres" />
                                                <p>{{ value.length }} / {{ maxCaracteres }}</p>
                                            </div>

                                            <template #footer>
                                                <div class="barrainfe">
                                                    <vs-button style="margin: 0 auto;">
                                                        Agregar calificación
                                                    </vs-button>
                                                    <span class="material-icons-outlined info">
                                                        info
                                                    </span>
                                                </div>
                                            </template>
                                        </vs-dialog>
                                    </div>



                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CardViaje from '../components/CardViaje.vue';
import PuntosdeSubidaTutorial from '../components/PuntosdeSubidaTutorial.vue';
import NotificacionBoton from '../components/NotificacionBoton.vue';
import API from '@/api';
import InformacionChofer from '../components/InformacionChofer.vue';
import loading from '../components/loading.vue';


export default {
    data() {
        return {
            isLoading: false,
            valor_contraseña_input1: '',
            valor_contraseña_input2: '',
            contraseñaVisible_input1: false,
            contraseñaVisible_input2: false,
            paso: 0,
            btn_continuar: 0,
            pagina: 0,
            viajesHardcoded:
                [{
                    haciautalca: true,
                    destino: {
                        nombre: 'Molina, Maule, Chile',
                    },
                    disponibles: 2,
                    precio: 1000,
                    fecha: '2023-05-18',
                    horainicio: '21:12',
                },
                {
                    haciautalca: false,
                    origen: {
                        nombre: 'Claudio Vicuña, Empedrado, Maule 354000, Chile',
                    },
                    disponibles: 4,
                    precio: 0,
                    fecha: '2023-06-18',
                    horainicio: '8:30',
                    destino: 'Universidad de talca, sede Los niches'
                },

                ],
            //calificar chofer
            active: false,
            active2: false,
            active3: false,
            value: '',
            activarbotones: true,
            numeroestrellas: 0,
            maxCaracteres: 100,
            estrellaColor0: "gray",
            estrellaColor1: "gray",
            estrellaColor2: "gray",
            estrellaColor3: "gray",
            estrellaColor4: "gray",
            //cambiar img perfil y auto
            eschofer: false,
            imagenPerfil: '',
            imagenAuto: '',
            file: null, // Declarar la variable file aquí
            urlFoto: "",
            activeEditar: false,
            vehiculo: null,
            cambioimagen: false, //verificar si cambio la imagen
            
        }
    },
    mounted() {
        this.usuario()

    },
    methods: {
        usuario() {
            const token = JSON.parse(localStorage.getItem("carpooltoken"))
            // Obtener cositas
            this.imagenPerfil = token.imagenperfil
            this.eschofer = token.eschofer
            this.vehiculo = token.vehiculo
        },
        prueba() {
            this.$store.state.vistaViaje = this.viajesHardcoded[1];
        },
        async actualizarContraseña() {

            /*Validamos los campos del usuario*/
            if (this.barra_progreso == 100 && this.misma_contraseña) {
                this.openNotificationSuccess("Contraseña actualizada")
                const token = JSON.parse(localStorage.getItem("carpooltoken"));
                token.contrasena = this.valor_contraseña_input1;

                const res = await this.axios.put(`updatecontrausuario`, {
                    "userid": token._id,
                    "contranueva": token.contrasena
                })
                console.log(res)
                this.paso = this.paso + 1;
            } else if (this.barra_progreso != 100) {
                this.openNotificationError("Contraseña no segura")
            } else {
                this.openNotificationError("Las contraseñas no son las mismas")
            }

        },


        openNotificationError(title) {
            const noti = this.$vs.notification({
                position: 'bottom-center',
                title,
                duration: '1500',
                color: 'danger',

            })
        },
        openNotificationSuccess(title) {
            const noti = this.$vs.notification({
                position: 'bottom-center',
                title,
                duration: '1500',
                color: 'success',

            })
        },
        fin_tutorial() {
            //loading mientras cargamos el mapa
            if (this.pagina == 3 || this.pagina == 5 ) {
                this.isLoading = true;
                setTimeout(() =>  this.isLoading = false, 3000);
            }
            if (this.pagina == 8) {
                this.openLoading();
                this.$router.push('/cliente');
            }
        },
        openLoading() {
            const loading = this.$vs.loading()
            setTimeout(() => {
                loading.close()
            }, 1000)
        },


        actualizarEstrellas(valor) {
            this.numeroestrellas = valor
        },
        limitarcaracteres() {
            if (this.value.length > this.maxCaracteres) {
                this.value = this.value.slice(0, this.maxCaracteres)
            }
        },
        menuestrellas() {

            this.active = !this.active
            this.active2 = !this.active2

        },
        estrellaslistener() {

            const estrellas = []

            for (var i = 1; i <= 5; i++) {
                const estrella = document.getElementById(i);

                estrellas.push(estrella)

                console.log(estrella)

                estrella.addEventListener("mouseover", (event) => {

                    const estrellaseleccionada = event.target.id - 1
                    this.actualizarEstrellas(event.target.id)
                    this.numeroestrellas = event.target.id

                    for (let index = 0; index < estrellas.length; index++) {
                        const element = estrellas[index];
                        element.style.color = "gray"
                        if (index <= estrellaseleccionada) {
                            element.style.color = "orange"
                        }
                    }
                });
            }

        },
        info() {
            this.active2 = !this.active2
        },
        hola(id) {
            console.log("mouseover" + id)
            const estrellaseleccionada = id - 1
            this.actualizarEstrellas(id)
            this.numeroestrellas = id

            for (let index = 0; index < 5; index++) {
                const propName = "estrellaColor" + index;
                this[propName] = "gray"
                if (index <= estrellaseleccionada) {


                    this[propName] = "orange"
                }
            }



        },
        abrirSelectorDeArchivos(perfil_o_auto) {
            this.isLoading = true;
            const input = document.createElement('input');
            console.log(input)
            input.type = 'file';
            input.accept = 'image/*';
            input.click();
            input.onchange = (event) => {
                this.file = event.target.files[0];
                console.log(this.file)
                if (this.file) {

                    const fileName = this.file.name;

                    const reader = new FileReader();

                    reader.readAsDataURL(this.file);
                    const storageRef = firebase.storage().ref();
                    
                    if(perfil_o_auto){
                        const imagePath = 'images/'+JSON.parse(localStorage.getItem("carpooltoken"))._id+"perfil";
                    }else{
                        const imagePath = 'images/'+JSON.parse(localStorage.getItem("carpooltoken"))._id+"auto";
                    }
                    const imageRef = storageRef.child(imagePath);
                    const uploadTask = imageRef.put(this.file);

                    // Maneja los eventos de progreso y finalización de la carga
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Maneja el progreso de carga, si lo deseas
                        },
                        (error) => {
                            // Maneja los errores durante la carga
                            console.error(error);
                        },
                        () => {
                            //si es chofer le pedimos que cambie la foto de su auto
                            //alert(this.eschofer)
                            if (this.eschofer) {
                                this.cambioimagen = !this.cambioimagen;
                                this.isLoading = false;

                            } else { //si no es chofer seguimos con el tutorial
                                this.paso = this.paso + 1;
                                this.isLoading = false;
                            }
                            // La carga se ha completado con éxito
                            console.log('Imagen cargada exitosamente.');
                            // Obtén la URL de descarga de la imagen
                            uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                                console.log('URL de descarga:', downloadURL);
                                this.urlFoto = downloadURL
                                //perfil = true, auto = false
                                if (perfil_o_auto) {
                                    this.imagenPerfil = downloadURL
                                    var data = {
                                        userid: JSON.parse(localStorage.getItem("carpooltoken"))._id,
                                        fotoperfil: downloadURL
                                    }
                                    var token = JSON.parse(localStorage.getItem("carpooltoken"))
                                    token.imagenperfil = downloadURL
                                    await localStorage.setItem('carpooltoken', JSON.stringify(token));
                                    this.$store.state.urlperfil = downloadURL
                                    this.$emit('cambiarfoto');
                                    const foto = await API.addFotoPerfil(data)

                                } else {
                                    console.log("ENTRE AL AUTO")
                                    this.paso = this.paso + 1;
                                    this.vehiculo.imagen = downloadURL
                                    var data = {
                                        userid: JSON.parse(localStorage.getItem("carpooltoken"))._id,
                                        vehiculo: this.vehiculo.imagen
                                    }
                                    var token = JSON.parse(localStorage.getItem("carpooltoken"))
                                    token.vehiculo.imagen = downloadURL
                                    await localStorage.setItem('carpooltoken', JSON.stringify(token));
                                    const foto = await API.addFotoAuto(data)
                                    //const foto = await API.addFotoPerfil(data)

                                }



                            });
                        }
                    );


                }
            };

        },
    },
    computed: {
        barra_progreso() {
            let progress = 0

            // tiene un numero

            if (/\d/.test(this.valor_contraseña_input1)) {
                progress += 20
            }

            // tiene una letra mayuscula

            if (/(.*[A-Z].*)/.test(this.valor_contraseña_input1)) {
                progress += 20
            }

            // tiene minusculas

            if (/(.*[a-z].*)/.test(this.valor_contraseña_input1)) {
                progress += 20
            }

            // mas de 5 digitos

            if (this.valor_contraseña_input1.length >= 6) {
                progress += 20
            }

            // al menos un caracter espcial

            if (/[^A-Za-z0-9]/.test(this.valor_contraseña_input1)) {
                progress += 20
            }

            return progress
        },
        misma_contraseña() {

            if (this.valor_contraseña_input1 == this.valor_contraseña_input2) {
                return true;
            } else {
                return false;
            }

        }
    },
    components: {
        CardViaje,
        PuntosdeSubidaTutorial,
        NotificacionBoton,
        InformacionChofer,
        loading
    },
};
</script>

<style scoped>
.centro h1 {
    font-size: 15px;
}

.contenedor{
    height: auto;
}

.contenedor .titulo.pagina {
    background-color: #f79034;
    width: 300px;
    height: 10px;
    margin: auto;
    text-align: center;
    font-size: larger;
    margin-top: 10px;
    margin-bottom: 10px;
}
.titulopaginaimgAuto {
    background-color: #f79034;
    width: 300px;
    height: auto;
    margin: auto;
    text-align: center;
    font-size: 18px;
    margin-top: 10px;
    margin-bottom: 10px;
}
.formulario.CambiarContra {
    color: white;
    background-color: #36568c;
    margin: auto;
    width: 370px;
    height: auto;
    border-radius: 7%;
}
.formulario.CambiarImagenes {
    color: white;
    background-color: #36568c;
    margin: auto;
    width: 370px;
    height: 280px;
    border-radius: 7%;
}


.tituloformulario {
    text-align: center;
}
.titulocambiarfoto{
    width: 80%;
    padding: 20px;
    margin: auto;
}
.formulario .material-icons-outlined {
    color: #f79034;
}

.formulario .material-icons-outlined.flecha {
    color: white;

}

.formulario .input {
    margin-top: 5vh;
    display: flex;
    justify-content: center;

}

.formulario .select {
    margin-top: 5vh;
    display: flex;
    justify-content: center;

}
.formulario .checkbox {
    margin-top: 2vh;
    display: flex;
    justify-content: center;
}
.formulario .btncontinuar {
    margin-top: 2vh;
    margin-bottom: 2vh;
    display: flex;
    justify-content: center;
}

/**PARTE DEL TUTORIAL */
.formulario.Tutorial {
    color: white;
    background-color: #36568c;
    margin: auto;
    width: 100%;

}

.botoncontinuar {
    margin-bottom: 15px;
}

.responsive {
    width: 100%;
    height: auto;
}


.btntutorial {
    display: flex;
    justify-content: space-between;
    overflow: auto;
    width: 100vw;
    text-align: center;
    z-index: 5000;
}

h1 {
    font-size: 20px;
}


.centro {
    float: inline-start;
    width: 70%;
    text-align: center;
}



.pagina {
    background-color: white;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px;
}

#card_no_events:active {
    pointer-events: none;
}

#card_no_events:hover+#flecha_abajo {
    background-color: #ccc
}
.material-icons-outlined{
        -webkit-transition-duration: 0.4s;
    /* Safari */
    transition-duration: 0.4s;
}
.material-icons-outlined.downward {
    position: absolute;
    font-size: 44px;
    top: 61%;
    /* left: 37.6%; */
    background-color: white;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    -webkit-transition-duration: 0.4s;
    /* Safari */
    transition-duration: 0.4s;
}

.material-icons-outlined.downward:hover {
    background-color: #555555;
    color: white;
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
    animation: kreep 0.7s ease 2s infinite alternate;
}

.material-icons-outlined.kreep {

    /*name-duration-function(ease,eas-in,linear)-delay-count-direction */
    animation: kreep 0.7s ease 2s infinite alternate;
}

/*END BOUNCER*/
.vs-navbar-content {
    position: relative;
}


.imgNavbar {
    position: absolute;

    height: 35px;
    z-index: 5000;

}

/*calificar chofer*/
.vs-input {
    width: 100%;
}

.contenedorestrellas {

    display: flex;
    justify-content: center;

}

.estrella {
    font-size: 50px;
    /* Ajusta el tamaño de fuente según tus necesidades */

}

.barrainfe {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info {
    color: #000;
}

/* notificacion */
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

.notificacionMenu {
    position: fixed;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100vw;
    z-index: 10;
    overflow-y: scroll;

    backdrop-filter: blur(100px);
}

/* cambiar img perfil
 */
.contimg {
    display: flex;
}

.circle {
    margin: auto;
    /* ciruclo alrededor de la imagen */
    border: 4px solid rgba(200, 200, 200, 0.4);
    border-radius: 50%;
    /* El valor es relativo al tamaño de la imagen */
    /*box-shadow: 0px 0px 5px rgba(0,0,0,0.4);*/
    transition: linear 0.25s;

}


.circle:hover {
    transition: ease-out 0.2s;
    border: 4px solid rgba(0, 0, 0, 0.2);
    -webkit-transition: ease-out 0.2s;
    cursor: pointer;
}
</style>
