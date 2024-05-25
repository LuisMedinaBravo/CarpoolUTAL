
<template>
    <div class="contenedorInfo">
        <div class="perfil">
            <vs-avatar v-if="imagenperfil == null" circle size="100">
                <img src="" alt="no imagen">
            </vs-avatar>
            <vs-avatar v-else circle size="100">
                <img :src="imagenperfil" alt="no imagen">
            </vs-avatar>
            <div class="infoPerson">
                <h3>Información</h3>
                <p><b>Nombre:</b> {{ conductor.nombre }}</p>
                <p><b>Actividad:</b> {{ conductor.actividad }}</p>
            </div>
        </div>
        <div style="display: flex; justify-content: center; width: 100%;">
            <vs-button @click="active2 = !active2">
                Información del Vehiculo
            </vs-button>
        </div>
        <vs-dialog v-model="active2">
            <div class="perfil">
                <vs-avatar circle size="100">
                    <img :src="conductor.vehiculo.imagen" alt="">
                </vs-avatar>
                <div class="infoPerson">
                    <p><b>Patente:</b> {{ conductor.vehiculo.patente }}</p>
                    <p><b>Marca:</b> {{ conductor.vehiculo.marca }}</p>
                    <p><b>Modelo:</b> {{ conductor.vehiculo.modelo }}</p>
                </div>
            </div>
        </vs-dialog>

        <div class="calificacion">
            <p>{{ valoraciontotal.toFixed(1) }}</p>

            <div class="star">
                <div v-for="i in Math.floor(valoraciontotal)">
                    <span class="material-icons-outlined">
                        star
                    </span>
                </div>
                <div v-for="i in  mediasestrellas">
                    <span class="material-icons-outlined">
                        star_half
                    </span>
                </div>
                <div v-for="i in  noestrellas">
                    <span class="material-icons-outlined">
                        grade
                    </span>
                </div>
            </div>
        </div>
        <div>
            <h1 style="border-bottom: 2px solid #36568c; margin: 0;">Comentarios</h1>
            <div class="listaComentarios">
                <div v-if="comentarios!=null" v-for="item in comentarios">
                    <CardComentario :comentario="item" />
                </div>
            </div>


        </div>
    </div>
</template>
<script>
import CardComentario from '@/components/CardComentario.vue';
import API from '@/api';
export default {
    data: () => ({
        active: false,
        input1: "",
        input2: "",
        checkbox1: false,
        activecar: 0,
        active2: false,
        mediasestrellas: 0,
        noestrellas: 0,
    }),
    components: { CardComentario },
    methods: {
        mostrarVehiculo() {
            if (this.activecar == 0) {
                this.activecar = 1
            }
            else {
                this.activecar = 0
            }
        },
/*         async cargar_comentarios(){
            
            
            this.comentarios= await API.getcalificacionbychofer(this.conductor._id)
            
            this.comentarios.forEach(element => {
                this.valoraciontotal+=element.nota
            });
            this.valoraciontotal=this.valoraciontotal/this.comentarios.length
            
            
        } */
    },
    mounted() {
        
    },
    async beforeMount(){
        
        if (this.valoraciontotal - (Math.floor(this.valoraciontotal)) > 0) {
            this.mediasestrellas = 1
            
            this.noestrellas = 5 - (Math.floor(this.valoraciontotal)) - 1
        } else {
            this.mediasestrellas = 0
        }
    },
    props: {
        conductor: Object,
        comentarios:Array,
        valoraciontotal:Number,
        imagenperfil:String
    }
}
</script>

<style scoped>
.infoPerson {
    display: flex;
    flex-direction: column;
    margin-left: 5%;
}

.infoPerson p {
    margin: 0;
}

.infoPerson h3 {
    margin: 0;
}

.listaComentarios {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 57vh;
    border-radius: 12px; 
    /*border: 2px solid #36568c; */
}

.perfil {
    display: flex;
    justify-content: center;

}

.perfil .vs-avatar img {

    width: 100px;
    height: 100%;
}

.star {
    display: flex;
    justify-content: center;
}

.star span {

    color: orange;
}

.calificacion {
    display: flex;
    width: 100%;
    flex-direction: column;
    padding: 0;
    margin: 0;

}

.calificacion p {

    display: flex;
    justify-content: center;
    padding: 0;
    margin: 0;
    font-size: 20px;

}
</style>