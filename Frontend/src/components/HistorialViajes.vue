<template>
    <div>
        <loading v-if="isLoading"></loading>
        
        <div class="cajita">
            <h1 style="margin: 0; text-align: center; color: #36568c;">Historial</h1>
            <div style="text-align: center;justify-content: center;display: flex;">
                <vs-button :active="active8 == 5" flat @click="getViajes">
                    <span>
                        Todos
                    </span>
                </vs-button>
                <vs-button :active="active8 == 0" color="#7d33ff" flat @click="obteneractivos(); active8 = 0">
                    <span>
                        Activos
                    </span>
                </vs-button>
                <vs-button color="#F3C541" :active="active8 == 1" @click="obtenerencurso(); active8 = 1 "
                    :flat="clickedCurso == false">
                    <span>
                        En curso
                    </span>
                </vs-button>
                <vs-button shadow :active="active8 == 2" @click="obtenerfinalizados(); active8 = 2 ">
                    <span>
                        Finalizados
                    </span>
                </vs-button>
            </div>

            <div v-for="viaje in viajesMostrar">
                <CardHistorial :viaje="viaje" />
            </div>

        </div>
    </div>
</template>

<script>
import API from '@/api';
import loading from './loading.vue';
import CardHistorial from './CardHistorial.vue';
export default {
    name: 'G2ProyTaller12023HistorialViajes',

    data() {
        return {
            id: "",
            viajesTotal: [],
            viajesMostrar: [],
            chofer: "",
            /**Variable para vuesax */
            value: 0,
            value2: '',
            /*5 por pagina*/
            hidden: [true, true, true, true, true],
            page: 1,
            page2: 1,
            active5: 1,
            active8: 5,
            /**0 -> Todos los viajes
             * 1 -> Activos
             * 2 -> Finalizados
             */
            mostrarviajes: 0,
            clickedAct: false,
            clickedCurso: false,
            clickedFin: false,
            clickedFechas: false,
            isLoading: false,
        };
    },
    components: {
        loading,
        CardHistorial
    },
    mounted() {
        this.getViajes()
        this.usuario()
        this.ordenarPorFechaDesc()
    },
    methods: {
        usuario() {
            const token = JSON.parse(localStorage.getItem("carpooltoken"))
            // Obtener datos
            this.id = token._id

        },
        datosChofer(id) {
            this.buscarChoferPorId(id);
            return this.chofer
        },
        async buscarChoferPorId(id) {
            var chofer = await API.getuserbyid(id);
            this.chofer = chofer.nombre

        },
        async getViajes() {
            this.isLoading = true
            this.active8 = 5
            const user = JSON.parse(localStorage.getItem('carpooltoken'));
            // Obtener los viajes del usuario(si es chofer o pasajero)
            var viajestotal;
            var allviajes = await API.getallviajes();
            var viajeschofer = await allviajes.filter(v => v.choferid == user._id)
            viajestotal = viajeschofer
            var viajepasajero = await allviajes.filter(v => v.pasajeros.includes(user._id))
            await viajepasajero.forEach(element => {
                viajestotal.push(element)
            });

            

            // Consultar los nombres del chofer y de los pasajeros por cada viaje que ha encontrado
            await viajestotal.forEach(element => {
                element.nombrespasajeros = []
                API.getuserbyid(element.choferid).then(res => {
                    element.nombrechofer = res.nombre
                })
                element.pasajeros.forEach(idpasajero => {
                    API.getuserbyid(idpasajero).then(resp => {
                        element.nombrespasajeros.push(resp.nombre)
                    });
                });
            });

            this.viajesTotal = viajestotal;
            
            this.viajesMostrar = this.viajesTotal;
            this.viajesMostrar.reverse()
            this.isLoading = false
        },
        recortararrayviajes(pagina) {
            if (this.clickedAct == false && this.clickedFin == false) {
                var viajescortados = this.viajes.slice(pagina, pagina + 5)
                return viajescortados
            } else if (this.clickedAct == true) {
                return this.obteneractivos().slice(pagina, pagina + 5)
            } else if (this.clickedFin == true) {
                return this.obtenerfin().slice(pagina, pagina + 5)
            }

        },
        obteneractivos() {
            var viajesactivos = []
            for (var i = 0; i < this.viajesTotal.length; i++) {
                if (this.viajesTotal[i].estado == "Activo") {
                    viajesactivos.push(this.viajesTotal[i])
                }
            }
            this.viajesMostrar = viajesactivos;
        },
        obtenerencurso() {
            var viajesactivos = []
            for (var i = 0; i < this.viajesTotal.length; i++) {
                if (this.viajesTotal[i].estado == "En curso") {
                    viajesactivos.push(this.viajesTotal[i])
                }
            }
            this.viajesMostrar = viajesactivos;
        },
        obtenerfinalizados() {
            var viajesfin = [];
            for (let i = 0; i < this.viajesTotal.length; i++) {
                if (this.viajesTotal[i].estado == "Finalizado") {
                    viajesfin.push(this.viajesTotal[i])
                }
            }
            this.viajesMostrar = viajesfin
        },
        botonesEstado(n) {
            if (n == 1) {

                if (this.mostrarviajes != 1) {
                    this.mostrarviajes = 1;

                }
                else { this.mostrarviajes = 0; }
            } else if (n == 2) {
                if (this.mostrarviajes != 2) {
                    this.mostrarviajes = 2;

                }
                else { this.mostrarviajes = 0; }
            }


        },
        ordenarPorFechaDesc() {
            var sortedProducts = this.viajesMostrar.sort((p1, p2) => (p1.fecha < p2.fecha) ? 1 : (p1.fecha > p2.fecha) ? -1 : 0);
            this.viajesMostrar = sortedProducts;
        },
        ordenarPorFechaAsc() {
            if (this.clickedFechas == false) {
                var sortedProducts = this.viajesMostrar.sort((p1, p2) => (p1.fecha > p2.fecha) ? 1 : (p1.fecha < p2.fecha) ? -1 : 0);
                this.viajesMostrar = sortedProducts;
            } else {
                this.ordenarPorFechaDesc()
            }

        },
        salaEspera(idviaje) {
            this.$store.state.historialviajeseleccionado = idviaje
            this.$router.push({ path: '/subida' })
        },
        revisarBotones() {
            if (!this.clickedAct && !this.clickedCurso && !this.clickedFin) {
                this.viajesMostrar = this.viajesTotal
            }
        }
    },
    watch: {
        clickedAct: function () {
            this.revisarBotones();
        },
        clickedCurso: function () {
            this.revisarBotones();
        },
        clickedFin: function () {
            this.revisarBotones();
        },
    }
}

</script>

<style scoped>
.cajita {
    position: absolute;
    top: 2%;
    height: 100%;
    width: 100%;
}

.contenedorAlertas {
    height: 100vh;
}

.contenedorAlertas .titulo {
    margin: auto;

}

.contenedorAlertas .alertasactivos {
    color: #7d33ff;
    background-color: #e2d1ff;
}

.alertasactivos {
    color: #7d33ff;
    background-color: #e2d1ff;
}

.alertasencurso {
    color: #F79034;
    background-color: #F0E3BC;
}

.material-icons-outlined {
    font-size: auto;
    text-align: center;
}

.historial {
    display: flex;
    width: 95vw;
    height: auto;
}
</style>