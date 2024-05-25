<template>
    <div class="contenedor">

        <div class="barra">
            <vs-navbar square v-model="menu">

                <vs-navbar-item :active="menu == 'perfil'" id="perfil">
                    <span class="material-icons-outlined">
                        account_circle
                    </span>
                </vs-navbar-item>
                <vs-navbar-item :active="menu == 'viajar'" id="viajar">
                    <span class="material-icons-outlined">
                        directions_car_filled
                    </span>
                </vs-navbar-item>

                <div v-if="this.eschofer">
                    <vs-navbar-item :active="menu == 'crear'" id="crear">
                        <span class="material-icons-outlined">
                            add_circle
                        </span>
                    </vs-navbar-item>
                </div>
                <div v-if="this.eschofer">
                    <vs-navbar-item :active="menu == 'misviajes'" id="misviajes">
                        <span class="material-icons-outlined">
                            format_list_bulleted
                        </span>
                    </vs-navbar-item>
                </div>

                <vs-navbar-item :active="menu == 'emergencia'" id="emergencia">
                    <span class="material-icons-outlined">
                        warning
                    </span>

                </vs-navbar-item>
                <vs-navbar-item @click="cerrarSesion" to="/" :active="menu == 'salir'" id="salir">
                    <span class="material-icons-outlined">
                        logout
                    </span>

                </vs-navbar-item>
            </vs-navbar>


        </div>
        
        <div v-if="menu=='viajar'">
            <ListaVehiculosMovil @mostrarviaje="cambiarviaje"/>

        </div>
        <div v-if="menu == 'misviajes'">
            <MisViajes />

        </div>
        <div v-if="menu=='elegirviaje'">
            
            <elegirviaje />
            <div class="button-container">
                <vs-button class="back-button" color="primary" @click="volverlista">
                    <span class="material-icons">arrow_back</span>
                   
                </vs-button>

                <vs-button class="forward-button"  color="primary" @click="mascerca ">
                    <span class="material-icons">arrow_forward</span>
                    
                </vs-button>
            </div>

        </div>
        <div v-if="menu=='elegirviaje'">
            
            <elegirviaje />
            <div class="button-container">
                <vs-button class="back-button" color="primary" @click="volverlista">
                    <span class="material-icons">arrow_back</span>
                   
                </vs-button>

                <vs-button class="forward-button"  color="primary" @click="mascerca ">
                    <span class="material-icons">arrow_forward</span>
                    
                </vs-button>
            </div>

        </div>
        <div v-if="menu=='perfil'">
            <PerfilUsuario/>
        </div>

    </div>
</template>

<script>
import CrearViaje from './CrearViaje.vue';
import ListaVehiculosMovil from './ListaVehiculosMovil.vue'
import elegirviaje from './Elegirviaje.vue'
export default {
    name: 'G2ProyTaller12023ClienteNavbar',

    data() {
        return {
            menu: "viajar",
            eschofer:false
        };
    },

    mounted() {
        this.usuario()
    },

    methods: {
        cerrarSesion() {
            localStorage.removeItem('carpooltoken');
        },
        usuario() {
            const token = JSON.parse(localStorage.getItem("carpooltoken"))
            this.eschofer = token.eschofer
            console.log(this.eschofer)
        },cambiarviaje(){
            this.menu="elegirviaje"
        },volverlista(){
            this.menu="viajar"
        }, distanciaCoord(lat1, lon1, lat2, lon2) {
            
            
            lat1= this.$store.state.origenseleccionado.lat
            lon1= this.$store.state.origenseleccionado.lng
            lat2= this.$store.state.destinoseleccionado.lat
            lon2= this.$store.state.destinoseleccionado.lng
            var radioTierra = 6371; // Radio de la tierra en kilómetros
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var distancia = radioTierra * c * 1000; // Distancia en metros
            return distancia
        },mascerca(){
            var umbralDistancia = 5;

/* 
            var estaCerca = false;
            for (var i = 0; i < this.$store.state.coordenadas.length; i++) {
                console.log( this.$store.state.coordenadas)
                var distancia = this.distanciaCoord(this.$store.state.posicionseleccionada.lat, this.$store.state.posicionseleccionada.lng, this.$store.state.coordenadas[i].lat, this.$store.state.coordenadas[i].lng);
                if (distancia <= umbralDistancia) {
                    estaCerca = true;
                    console.log("s")
                }
            } */
        }

    },
    components:{
    ListaVehiculosMovil,
    CrearViaje,
    elegirviaje
}
};
</script>

<style  scoped>
.contenedor {
    display: flex;
    width: 100%;
    height: 95vh;
}



.vs-button span {
    margin: 2px;
    display: flex;
    /* justify-content: start; */
}

.contenedor2 {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 70px;
    background: #36568C;
    /* background-color: #36568c27; */

}

.contenedor3 {
    display: flex;
    flex-direction: row;

    width: 100%;
    height: 100%;
}



.navagacion {
    display: flex;

    flex-direction: column;
    width: 150px;

    text-align: left;
}

span {
    color: #36568c;
}

.barra {
    position: fixed;
    bottom: 6%;
    width: 100%;
    z-index: 1000;
    border-top: 5px solid rgba(0, 0, 0, 0.1);

}

.child {
    color: white;
}

.contenedorMovil {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 95vh;

}
.button-container {
  position: absolute;
  top: 60px;
  left: 0;
  margin: 10px;
  display: flex;
  align-items: center;
}

.back-button, .forward-button {
  margin-right: 10px;
  height: 40px;
}

.back-button .material-icons, .forward-button .material-icons {
  font-size: 20px;
  margin-right: 5px;
  color: white;
}


</style>