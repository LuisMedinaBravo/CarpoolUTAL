<template>
    <div class="comentario">
        <div class="nombre">
            <vs-avatar circle size="50">
                <img :src=comentario.calificador.imagenperfil
                    alt="">
            </vs-avatar>
            <h4>{{ comentario.calificador.nombre }}</h4>
        </div>
        <div class="star">
            <div v-for="i in comentario.nota">
                <span class="material-icons-outlined" id="estrella">
                    star
                </span>
            </div>
            <div v-for="i in 5-comentario.nota">
                <span class="material-icons-outlined" id="estrella">
                   grade
                </span>
            </div>
        </div>
        <p>
            {{ comentario.comentario }}
        </p>

    </div>
</template>

<script>
export default {
    name: 'G2ProyTaller12023CardComentario',

    data() {
        return {

        };
    },

    mounted() {

    },

    methods: {

    },
    props: {
        comentario: Object
    }
};
</script>

<style scoped>
.comentario {
    display: flex;
    flex-direction: column;
    border: 2px solid #36568c;
    background-color: white;
    margin-top: 10px;
    border-radius: 12px;
}

.comentario p {
    text-align: justify;
    text-justify: inter-word;
    margin: 3%;
}

.vs-avatar img {

    width: 100%;
    height: 100%;
}

.nombre {
    display: flex;
    margin: 3%;
    margin-bottom: 0;
    width: 100%;
}

.nombre h4 {
    position: relative;
    top: 12px;
    margin: 0;
    margin-left: 3%;
}

.star {
    display: flex;
    justify-content: center;

}

.star span {
    color: orange;
}
</style>