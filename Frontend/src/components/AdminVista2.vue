<template>
    <div class="contadmin2">
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
                style="width: 50%; margin-left: 10px; margin-right: 10px; margin-top: 10px;" label="Asientos Disponibles"
                v-model="asientos">

                <vs-option v-for="(item, index) in 4" :key="index" :label="index + 1" :value="index + 1">
                    {{ index + 1 }}
                </vs-option>
            </vs-select>
        </div>

        <!-- <vs-input v-model="asientos" icon-after placeholder="Asientos disponibles" label="Asientos disponibles">
            <template #icon>
                <span class="material-icons-outlined">
                    airline_seat_recline_extra
                </span>
            </template>
        </vs-input> -->
        <br>
        <div style="display: flex;">
            <vs-input :state="'dark'" style="width: 50%; margin-left: 10px; margin-right: 10px;" type="date"
                :min="fechaActual" v-model="fecha" label="Fecha" />

            <vs-select :state="'dark'" :label="'dark'" filter
                style="width: 40%; margin-left: 10px; margin-right: 10px; margin-top: 10px;" label="Hora" v-model="hora">

                <vs-option v-for="(item, index) in horas" :key="index" :label="item" :value="item">
                    {{ item }}
                </vs-option>
            </vs-select>
        </div>


        <div style="display: flex; justify-content: center;">
            <vs-checkbox success v-model="option">
                Viaje frecuente
            </vs-checkbox>
        </div>


        <div style="display: flex; justify-content: center; margin-bottom: 20px;"
            v-if="this.$store.state.rutavalida == true">

            <vs-button circle @click="creaviaje">
                Crear Viaje
                <img style="width: 45px; height: 50px; margin-left: 10px;" :src="require('@/assets/rutawhite.png')"  alt="">
            </vs-button>
        
        </div>
    </div>
</template>

<script>
import API from '@/api';
import { viajeBus } from "../main.js";
export default {
    name: 'MapboxMap',
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
    methods: {
        async creaviaje() {
            this.comprobacion_bloqueado()
            this.isCreando = true
            if (this.fecha !== "" && this.hora !== "" && (this.NumeroPattern.test(this.precio) && this.precio >= 0)
                && (this.NumeroPattern.test(this.asientos) && this.asientos > 0 && this.asientos <= 5)) {
                const token = JSON.parse(localStorage.getItem("carpooltoken"))


                if (this.$store.state.haciautalca == false) {
                    this.origen = this.$store.state.marker1
                    this.destino = this.$store.state.marker2
                } else {

                    this.origen = this.$store.state.marker2
                    this.destino = this.$store.state.marker1
                }


                var resp = await API.addviaje(
                    {
                        "disponibles": parseInt(this.asientos),
                        "precio": parseInt(this.precio),
                        "origen": this.origen,
                        "destino": this.destino,
                        "choferid": token._id,
                        "haciautalca": this.$store.state.haciautalca,
                        "pasajeros": [],
                        "fecha": this.fecha,
                        "horainicio": this.hora,
                        "esfrecuente": this.option,
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
            this.isCreando = false
        },
        openNotification(titulo, duration, text, color, position) {
            // Envia una notificacion (es de vuesax)
            this.$vs.notification({
                color: color,
                duration: duration,
                title: titulo,
                text: text
            })
        }, DiaActual() {
            const hoy = new Date();
            const mes = hoy.getMonth() + 1;
            const dia = hoy.getDate();
            const year = hoy.getFullYear();
            this.fechaActual = `${year}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`;
            this.fecha = this.fechaActual


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
    }, mounted() {

        this.DiaActual()
    }
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
</style> 

