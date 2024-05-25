<template>
    <div class="contenedor">

        <vs-alert gradient success class="titulo pagina">
            Creacion de Usuario
        </vs-alert>
        <div class="formulario" v-if="!mostrarPanelAuto">

            <p class="tituloformulario"><br>Complete los siguientes campos:</p>
            <div class="input nombre">
                <vs-input success state="#f79034" v-model="value_input_nombre" label="Ingresar Nombre" />
            </div>
            <div class="input correo">
                <vs-input success state="#f79034" v-model="value_input_correo" label="Ingresar Correo" />
            </div>
            <!-- <div class="input password">
                <vs-input type="password" success state="#f79034" v-model="value_input_password"
                    label="Ingresar Contraseña" />
            </div> -->
            <div class="select actividad">
                <vs-select success placeholder="Select" v-model="value_select_actividad" label="Seleccione Actividad">
                    <vs-option label="Estudiante" value="estudiante">
                        Estudiante
                    </vs-option>
                    <vs-option label="Docente" value="docente">
                        Docente
                    </vs-option>
                    <vs-option label="Funcionario" value="funcionario">
                        Funcionario
                    </vs-option>
                </vs-select>
            </div>

            <div class="checkbox chofer">
                <vs-checkbox success val="chofer" v-model="seraChofer">
                    ¿Es chofer?
                </vs-checkbox>
            </div>
            <div class="btncontinuar" @click="ingresarUsuario()">
                <vs-button color="#f79034" :btn_continuar="btn_continuar == 0" @click="btn_continuar = 0">
                    Continuar
                    <template #animate>
                        <span class="material-icons-outlined">
                            arrow_forward
                        </span>
                    </template>
                </vs-button>
            </div>




        </div>
        <div class="formulario Chofer" v-if="mostrarPanelAuto">
            <div class="btnvolver">
                <vs-button circle icon success flat @click="mostrarPanelAuto = !mostrarPanelAuto; active = 1">

                    <span class="material-icons-outlined">
                        arrow_back
                    </span>
                    <span class="material-icons-outlined">
                        arrow_back
                    </span>
                </vs-button>
            </div>
            <div class="tituloformulario">
                Ingrese los datos de su Vehiculo
            </div>

            <div class="input patente">

                <vs-input success state="#f79034" v-model="value_input_patente" label="Ingresar Patente" />
            </div>

            <!-- Ingresar Marca -->
            <div class="input">
                <vs-select v-model="selectedBrand" class="mb-4" v-if="auto" label="Ingresar la marca">
                    <vs-option v-for="car in auto" :key="car.marca" :label="car.marca" :value="car.marca">{{ car.marca
                    }}</vs-option>
                </vs-select>
            </div>

            <div class="input " v-if="selectedBrand == 'Otro'">
                <vs-input label="Ingresar Otra Marca" success state="#f79034" v-model="otro_marca" />
            </div>
            <!-- Ingresar Modelo -->
            <div class="input" v-if="selectedBrand != 'Otro'">
                <vs-select v-model="selectedModel" v-if="selectedBrand" :key="selectedBrand" label="Ingresar el modelo">
                    <vs-option v-for="model in selectedBrandModels" :key="model" :label="model" :value="model">{{ model
                    }}</vs-option>
                </vs-select>
            </div>
            <div class="input " v-if="selectedBrand == 'Otro'">
                <vs-input label="Ingresar Otro Modelo" success state="#f79034" v-model="otro_modelo" />
            </div>
            <div class="btncontinuar" @click="ingresarVehiculo()">
                <vs-button color="#f79034" :btn_continuar="btn_continuar == 0" @click="btn_continuar = 0">
                    Continuar
                    <template #animate>
                        <span class="material-icons-outlined">
                            arrow_forward
                        </span>
                    </template>
                </vs-button>
            </div>
            <br>
        </div>
    </div>
</template>

<script>
import API from '../api';
import emailjs from 'emailjs-com';
export default {
    data() {
        return {
            selectedBrand: '',
            selectedModel: '',
            auto: [
                {
                    marca: "Toyota",
                    modelos: ["Corolla", "Camry", "Rav4", "Yaris", "Prius"]
                },
                {
                    marca: "Honda",
                    modelos: ["Civic", "Accord", "CR-V", "Pilot", "Fit"]
                },
                {
                    marca: "Ford",
                    modelos: ["Mustang", "F-150", "Explorer", "Escape", "Focus"]
                },
                {
                    marca: "Chevrolet",
                    modelos: ["Cruze", "Malibu", "Equinox", "Traverse", "Tahoe"]
                },
                {
                    marca: "Volkswagen",
                    modelos: ["Golf", "Jetta", "Passat", "Tiguan", "Atlas"]
                },
                {
                    marca: "Nissan",
                    modelos: ["Sentra", "Altima", "Maxima", "Rogue", "Pathfinder"]
                },
                {
                    marca: "Hyundai",
                    modelos: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Kona"]
                },
                {
                    marca: "BMW",
                    modelos: ["3 Series", "5 Series", "X3", "X5", "7 Series"]
                },
                {
                    marca: "Mercedes-Benz",
                    modelos: ["C-Class", "E-Class", "GLC", "GLE", "S-Class"]
                },
                {
                    marca: "Audi",
                    modelos: ["A4", "A6", "Q5", "Q7", "TT"]
                },
                {
                    marca: "Lexus",
                    modelos: ["IS", "ES", "RX", "NX", "LS"]
                },
                {
                    marca: "Mazda",
                    modelos: ["Mazda3", "Mazda6", "CX-5", "CX-9", "MX-5 Miata"]
                },
                {
                    marca: "Subaru",
                    modelos: ["Impreza", "Legacy", "Forester", "Outback", "WRX"]
                },
                {
                    marca: "Kia",
                    modelos: ["Forte", "Optima", "Sorento", "Sportage", "Stinger"]
                },
                {
                    marca: "Tesla",
                    modelos: ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"]
                },
                {
                    marca: "Volvo",
                    modelos: ["S60", "S90", "XC40", "XC60", "XC90"]
                },
                {
                    marca: "Land Rover",
                    modelos: ["Range Rover Evoque", "Range Rover Sport", "Discovery", "Defender", "Velar"]
                },
                {
                    marca: "Jaguar",
                    modelos: ["XE", "XF", "F-PACE", "E-PACE", "I-PACE"]
                },
                {
                    marca: "Porsche",
                    modelos: ["911", "Panamera", "Cayenne", "Macan", "Taycan"]
                },
                {
                    marca: "Ferrari",
                    modelos: ["488 GTB", "F8 Tributo", "812 Superfast", "SF90 Stradale", "Portofino"]
                },
                {
                    marca: "Lamborghini",
                    modelos: ["Aventador", "Huracan", "Urus", "Sián", "Veneno"]
                },
                {
                    marca: "Otro",
                    modelos: ["Otro"]
                },
            ],
            valorModelo: "",
            value_input_nombre: '',
            value_input_correo: '',
            // value_input_password: '',
            value_select_actividad: '',
            value_input_patente: '',
            otro_marca: '',
            otro_modelo: '',
            valorMarca: "",
            seraChofer: false,
            mostrarPanelAuto: false,
            btn_continuar: 0,
            /*Datos Usuario*/
            datosUsuario: {
                nombre: String,
                correo: {
                    type: String,
                    unique: true
                },
                contrasena: String,
                actividad: String,
                imagenperfil: String,
                eschofer: Boolean,
                contPanico: 0,
                numContacto: String,
                vehiculo: {
                    imagen: String,
                    patente: String,
                    marca: String,
                    modelo: String
                }
            },
            templateParams: {
                email: 'jreveco19@alumnos.utalca.cl',
                password: ''
            },
        }
    },
    computed: {
        selectedBrandModels() {
            if (this.selectedBrand) {
                const car = this.auto.find(car => car.marca === this.selectedBrand);
                return car ? car.modelos : [];
            }
            return [];
        },
    },
    methods: {
        actualizarModelos() {
            this.arrayModelos = [];
            let marcaSeleccionada = this.auto.find(e => e.marca === this.valorMarca);
            if (marcaSeleccionada) {
                this.arrayModelos = [...marcaSeleccionada.modelos];
            }
        },
        obtenermodelos() {
            console.log("valor:_ ", this.valorModelo)
            this.arrayModelos = []
            this.auto.forEach(e => {
                if (this.valorMarca == e.marca) {
                    e.modelos.forEach(element => {
                        this.arrayModelos.push(element)
                    });
                }
            });

        },
        async ingresarUsuario() {
            /*Validamos los campos del usuario*/
            if (this.validaciones(this.value_input_nombre, "Nombre") &&
                this.validaciones(this.value_input_correo, "Correo") &&
                this.validaciones(this.value_select_actividad, "Actividad")) {
                /**Comprobamos si es chofer, de serlo le mostramos el panel para llenar los datos del auto */
                if (this.seraChofer) {
                    this.mostrarPanelAuto = true;
                } else {
                    /*Si no va hacer chofer lo registramos de inmediato, con los datos del vehiculo vacios*/
                    const loading = this.$vs.loading({
                        type: 'default'
                    })
                    /**Generamos la contraseña provisoria para el usuario, una variable para el template y otra para la bd */
                    this.templateParams.password = this.generatePassword();
                    this.templateParams.email = this.value_input_correo;
                    const resp = await API.addusuario({
                        nombre: this.value_input_nombre,
                        correo: this.value_input_correo,
                        contrasena: this.templateParams.password,
                        actividad: this.value_select_actividad,
                        contPanico: 0,
                        numContacto: "",
                        imagenperfil: 'https://i.ibb.co/njJnx6r/descarga-2.png',
                        eschofer: false,
                        vehiculo: {
                            imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwHlhoxU2ERArjXgYYvWny0dipAccxEkimRnAkBBOJhMEAU2MAa9UdceQs4Uso_SAzlc&usqp=CAU',
                            patente: this.value_input_patente,
                            marca: this.selectedBrand,
                            modelo: this.selectedModel
                        }
                    }).then((resp) => {
                        console.log(resp)
                        if (resp.code == "11000") {
                            this.openNotificationSuccess("Este usuario ya se encuentra registrado");
                        } else {
                            this.openNotificationSuccess("Usuario registrado");
                            this.sendEmail();
                        }
                    })
                        .catch((error) => {

                        })
                    loading.close()
                }
            } else {
                this.openNotificationError('Datos no válidos.');
            }

        },
        async ingresarVehiculo() {
            var validado = false
            var erPatenteChilena = /^[A-Z]{2}\d{4}$/;
            /*Validamos los campos del vehiculo*/
            if (this.validaciones(this.value_input_patente, "Patente") &&
                this.validaciones(this.selectedBrand, "Marca") &&
                this.validaciones(this.selectedModel, "Modelo") && erPatenteChilena.test(this.value_input_patente)) {
                validado = true
            } else if (this.selectedBrand == "Otro") {
                if (this.otro_marca != "" && this.otro_modelo != "" && this.value_input_patente != "") {
                    validado = true
                }
            } else {
                this.openNotificationError('Datos no válidos.');
                validado = false
            }
            if (validado) {
                const loading = this.$vs.loading({
                    type: 'default'
                })
                /**Generamos la contraseña provisoria para el usuario, una variable para el template y otra para la bd */
                this.templateParams.password = this.generatePassword();
                this.templateParams.email = this.value_input_correo;

                var marcaAsignar = ""
                var modeloAsignar = ""
                if (this.selectedBrand == "Otro") {
                    marcaAsignar = this.otro_marca
                    modeloAsignar = this.otro_modelo
                } else {
                    marcaAsignar = this.selectedBrand
                    modeloAsignar = this.selectedModel
                }
                await API.addusuario({
                    nombre: this.value_input_nombre,
                    correo: this.value_input_correo,
                    contrasena: this.templateParams.password,
                    actividad: this.value_select_actividad,
                    imagenperfil: 'https://i.ibb.co/njJnx6r/descarga-2.png',
                    eschofer: true,
                    contPanico: 0,
                    numContacto: "",
                    vehiculo: {
                        imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwHlhoxU2ERArjXgYYvWny0dipAccxEkimRnAkBBOJhMEAU2MAa9UdceQs4Uso_SAzlc&usqp=CAU',
                        patente: this.value_input_patente,
                        marca: marcaAsignar,
                        modelo: modeloAsignar
                    }
                })
    
                //Si se logra registrar le enviaremos el coreo con la contraseña provisoria
                this.sendEmail();
                loading.close()
                this.selectedBrand = ""
                this.selectedModel = ""
                this.value_input_patente = ""
                this.otro_marca = ""
                this.otro_modelo = ""
                this.openNotificationSuccess("Usuario registrado con los datos de su Vehiculo");
            }
        },

        validaciones(campo, nombre) {
            if (this.validarVacios(campo, nombre)) {
                /*Si no estamos validando el correo estamos listos*/
                if (nombre != "Correo") {
                    return true;
                }
                /*Validamos el correo */
                if (this.validarCorreo(campo)) {
                    return true;
                } else {
                    return false;
                }
            } else {
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
        validarCorreo(correo) {
            if (/^[A-Za-z0-9._%+-]+@(alumnos.)?utalca.cl$/.test(correo)) {
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
        },
        openNotificationSuccess(title) {
            const noti = this.$vs.notification({
                position: 'bottom-center',
                title,
                duration: '1500',
                color: 'success',

            })
        },
        sendEmail(e) {
            //Cambiamos la contraseña de template a un random:
            try {
                emailjs.send('service_9h0bikp', 'template_dkpyodj', this.templateParams,
                    '26whel6ksQOM5bUsg');

            } catch (error) {
                console.log({ error })
            }
        },
        generatePassword() {
            var length = 8,
                charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                retVal = "";
            for (var i = 0, n = charset.length; i < length; ++i) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
            }
            //Agregamos carpoolutalca a la contra
            retVal += 'carpoolutalca'
            return retVal;
        }
    }
};
</script>

<style>
.contenedor .titulo.pagina {
    background-color: #f79034;
    width: 30vh;
    height: 10px;
    margin: auto;
    text-align: center;
    font-size: larger;
    margin-top: 10px;
    margin-bottom: 10px;
}

.formulario {
    color: white;
    background-color: #36568c;
    margin: auto;
    width: 50vh;
    border-radius: 7%;
}

.tituloformulario {
    text-align: center;
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

.btnvolver {
    display: flex;
    margin-top: 30px;
    margin-left: 10px;
}

.vs-notification-parent {
    text-align: center;
}
</style>
