<template>
    <div>
        <div>
            <h1 style=" text-align: center; color: #36568c;">Viajes Frecuentes</h1>
            <div v-for="(item, index) in viajes" :key="index + item._id">
                <div>
                    <CardViajeFrecuente :viaje-seleccionado="item" @viajecreado="creado" />
                </div>
            </div>
            <div class="vacio" v-if="viajes.length == 0">
                <div class="vacio-content">
                    <img src="https://i.ibb.co/qmsNTvn/logo.png" alt="">
                    <p>No se encuentran viajes disponibles intentelo más tarde</p>
                </div>

            </div>

        </div>

    </div>
</template>
<script>
import API from '@/api';
import CardViajeFrecuente from './CardViajeFrecuente.vue';
export default {
    data() {
        return {
            viajes: []
        };
    },
    props: {

    },
    mounted() {
        this.getusuario()

    },
    methods: {
        async getusuario() {

            const loading = this.$vs.loading({
                type: 'default'
            })

            var usuario = await API.getuserbyid(JSON.parse(localStorage.getItem("carpooltoken"))._id)

            var usuariofrecuente =  await usuario.viajes.filter(u => u.esfrecuente == true)
            this.viajes = usuariofrecuente
            
            loading.close()

            /*    .then((usuario) => {

                   usuario.viajes.forEach(element => {
                       if (element.esfrecuente) this.viajes.push(element)
                   });
                   console.log(this.viajes)
               })
               .catch((error) => {
                   console.log(error)
               }) */
        },
        creado() {
            this.$emit("viajecreado")
        }

    }, components: {
        CardViajeFrecuente
    }
}
</script>

<style scoped>
.vacio {
    width: 100vw;
    min-width: calc(100vw - 50px);
}

.vacio-content {

    width: 100%;
    min-width: calc(100vw - 50px);
    text-align: center;

}

.vacio-content img {
    width: 100%;
}
</style>