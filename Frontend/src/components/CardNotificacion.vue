<template>
    <div class="contenedor">
        <div v-if="haciautalca" class="despla">
            DESDE UTALCA
        </div>
        <div v-else class="despla2">
            HACIA UTALCA
        </div>
        <div class="info5">
            <div class="text">
                <p>Codigo: {{ id }}</p>
                <div v-if="emisor != 'vacio'">
                    <p>Solicitante: {{ nombreEmisor.nombre }}</p>
                </div>


                <p v-if="haciautalca">Destino: {{ destino }}</p>
                <p v-else>Origen: {{ origen }}</p>
                <div style="display: flex; justify-content: center;">
                    <div class="mini">

                        <span style="display: flex; position: relative; top: 10px; right: 10px;"
                            class="material-icons-outlined">
                            calendar_month
                        </span>
                        <div class="fecha">
                            <p>{{ fecha }}</p>
                            <p>{{ horainicio }}</p>
                        </div>
                    </div>
                </div>


            </div>

        </div>


    </div>
</template>

<script>
import API from '@/api';
export default {
    name: "G2ProyTaller12023ChatView",
    data() {
        return {
            activeinfo: false,
            conductorInfo: null,
            nombreEmisor: '',
        };
    },
    mounted() {
        this.getConductorNombre()

    },
    methods: {
        async getConductorNombre() {
            console.log(this.emisor);
            if (this.emisor != 'vacio') {
                this.nombreEmisor = await API.getuserbyid(this.emisor)
            }


        }
    },
    props: {
        viajeSeleccionado: Object,
        emisor: String,
        haciautalca: {
            type: Boolean,
            default: true,
        },
        id:String,
        destino:String,
        origen:String,
        fecha:String,
        horainicio:String
    },
};
</script>

<style scoped>
.info5 {
    display: flex;
    flex-direction: column;
    height: auto;
    background: #36568c;
    margin-left: 3%;
    margin-right: 3%;
    margin-bottom: 3%;
    margin-top: 0;
    padding: 3%;

    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border-top-right-radius: 12px;
}

h4 {
    margin: 0;
    font-size: 14px;
}

.despla {
    display: flex;
    position: relative;
    background-color: #6E809F;
    color: white;
    margin-left: 3%;
    margin-top: 3%;
    width: 34%;
    padding-left: 5%;
    padding-right: 5%;
    padding-top: 2%;
    padding-bottom: 2%;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    border-bottom: 1px solid white;
    font-size: 14px;
}

.despla2 {
    display: flex;
    position: relative;
    background-color: #f79034;
    color: white;
    margin-left: 3%;
    margin-top: 3%;
    width: 34%;
    padding-left: 5%;
    padding-right: 5%;
    padding-top: 2%;
    padding-bottom: 2%;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    border-bottom: 1px solid white;
    font-size: 14px;
}

.text {
    padding: 5%;
    display: flex;
    flex-direction: column;
    color: white;
}

.text p {
    margin: 0;
}

.botones {
    display: flex;
    height: 58px;
    justify-content: center;
    margin-bottom: 4%;
}

.fecha {
    position: relative;
    display: flex;
    flex-direction: column;
    color: white;
    text-align: center;
    top: 12%;
}

.fecha p {
    margin: 0;
}

.mini {
    display: flex;
}

.mini2 {
    display: flex;
}

p {
    font-size: 12px;
}
</style>