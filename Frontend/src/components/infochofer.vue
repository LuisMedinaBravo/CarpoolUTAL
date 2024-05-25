<template>
    <div class="contenedorinfochofer">

        <div class="barrasup">
            <div class="cerrar">|

                <vs-button class="botoncerrar" @click="handleClose">
                    <span class="material-icons-outlined">
                        close
                    </span>

                </vs-button>
            </div>
            <div class="titulo">
                <p style="color:white;font-size: larger;">
                    INFORMACIÓN CHOFER
                </p>
            </div>

        </div>
        <div class="cardcontenedor">
            <vs-card type="2" class="card">
                <template #title>
                    <h3>Usuario nombre</h3>
                </template>
                <template #img>
                    <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                        alt="">
                </template>
                <template #text>
                    <p>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    </p>
                </template>

            </vs-card>

        </div>
        <div class="contenedorestrellas">
            <div id="puntuacion"> {{ "Valoración: " + this.valoraciontotal + "/" + 5 }}</div>

            <div v-for="(i, index) in Math.floor(valoraciontotal)" :key="'estrella-' + index">
                <span class="material-icons-outlined" id="estrella">
                    star
                </span>
            </div>
            <div v-for="(i, index) in  mediasestrellas" :key="'mediasestrellas-' + index">
                <span class="material-icons-outlined" id="estrella">
                    star_half
                </span>
            </div>
            <div v-for="(i, index) in  noestrellas" :key="'noestrella-' + index">
                <span class="material-icons-outlined" id="estrella2">
                    star
                </span>
            </div>





        </div>
        <div class="titulocomentarios">
            <h1 style="color:white">COMENTARIOS</h1>
        </div>
        <div class="comentarios-container">

            <div class="comentarios">
                <div v-for="(comentario, index) in comentarios" :key="index + 'comentario'" class="comentario">
                    <div class="comentario-header">
                        <vs-avatar circle>
                            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
                                alt="">
                        </vs-avatar>
                        <span class="usuario">{{ comentario.usuario }}</span>
                        <div v-for="(i, index) in comentario.valoracion" :key="'estrella-' + index">
                            <span class="material-icons-outlined" id="estrella">
                                star
                            </span>
                        </div>
                    </div>
                    <div class="comentario-body">{{ comentario.texto }}</div>
                </div>
            </div>

        </div>


    </div>
    
</template>


<script>
export default {

    data() {
        return {
            active: true,
            valoraciontotal:0,
            mediasestrellas: 0,
            
            noestrellas: 0,
            comentarios: [
                {
                    id: 1,
                    usuario: "Juanx",
                    fecha: "2022-05-01",
                    texto: "¡Este es un gran artículo!",
                    valoracion: 4
                },
                {
                    id: 2,
                    usuario: "Ana",
                    fecha: "2022-05-02",
                    texto: "¡Gracias por compartir esto!",
                    valoracion: 5
                },
                {
                    id: 3,
                    usuario: "Pedro",
                    fecha: "2022-05-03",
                    texto: "¡Excelente información!",
                    valoracion: 3
                }, {
                    id: 3,
                    usuario: "Pedro",
                    fecha: "2022-05-03",
                    texto: "¡Excelente información!",
                    valoracion: 2
                }, {
                    id: 3,
                    usuario: "Pedro",
                    fecha: "2022-05-03",
                    texto: "¡Excelente informaciónx!",
                    valoracion: 5
                }, {
                    id: 3,
                    usuario: "Pedro",
                    fecha: "2022-05-03",
                    texto: "¡Excelente información!",
                    valoracion: 3
                }
            ],
            nuevoComentario: {
                usuario: "",
                texto: ""
            }
        }
    }, methods: {
        agregarComentario() {
            const id = this.comentarios.length + 1;
            const fecha = new Date().toISOString().substr(0, 10);
            const comentario = { id, fecha, ...this.nuevoComentario };
            this.comentarios.push(comentario);
            this.nuevoComentario = { usuario: "", texto: "" };
        },
        handleClose() {
            this.$store.state.opcion = 0
            /* this.$emit("infochofercerrado") */
        }
    }, mounted() {
      

       
        if (this.valoraciontotal - (Math.floor(this.valoraciontotal)) > 0) {
            this.mediasestrellas = 1
            this.noestrellas = 5 - (Math.floor(this.valoraciontotal)) - 1
        } else {
            this.mediasestrellas = 0
        }

    }
}
</script>


<style  scoped>
.contenedorinfochofer {
    display: inline-block;
    position: absolute;
    background-color: white;
    width: 100vw;
    height: 100vh;
}

.contenedorestrellas {
    display: flex;

    justify-content: center;
    align-items: center;
    width: 100%;
    height: 4%;
}

.comentarios-container {

    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 2rem;
    box-sizing: border-box;
}

.titulocomentarios {

    justify-content: center;
    display: flex;
    background-color: #574080;

}

.comentarios {
    width: 100%;
    max-height: 50vh;
    overflow-y: scroll;
    margin-bottom: 1rem;
}

.comentario {
    background-color: #AE80FF;
    border-radius: 5px;
    padding: 0.5rem;
    margin-bottom: 1rem;
}

#puntuacion {
    margin-left: 5%;
}

.comentario-header {
    display: flex;

    align-items: center;
    margin-bottom: 0.5rem;
}



.cardcontenedor {
    display: flex;
    justify-content: center;

    width: 100vw;
    height: 30vh;
}

.barrasup {
    background-color: #574080;
    width: 100%;
    height: 5%;
    display: flex;
    align-items: center;

}

.titulo {
    display: inline-block;
    width: 90%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.cerrar {
    display: inline-block;
    width: 10%;
    height: 100%;
    display: flex;
    align-items: center;

}

.botoncerrar {
    background-color: #574080;
    display: inline-block;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;


}

.material-icons-outlined {
    font-size: 2em;
}


.card {

    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
}

#estrella2 {
    margin: 50%;
    width: 100%;
    height: 100%;
}

#estrella {
    margin: 50%;
    width: 100%;
    height: 100%;

    color: yellow;

}</style>