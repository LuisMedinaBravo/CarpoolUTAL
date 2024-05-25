<template>
    <div class="contenedor">

            <div class="contenedorMap">
                <Map />
            </div>
    </div>
</template>

<script>

import Map from "./map.vue";


export default {
    name: "MapboxMap",
    data() {
        return {
            map: null,
            geocoder: null,
            marker1: null,
            marker2: null,
            mapboxGeocoder: null,
            routeLayer: null,
        };
    },
    //vuesax switch
    data: () => ({
        active1: true,
        active2: false,
        active3: false,
        active4: true,
        active5: true,
    }),
    mounted() {

    },
    methods:{
        cambioestado(active){
            this.$store.state.haciautalca=active
        }
    },

    components: { Map }
};
</script>
<style scoped>
.contenedorMap {
    display: flex;

    width: 100%;
    height: 100%;
}

.vs-switch {
    position: absolute;
    border: 1px solid #36568c;
    top: 9.5%;
    left: 3%;
    z-index: 5;
}


</style> 