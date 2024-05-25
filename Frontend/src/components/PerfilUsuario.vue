<template>
    <div class='contenedorperfil'>
        <div class="contimg">

            <div  v-if="this.eschofer" style="position: absolute;width: 80%; height: 130px; margin: auto; margin-bottom: 9px; margin-top: 10px; border-radius: 30px;">
                <img style="width: 100%; height: 100%; background-image: cover; border-radius: 30px;" :src="conductorInfo.vehiculo.imagen" alt="">
            </div>
            <img class="circle" style="margin-top: 80px;" height="128" width="128" :src="imagenPerfil" alt="No imagen" id="input">


            <div @click="abrirSelectorDeArchivos"
                style="z-index: 11; position: absolute;width: 128px; height: 64px; border-bottom-left-radius: 1000px; border-bottom-right-radius: 1000px; background-color: rgba(45, 45, 45, 0.4); bottom: 0; margin: auto; margin-bottom: 9px;">
                <div
                    style="display: flex; width: 100%; justify-content: center; color: white; top:20%;; position: relative;">
                    <img style="width: 30px;" src="https://i.ibb.co/WkJH1tp/whiteedit.png" alt="">

                </div>
            </div>


        </div>

        <h3 style="margin:0;">{{ this.nombre }}</h3>
        <div style="display: flex; width: 100%; justify-content: center;">
            <vs-button dark @click="activeEditar = !activeEditar" style="width:30%;">

                Editar Perfil
            </vs-button>
        </div>

        <vs-dialog v-model="activeEditar">
            <div style=" flex-direction: column;">
                <p style="margin: 0;">Cambiar numero de emergencias</p>
                <div style="display: flex;">
                    <vs-input state="dark" type="Number" v-model="ncontacto" placeholder="56912345678" />

                    <vs-button @click="cambiacontacto" style="width: 100px;">
                        Actualizar
                    </vs-button>
                </div>

            </div>

        </vs-dialog>

        <div class="correo">
            <p class="correo">{{ this.correo }}</p>
        </div>

        <div class="contimg">
            <button class="botonChofer" v-if="this.eschofer">Chofer</button>
            <button class="botonChofer" v-if="!this.eschofer">Pasajero</button>
        </div>


        <p style="margin-left: 2px;">Actividad: {{ this.actividad }} </p>

        <div v-if="this.eschofer" style="display: flex; justify-content: center; width: 100%;">
            <vs-button @click="activeinfo = !activeinfo">
                
                <p style="margin: 0; margin-right: 10px;">
                    Informacion del chofer
                </p> 
                <span class="material-icons-outlined">
                    info
                </span>

            </vs-button>
            <vs-dialog overflow-hidden full-screen v-model="activeinfo">
                <InformacionChofer :conductor="this.conductorInfo" :comentarios="comentarios"
                    :valoraciontotal="valoraciontotal" :imagenperfil="imagenPerfil" />
            </vs-dialog>
        </div>

    </div>
</template> 

<script>
import InformacionChofer from './InformacionChofer.vue';
import API from '@/api';

export default {
    name: 'G2ProyTaller12023PerfilUsuario',
    data() {
        return {
            id: "",
            nombre: "",
            correo: "",
            actividad: "",
            eschofer: false,
            vehiculo: null,
            clickInfoAuto: false,
            imagenPerfil: '',
            file: null, // Declarar la variable file aquí
            urlFoto: "",
            activeEditar: false,
            ncontacto: "",
            comentarios: [],
            valoraciontotal: 0,
            conductorInfo: null,
            activeinfo: false
        };
    },

    mounted() {
        this.usuario()
        this.comentariosMios()


    },
    components: {
        InformacionChofer
    },
    methods: {
        usuario() {
            const token = JSON.parse(localStorage.getItem("carpooltoken"))
            this.conductorInfo = token
            // Obtener nombre
            this.id = token.id
            this.nombre = token.nombre
            this.correo = token.correo
            this.actividad = token.actividad
            this.eschofer = token.eschofer
            this.imagenPerfil = token.imagenperfil
            this.vehiculo = token.vehiculo
        },
        mostrarInfoAuto() {
            this.clickInfoAuto = !this.clickInfoAuto
        },

        abrirSelectorDeArchivos() {
            const input = document.createElement('input');
            console.log(input)
            input.type = 'file';
            input.accept = 'image/*';
            input.click();
            input.onchange = async (event) => {
                var loading = this.$vs.loading({
                    type: 'default'
                })
                this.file = event.target.files[0];
                console.log(this.file)
                if (this.file) {

                    const fileName = this.file.name;

                    const reader = new FileReader();

                    reader.readAsDataURL(this.file);
                    const storageRef = firebase.storage().ref();
                    const imagePath = 'images/' +JSON.parse(localStorage.getItem("carpooltoken"))._id+"perfil";
                    const imageRef = storageRef.child(imagePath);
                    const uploadTask = imageRef.put(this.file);

                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Maneja el progreso de carga, si lo deseas
                        },
                        (error) => {
                            // Maneja los errores durante la carga
                            console.error(error);
                        },
                        async () => {
                            console.log('Imagen cargada exitosamente.');
                            await uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                                console.log('URL de descarga:', downloadURL);
                                this.urlFoto = downloadURL
                                this.imagenPerfil = downloadURL
                                var data = {
                                    userid: JSON.parse(localStorage.getItem("carpooltoken"))._id,
                                    fotoperfil: downloadURL
                                }
                                var token = JSON.parse(localStorage.getItem("carpooltoken"))
                                token.imagenperfil = downloadURL
                                localStorage.setItem('carpooltoken', JSON.stringify(token));
                                this.$store.state.urlperfil = downloadURL
                                this.$emit('cambiarfoto');
                                await API.addFotoPerfil(data)
                            });
                        },
                    );


                }
                loading.close()
            };

        },
        async cambiacontacto() {
            if (this.validaciones(this.ncontacto, "Número de Contacto")) {
                const loading = this.$vs.loading({
                    type: 'default'
                })
                var data = {
                    userid: JSON.parse(localStorage.getItem("carpooltoken"))._id,
                    numero: this.ncontacto
                }
                await API.addnumcontacto(data)
                loading.close()
                this.activeEditar = false
            }

        },
        async comentariosMios() {
            this.valoraciontotal = 0
            this.comentarios = await API.getcalificacionbychofer(JSON.parse(localStorage.getItem("carpooltoken"))._id)
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

        },
        validaciones(campo, nombre) {
            if (this.validarVacios(campo, nombre)) {
                /*Si no estamos validando el correo estamos listos*/
                if (nombre != "Número de Contacto") {
                    return true;
                }
                /*Validamos el correo */
                if (this.validarNcontacto(campo)) {
                    return true;
                } else {

                    this.openNotificationError('Número de contacto no válido');
                    return false;
                }
            } else {
                this.openNotificationError('Campo ' + nombre + ' vacio');
                return false;
            }
        },
        validarVacios(campo, nombre) {
            if (campo == '') {
                return false;
            } else {
                return true;
            }
        },
        validarNcontacto(Contacto) {
            var Contactotest = "+" + this.ncontacto;

            if (/^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/.test(Contactotest)) {

                return true;
            } else {

                return false;
            }
        },
        openNotificationError(title) {
            const noti = this.$vs.notification({
                position: 'top-center',
                title,
                duration: '1500',
                color: 'danger',

            })
        }

    },
}
</script>

<style scoped>
.contenedorperfil {
    background: white;

    color: #000;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.1);
    text-align: center;
    display: flex;
    flex-direction: column;

    width: 100vw;
    height: 100%;

}

::-moz-selection {
    background: rgba(0, 0, 0, 0.1);
}

::selection {
    background: rgba(0, 0, 0, 0.1);
}

h1 {
    font-weight: 100;
    font-size: 2.7em;
}

h3 {
    color: #111222;
    font-size: 1.4em;
}

a {
    color: RoyalBlue;
    font-weight: normal;
    text-decoration: none;
}

a:hover {
    color: CornflowerBlue;
}

.contimg {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
}

.circle {
    line-height: 0;
    /* remover line-height */
    display: inline-block;
    /* ciruclo alrededor de la imagen */
    margin: 5px;
    border: 5px solid rgba(255, 255, 255, 1);
    border-radius: 50%;
    /* El valor es relativo al tamaño de la imagen */
    /*box-shadow: 0px 0px 5px rgba(0,0,0,0.4);*/
    transition: linear 0.25s;
    height: 128px;
    width: 128px;
    margin-top: 4vh;
    z-index: 10;
}

.circle {
    display: flex;
    border-radius: 50%;
    /* El valor es relativo al tamaño de la imagen */
}

.circle:hover {
    transition: ease-out 0.2s;
    border: 4px solid rgba(0, 0, 0, 0.2);
    -webkit-transition: ease-out 0.2s;
    cursor: pointer;
}

.barra_arriba {
    height: 5vh;
    background-color: #36568C;
}

.letra_chofer_pasajero {
    font-size: 18px;
}

.informacion_usuario {
    background-color: #feb677;
    width: 200px;
    display: inline-block;
    justify-content: center;
}

.botonChofer {
    background-color: #f79034;
    border: none;
    color: white;
    padding: 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 12px;
    width: 25vh;
    cursor: default;
}

.correo {
    font-size: 18px;
    color: gray;
}

.info_user {
    border: 4px solid rgba(46, 46, 46, 0.4);
    border-radius: 3%;
    margin-right: 3px;
}

.info_user.boton {
    background-color: orange;
    cursor: pointer;
    width: 100%;

}

.centrar-div {
    display: flex;
    justify-content: center;
}
</style>