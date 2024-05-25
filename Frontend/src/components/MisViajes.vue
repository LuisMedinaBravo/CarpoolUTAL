<template>
    <div class="cajaviajes">    
        <div class="lista">
            <div class="caja" v-for="(viaje, index) in viajes" :key="index">
                <vs-button>
                    <div class="info" >
                        <vs-button success >
                            <span class="material-icons-outlined">
                                code
                            </span>
                            
                            Codigo: </vs-button>
                            
                            <div >
                                
                                <p >Origen: {{viaje.origen.nombre}}</p>
                                <p>Destino: {{viaje.destino.nombre}}</p>
                                <p>Asientos disponibles : {{viaje.disponibles}}/4</p>
                                <p>Fecha: {{ viaje.fecha }}</p>
                                <p>Hora: {{ viaje.horainicio }}</p>
                                <p>Precio: {{ viaje.precio }}</p>

                            </div>
                            


                        
                        <div class="trash">

                            <div class="boton2">
                                <vs-button danger>
                                    <span class="material-icons-outlined">
                                        delete
                                    </span>
                                </vs-button>
                            </div>
                        </div>


                    </div>


                </vs-button>
            </div>
        </div>

    </div>
</template>

<script>
import API from '@/api';
export default {
    name: 'G2ProyTaller12023MisViajes',

    data: () => ({
        viajes:[],
        userid:null
    }),

    

    methods: {
        async getViajes() {
            const user = JSON.parse(localStorage.getItem('carpooltoken'));           
            var allviajes = await API.getallviajes();
            console.log("todos los viajes");
             console.log(this.viajes);
            var viajescambiados = allviajes.filter(v=>v.choferid==user._id)
            console.log(viajescambiados);
            this.viajes = viajescambiados;
            console.log("mis viajes");

            console.log(this.viajes);
        }

    },
    mounted() {
        
        this.getViajes()
        	
    },
};
</script>

<style  scoped>
.titulo {
    width: 100%;
    height: 50px;
    position: fixed;
    z-index: 10;
    background-color: #36568c;
    color: white;
}

.cajaviajes {
    display: flex;
    width: 100vw;
    height: 100%;
    flex-direction: column;
}

.lista {
    position: relative;
    top: 50px;
}

.trash {
    display: flex;
    justify-content: right;
    width: 100%;
    height: 100%;
}

.caja {
    display: flex;
    justify-content: center;
}

.info {
    display: flex;
    flex-direction: column;

    text-align: left;
    margin-left: 5%;
    width: 90vh;

}

.info p {
    margin: 1%;

    font-size: 1.2em;
}

.vs-button {
    width: 90%;
    height: 100%;
}

.boton2 {
    position: relative;
    width: 20%;
    bottom: 12px;

}

.boton2 .vs-button span {
    position: relative;
    right: 20%;
}
</style>