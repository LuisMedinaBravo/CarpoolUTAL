<template>
    <div>
        <div id="map" ref="map"></div>
    </div>
</template>
<script>
import mapboxgl from "!mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxClient from "@mapbox/mapbox-sdk";
import MapboxDirections from "@mapbox/mapbox-sdk/services/directions";

export default {
    name: "MapboxMap",
    data() {
        return {
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
            minZoom: 0,
            /* origen: this.$store.state.origenseleccionado,
            destino: this.$store.state.destinoseleccionado */
        };
    },
    props: {
        origen: Object,
        destino: Object,
        solicitud: Array
    },
    mounted() {
        mapboxgl.accessToken =
            "pk.eyJ1IjoidGhlcm9kcm9nbyIsImEiOiJjbDIxOWFueHUweWk0M2NvNjV3M2I0ZWcwIn0.-HRLRZ2Adj0LExGfnJiajQ";
        this.initializeMap();
        this.centrarruta()

    },
    methods: {

        openNotification(titulo, duration, text, color, position) {
            // Envia una notificacion (es de vuesax)
            this.$vs.notification({
                position,
                color: color,
                duration: duration,
                title: titulo,
                text: text
            })
        },
        createMarkerElement(iconUrl) {
            const markerElement = document.createElement("div");
            markerElement.style.backgroundImage = `url(${iconUrl})`;
            markerElement.style.width = "50px";
            markerElement.style.height = "50px";
            markerElement.style.backgroundRepeat = 'no-repeat';
            markerElement.style.backgroundSize = "contain";
            return markerElement;
        },

        initializeMap() {

            //this.openNotification("Mueve el marker azul para marcar tu punto de subida", 3000, "", "primary", "bottom")
            const mapboxClient = MapboxClient({ accessToken: mapboxgl.accessToken });
            this.directionsClient = MapboxDirections(mapboxClient);

            this.map = new mapboxgl.Map({
                container: this.$refs.map,
                style: "mapbox://styles/therodrogo/clg72edy900cs01pp0z1rf0r9",
                center: [this.destino.lng, this.destino.lat],
                zoom: 13,
                interactive: false


            });

            this.map.on("load", () => {




                if (this.destino.lat == -35.00254581757482) {
                    this.marker2 = new mapboxgl.Marker({
                        draggable: false,
                        element: this.createMarkerElement("https://i.ibb.co/z2gLGgb/logofacultadgps.png"),
                    })
                        .setLngLat([this.destino.lng, this.destino.lat])
                        .addTo(this.map);

                    this.marker1 = new mapboxgl.Marker({
                        draggable: false,
                        element: this.createMarkerElement("https://i.ibb.co/px8KtHj/logogps.png"),
                    })
                        .setLngLat([this.origen.lng, this.origen.lat])
                        .addTo(this.map);
                    if (this.solicitud != null) {
                        this.marker3 = new mapboxgl.Marker({
                            draggable: false,
                            element: this.createMarkerElement("https://i.ibb.co/C504QXV/subidasi.png"),
                        })
                    }

                } else {
                    this.marker2 = new mapboxgl.Marker({
                        draggable: false,
                        element: this.createMarkerElement("https://i.ibb.co/px8KtHj/logogps.png"),
                    })
                        .setLngLat([this.destino.lng, this.destino.lat])
                        .addTo(this.map);
                    this.marker1 = new mapboxgl.Marker({
                        draggable: false,
                        element: this.createMarkerElement("https://i.ibb.co/z2gLGgb/logofacultadgps.png"),
                    })
                        .setLngLat([this.origen.lng, this.origen.lat])
                        .addTo(this.map);
                    if (this.solicitud != null) {
                        this.marker3 = new mapboxgl.Marker({
                            draggable: false,
                            element: this.createMarkerElement("https://i.ibb.co/Zxn9JYy/bajada.png"),
                        })
                    }
                }
                if (this.solicitud != null) {
                    this.marker3.setLngLat(this.solicitud)

                    this.marker3.addTo(this.map);
                    
                }

                





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

        },

        updateRoute() {

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




                    this.map.getSource("route").setData(this.routeGeoJSON);

                })
                .catch(error => {
                    console.error("Error al obtener la ruta:", error);
                });
        }, updatecoordenadas() {

            this.$store.state.coordenadas = this.routeGeoJSON.coordinates
            console.log(this.$store.state.posicionseleccionada.lng + " " + this.$store.state.posicionseleccionada.lat)
            this.$store.state.posicionseleccionada.lng = this.marker3.getLngLat().lng
            this.$store.state.posicionseleccionada.lat = this.marker3.getLngLat().lat


        }
        , centrarruta() {
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend({ lng: this.destino.lng, lat: this.destino.lat });
            bounds.extend({ lng: this.origen.lng, lat: this.origen.lat });
            this.map.fitBounds(bounds, { padding: 100 });
            /*  this.map.setMinZoom(this.map.getZoom()); */

        }

    },
};
</script>

<style scoped>
#map {
    position: relative;
    min-width: calc(100vw - 50px);
    min-height: calc(100vh - 50px);
    border-radius: 15px;
    /* Ajusta la altura según tus necesidades */
}

.mapboxgl-ctrl-top-right .mapboxgl-ctrl {
    float: right;
    margin: 10px 10px 0 22px;
}
</style>