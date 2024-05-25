<template>
    <div class="viaje">
        <div>
            <div id="botoneseinfo">


                <div class="iniciar_menu">
                    <vs-button :class="mostrar_BtnInfoChofer" color="#377BA3" id="boton-info" circle>
                        <span class="material-icons-outlined">
                            face
                        </span>
                    </vs-button>


                    <vs-button id="boton-iniciar" :class="estilo_btnUnirse">
                        {{ this.texto_btn }}
                    </vs-button>

                    <div class="botonmenu" :class="mostrar_menu" @click="activeMenu = !activeMenu;">
                        <vs-button circle shadow style="width: 50px; height: 50px;">
                            <span class="material-icons-outlined" v-if=" activeMenu ">
                                remove
                            </span>
                            <span class="material-icons-outlined" v-else>
                                add
                            </span>
                        </vs-button>
                    </div>

                </div>

            </div>

            <div class="menuinicio">
                <div class="contenedor">

                    <div class="acordion" :class=" { 'active': activeMenu == true } ">

                        <vs-button color="#377BA3" circle style="width: 50px; height: 50px; ">
                            <span class="material-icons-outlined">
                                face
                            </span>
                        </vs-button>
                        <vs-button :class="boton_panicoygrabar" circle danger style="width: 50px; height: 50px; margin-top: 20px;">
                            <span class="material-icons-outlined">
                                emergency_share
                            </span>
                        </vs-button>


                        <vs-button :class="boton_panicoygrabar" circle style="width: 50px; height: 50px; margin-top: 20px;" v-if=" showStartButton ">
                            <span class="material-icons-outlined">
                                mic
                            </span>

                        </vs-button>

            
                            <vs-button :class="boton_chat" circle dark
                                style="width: 50px; height: 50px; margin-top: 20px; margin-bottom: 20px;">
                                <span class="material-icons-outlined">
                                    chat_bubble
                                </span>
                            </vs-button>


                    </div>


                </div>
            </div>
            <div id="map" ref="map"></div>
        </div>
    </div>
</template>
<script>
import mapboxgl from "!mapbox-gl";
import MenuInicioViaje from './MenuInicioViaje.vue';
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxClient from "@mapbox/mapbox-sdk";
import MapboxDirections from "@mapbox/mapbox-sdk/services/directions";
import Vue from 'vue'
import Vuesax from 'vuesax'

Vue.use(Vuesax)
export default {
    name: "MapboxMap",
    data() {
        return {
            activeinfo: false,
            conductorInfo: null,
            value2: '',
            map: null,
            geocoder: null,
            marker1: null,
            marker2: null,
            marker3: null,
            mapboxGeocoder: null,
            routeLayer: null,
            coordinates: null,
            routeGeoJSON: null,
            zoom: 0,
            origen: this.$store.state.origenseleccionado,
            destino: this.$store.state.destinoseleccionado,
            puntosdeparada: [],
            mostrar: false,
            chat: this.$store.state.activarchat,
            eschoferdelviaje: false,
            infochofer: false,
            active: 0,
            active2: 0,
            isChoferViaje: null,
            viajeSeleccionado: null,
            isLoading: null,
            conectadosroom: [],
            activeMenu: false,
            showStartButton: true,
            showStopButton: false,
        };
    },


    async mounted() {

        mapboxgl.accessToken =
            "pk.eyJ1IjoidGhlcm9kcm9nbyIsImEiOiJjbDIxOWFueHUweWk0M2NvNjV3M2I0ZWcwIn0.-HRLRZ2Adj0LExGfnJiajQ";
        await this.initializeMap();
        this.activar_menu_automatico();

    },

    methods: {

        createMarkerElement(iconUrl) {
            const markerElement = document.createElement("div");
            markerElement.style.backgroundImage = `url(${iconUrl})`;
            markerElement.style.width = "40px";
            markerElement.style.height = "50px";
            markerElement.style.backgroundSize = "contain";
            return markerElement;
        },

        initializeMap() {
            const mapboxClient = MapboxClient({ accessToken: mapboxgl.accessToken });
            this.directionsClient = MapboxDirections(mapboxClient);

            this.map = new mapboxgl.Map({
                container: this.$refs.map,
                style: "mapbox://styles/therodrogo/clg72edy900cs01pp0z1rf0r9",
                center: [-71.23025064539733, -35.00274581757482],
                zoom: 13,
            });

            this.map.on("load", () => {
                //marker de origen
                this.marker1 = new mapboxgl.Marker({
                    draggable: false,
                    element: this.createMarkerElement("https://i.ibb.co/wK3cnP5/logo-red-copia.png"),
                })
                    .setLngLat([-71.244072, -34.974014])
                    .addTo(this.map);
                //marker de destino
                this.marker2 = new mapboxgl.Marker({
                    draggable: false,
                    element: this.createMarkerElement("https://i.ibb.co/wK3cnP5/logo-red-copia.png"),
                })
                    .setLngLat([-71.23025064539733, -35.00254581757482])
                    .addTo(this.map);

                this.map.addLayer({
                    id: "route",
                    type: "line",
                    source: {
                        type: "geojson",
                        data: {
                            type: "Feature",
                            properties: {},
                            geometry: {
                                type: "LineString",
                                coordinates: [],
                            },
                        },
                    },
                    layout: {
                        "line-join": "bevel",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": "#DB423F",
            "line-width": 6,
            'line-opacity': 0.7,
                    },
                });
                this.updateRoute();

            });

        }, updateRoute() {

            const origin = this.marker1.getLngLat();
            const destination = this.marker2.getLngLat();

            this.directionsClient
                .getDirections({
                    profile: "driving",
                    waypoints: [
                        { coordinates: [origin.lng, origin.lat] },
                        { coordinates: [destination.lng, destination.lat] },
                    ],
                    geometries: "geojson",
                })
                .send()
                .then(response => {
                    this.routeGeoJSON = response.body.routes[0].geometry;

                    this.coordinates = this.routeGeoJSON.coordinates
                    this.marker3 = new mapboxgl.Marker({
                        draggable: true,

                    })
                        .setLngLat(this.routeGeoJSON.coordinates[Math.trunc((this.routeGeoJSON.coordinates.length) / 2)])
                        .addTo(this.map);
                    this.centrarruta()
                    this.map.getSource("route").setData(this.routeGeoJSON);

                })
                .catch(error => {
                    console.error("Error al obtener la ruta:", error);
                });
        },
        centrarruta() {
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend({ lng: this.marker2.getLngLat().lng, lat: this.marker2.getLngLat().lat });
            bounds.extend({ lng: this.marker1.getLngLat().lng, lat: this.marker1.getLngLat().lat });
            this.map.fitBounds(bounds, { padding: 150 });


        },
        activar_menu_automatico() {
            console.log(this.activar_menu)
            if (this.activar_menu) {

                setTimeout(() => this.activeMenu = !this.activeMenu, 3000);
                setTimeout(() => this.mostrar_menu = "", 3000);

            }

        },




    },
    props: {
        estilo_btnUnirse: { type: String },
        texto_btn: { type: String },
        mostrar_BtnInfoChofer: { type: String },
        mostrar_menu: { type: String },
        boton_chat: { type: String },
        boton_panicoygrabar: { type: String },
        activar_menu: { type: Boolean },

    },
    components: {
        MenuInicioViaje,
    }
}
</script>
   
<style scoped>
.viaje {
    display: flex;

}

#map {
    position: absolute;
    top: 0;
    bottom: 0;
    margin-top: 93%;
    z-index: 1;
    width: 100%;
}

#boton-volver {
    position: fixed;
    top: 20px;
    z-index: 10001;
}

.iniciar_menu {
    display: flex;

    position: fixed;
    width: 100vw;
    justify-content: space-between;

    bottom: 55px;
    z-index: 10001;

    z-index: 10001;
}

.chatinfo {
    display: flex;
}

#info {
    position: fixed;
    top: 2%;
    right: 5%;
    margin: 10px;
    z-index: 10001;
}


#boton-chat {

    height: 50px;
}

#boton-chat img {
    height: 27px;
    color: white;
}

#boton-info {
    height: 50px;
}

#boton-iniciar {
    width: 50%;

}

/*Bounce*/
@keyframes kreep {
    0% {
        -webkit-transform: scale(1.1, .9);
        transform: scale(1.1, .9);
    }

    50% {
        -webkit-transform: scale(.9, 1.1) translateY(-.5rem)
    }

    70% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

.material-icons-outlined.downward.kreep {

    /*name-duration-function(ease,eas-in,linear)-delay-count-direction */
    animation: kreep 0.7s ease 0.1s infinite alternate;
}

.no_mostrar {
    visibility: hidden;
}

/*END BOUNCER*/
.menuinicio {
    position: fixed;
    z-index: 40;
}

.contenedor {
    position: fixed;
    bottom: 0;
    right: 0;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
    max-width: 60px;
    border-top-right-radius: 30px;
    border-top-left-radius: 30px;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 30px;
    /*  background: grey; */

}

.acordion {
    max-height: 0;
    overflow: hidden;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 30px;
    transition: max-height 0.2s ease;
}

.acordion.active {
    max-height: 400px;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 30px;
    transition: max-height 1s ease;
}

.botonmenu {
    display: flex;
}

.botonmenu span {
    margin: 0;
}
</style>