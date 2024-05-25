<template>
    <div class="center">
       

        <vs-dialog width="550px" not-center v-model="$store.state.comentarioActico"  prevent-close>
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
                <span :style="{ color: estrellaColor0}" class="material-icons-outlined estrella" id="1" @mouseover="hola(1)" >
                    star
                </span>

                <span  :style="{ color:  estrellaColor1}" class="material-icons-outlined estrella" id="2" @mouseover="hola(2)" >
                    star
                </span>

                <span  :style="{ color:  estrellaColor2 }" class="material-icons-outlined estrella" id="3" @mouseover="hola(3)">
                    star
                </span>

                <span :style="{ color:  estrellaColor3 }"  class="material-icons-outlined estrella" id="4" @mouseover="hola(4)">
                    star
                </span>

                <span :style="{ color:  estrellaColor4}"  class="material-icons-outlined estrella" id="5" @mouseover="hola(5)">
                    star
                </span>

            </div>
            <div>
                
                <h4 class="not-margin">
                        Añade una comentario(OPCIONAL)
                </h4>
               
                <vs-input v-model="value" placeholder="ingresa un comentario aqui ..." @input="limitarcaracteres" />
                <p>{{ value.length }} / {{ maxCaracteres }}</p>
            </div>
               
            <template #footer>
                <div class="barrainfe">
                    <vs-button @click="comentarchofer"  style="margin: 0 auto;">
                        Agregar calificación
                    </vs-button>
                    <span class="material-icons-outlined info" @click="info">
                        info
                    </span>
                </div>
            </template>
        </vs-dialog>
    </div>
</template>
<script>
import API from '@/api'
import { NotiBusVista } from '../main.js';
export default {
    data: () => ({
        active: false,
        active2: false,
        active3: false,
        value: '',
        activarbotones: true,
        numeroestrellas: 0,
        maxCaracteres: 100,
        estrellaColor0:"gray",
        estrellaColor1:"gray",
        estrellaColor2:"gray",
        estrellaColor3:"gray",
        estrellaColor4:"gray",

    }),
    props: {
        notificacion: Object
    },
    methods: {
        actualizarEstrellas(valor) {
            this.numeroestrellas = valor
        }, limitarcaracteres() {
            if (this.value.length > this.maxCaracteres) {
                this.value = this.value.slice(0, this.maxCaracteres)
            }
        },
        menuestrellas() {

            this.active = !this.active
            this.active2 = !this.active2

        }, 
        async comentarchofer() {
            if (this.numeroestrellas > 0) {
                this.active = !this.active
                this.active3 = !this.active3
                const viaje_calificar = await API.getviajebyid(this.notificacion.idviaje )
                
                const data_calificacion ={
                    nota: this.numeroestrellas,
                    calificador: JSON.parse(localStorage.getItem("carpooltoken"))._id,
                    calificado: viaje_calificar.choferid,
                    comentario: this.value,
                    visto: false,
                }
                await API.addCalificacion(data_calificacion)
                const data_notificacion = {
                    notificacionId: this.notificacion._id,
                    tipo: "Viaje finalizado calificado",
                }
                await API.updateTipo(data_notificacion)
                NotiBusVista.$emit('actualizarNotificacion');
                this.$store.state.comentarioActico = false
            } else {

                this.openNotification("Necesitas calificar", 2000, "", "danger", "top-right")
            }

        },estrellaslistener() {

            const estrellas = []
           
            for (var i = 1; i <= 5; i++) {
                const estrella = document.getElementById(i);
                
                estrellas.push(estrella)
                
                console.log(estrella)

                estrella.addEventListener("mouseover", (event) => {
                    
                    const estrellaseleccionada = event.target.id- 1 
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
        openNotification(titulo, duration, text, color, position) {
            // Envia una notificacion (es de vuesax)
            this.$vs.notification({
                position,
                color: color,
                duration: duration,
                title: titulo,
                text: text
            })
        },info(){
            this.active2 =! this.active2
        },hola(id){
            console.log("mouseover"+id)
            const estrellaseleccionada = id-1
            this.actualizarEstrellas(id)
             this.numeroestrellas = id
            
           for (let index = 0; index < 5; index++) {
                const propName = "estrellaColor" + index;
                this[propName] = "gray"
                if (index <= estrellaseleccionada) {
                    
                    
                    this[propName] =  "orange"
                }
           }
           
            
            
        }
    }, mounted() {
        
        
    }

}
</script>

<style>
.vs-input {
    width: 100%;
}
.contenedorestrellas{
    
    display: flex; 
    justify-content: center;

}
.estrella {
  font-size: 50px; /* Ajusta el tamaño de fuente según tus necesidades */
  
}
.barrainfe{
    display: flex; 
    justify-content: space-between; 
    align-items: center;
}
.info{
    color: #000;
}

</style>