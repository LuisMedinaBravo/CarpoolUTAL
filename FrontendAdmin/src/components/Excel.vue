<template>
    <div>
        <vs-alert gradient success class="titulo pagina">
            Añadir usuarios desde Excel
        </vs-alert>
        <div class="caja">
            <div @dragover.prevent @drop="onDrop" class="dropzone" v-if="tableData.length == 0">
                <p style="margin:auto">Arrastra y suelta tu archivo Excel aquí</p>
            </div>
            <div>
                <div class="center" v-if="tableData.length == 0">
                    <vs-button style="background-color: #f79034;" block @click="downloadTemplate">
                        Descargar plantilla
                    </vs-button>
                </div>
            </div>
            <div v-if="tableData.length !== 0">
                <vs-table style="margin: 50px;" :data="tableData">
                    <template slot="thead">
                        <vs-th v-for="(column, index) in columns" :key="index">
                            {{ column }}
                        </vs-th>
                    </template>

                    <template slot="tbody">
                        <vs-tr v-for="(row, i) in $vs.getPage(tableData, page, max)" :key="i">
                            <vs-td v-for="(value, key) in row" :key="key">
                                {{ value }}
                            </vs-td>
                        </vs-tr>
                    </template>

                    <template #footer>
                        <vs-pagination v-model="page" :length="$vs.getLength(tableData, max)" />
                    </template>
                </vs-table>
                <div class="center">
                    <vs-button style="background-color: #f79034;" block @click="mostrarDialogo">
                        Agregar usuarios
                    </vs-button>
                </div>
            </div>
        </div>
        <vs-dialog v-model="showDialog">
            <div class="dialog-content">
                <h3>¿Estas seguro que quieres agregar <strong>{{ tableData.length }}</strong> usuarios?</h3>
                <p>Recuerda que una vez que inicie el proceso, no existirá la posibilidad de cancelarlo.</p>
            </div>
            <div class="dialog-footer">
                <vs-button success transparent @click="agregarUsuarios">Aceptar</vs-button>
                <vs-button dark transparent @click="showDialog = false">Rechazar</vs-button>
            </div>
        </vs-dialog>

        <vs-dialog v-model="errorDialog">
            <div class="dialog-content">
                <h3>No se puedo agregar <strong>{{ contError }} usuarios</strong></h3>
            </div>
            <div class="dialog-footer">
                <vs-button success transparent @click="errorDialog=false">Aceptar</vs-button>
            </div>
        </vs-dialog>
    </div>
</template>
<script>
import * as XLSX from 'xlsx'
import API from '../api';
import emailjs from 'emailjs-com';
export default {
    data() {
        return {
            showDialog: null,
            page: 1,
            max: 5,
            columns: [],
            tableData: [],
            templateParams: {
                email: 'jreveco19@alumnos.utalca.cl',
                password: ''
            },
            errorDialog:null,
            contError:0,
        }
    },
    methods: {
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
        },
        sendEmail() {
            //Cambiamos la contraseña de template a un random:
            console.log("Enviando correo", this.templateParams)
            try {
                emailjs.send('service_9h0bikp', 'template_dkpyodj', this.templateParams,
                    '26whel6ksQOM5bUsg');

            } catch (error) {
                console.log({ error })
            }
        },
        downloadTemplate() {
            const templateURL = 'https://cdn.discordapp.com/attachments/1087108804199579748/1113903645658992700/plantilla_6.xlsx';
            const link = document.createElement('a');
            link.href = templateURL;
            link.download = 'plantilla-usuarios.xlsx';
            link.target = '_blank';
            link.click();
        },
        onDrop(e) {
            e.preventDefault()

            const file = e.dataTransfer.files[0]
            const reader = new FileReader()

            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result)
                const workbook = XLSX.read(data, { type: 'array' })

                const worksheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

                this.columns = jsonData[0]
                this.tableData = jsonData.slice(1).map(row => {
                    let rowData = {}
                    row.forEach((cell, index) => {
                        rowData[this.columns[index]] = cell
                    })
                    return rowData
                })
            }
            reader.readAsArrayBuffer(file)
        },
        mostrarDialogo() {
            this.showDialog = true
        },
        async agregarUsuarios() {
            const loading = this.$vs.loading({
                type: 'default'
            })
            var error=false
            for (var i = 0; i < this.tableData.length; i++) {

                console.log("TOTOOTOTOTO",i)
                console.log("WUAA",this.tableData[i])
                this.templateParams.password = this.generatePassword();
                this.templateParams.email = this.tableData[i].Correo;
                if (this.tableData[i].Conductor == "si") {
                    const resp = await API.addusuario({
                        nombre: this.tableData[i].Nombre,
                        correo: this.tableData[i].Correo,
                        contrasena: this.templateParams.password,
                        actividad: this.tableData[i].Actividad,
                        imagenperfil: 'https://i.ibb.co/njJnx6r/descarga-2.png',
                        eschofer: true,
                        contPanico:0,
                        numContacto: this.tableData[i].Contacto,
                        vehiculo: {
                            imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwHlhoxU2ERArjXgYYvWny0dipAccxEkimRnAkBBOJhMEAU2MAa9UdceQs4Uso_SAzlc&usqp=CAU',
                            patente: this.tableData[i].Patente,
                            marca: this.tableData[i].Marca,
                            modelo: this.tableData[i].Modelo
                        }
                    })
                    //Si se logra registrar le enviaremos el coreo con la contraseña provisoria
                    this.sendEmail();
                } else if(this.tableData[i].Conductor == "no"){
                    const resp = await API.addusuario({
                        nombre: this.tableData[i].Nombre,
                        correo: this.tableData[i].Correo,
                        contrasena: this.templateParams.password,
                        actividad: this.tableData[i].Actividad,
                        imagenperfil: 'https://i.ibb.co/njJnx6r/descarga-2.png',
                        eschofer: false,
                        contPanico:0,
                        numContacto: this.tableData[i].Contacto,
                        vehiculo: {
                            imagen: "",
                            patente: "",
                            marca: "",
                            modelo: ""
                        }
                    })
                    //Si se logra registrar le enviaremos el coreo con la contraseña provisoria
                    this.sendEmail();
                }else{
                    this.contError=this.contError+1
                    error= true
                }
            }
            if(error){
                this.errorDialog=true
            }
            this.showDialog = false
            loading.close()
        }
    }
}
</script>
<style scoped>
.caja {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    flex-direction: column;
}

.titulo.pagina {
    background-color: #f79034;
    width: 30vh;
    height: 10px;
    margin: auto;
    text-align: center;
    font-size: larger;
    margin-top: 10px;
    margin-bottom: 10px;
}

.dropzone {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 300px;
    border: 2px dashed #f79034;
    margin: 20px;
}

.dialog-content {
    padding: 20px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    padding: 20px;
}
</style>