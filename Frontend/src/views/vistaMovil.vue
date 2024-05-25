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
    name: 'MapboxMap',
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
    mounted() {
        mapboxgl.accessToken =
            "pk.eyJ1IjoidGhlcm9kcm9nbyIsImEiOiJjbDIxOWFueHUweWk0M2NvNjV3M2I0ZWcwIn0.-HRLRZ2Adj0LExGfnJiajQ";
        this.initializeMap();
        this.initGeocoder();
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
            // Inicializa el cliente de Mapbox y crea una instancia del servicio de direcciones
            const mapboxClient = MapboxClient({ accessToken: mapboxgl.accessToken });
            this.directionsClient = MapboxDirections(mapboxClient);

            // Inicializa el mapa de Mapbox
            this.map = new mapboxgl.Map({
                container: this.$refs.map,
                style: "mapbox://styles/mapbox/streets-v11",
                center: [-71.235, -34.990315], // Reemplaza con el centro de tu mapa
                zoom: 13, // Reemplaza con el zoom de tu mapa
            });
            this.map.on("load", () => {
                const geolocate = new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true,
                    },
                    trackUserLocation: true,
                })

                this.map.addControl(geolocate)

                // Centrar el mapa en la ubicación actual del usuario
                geolocate.on('geolocate', e => {
                    this.map.flyTo({ center: [e.coords.longitude, e.coords.latitude] })
                })
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords

                        // Agrega los puntos al mapa (PUNTO 1)
                        this.marker1 = new mapboxgl.Marker({
                            draggable: true,
                            element: this.createMarkerElement("https://i.ibb.co/wK3cnP5/logo-red-copia.png"),
                        }).setLngLat([longitude, latitude]) // Reemplaza con la ubicación de tu punto de origen
                        .addTo(this.map);
                        this.marker2 = new mapboxgl.Marker({
                            draggable: false,
                            element: this.createMarkerElement("https://i.ibb.co/wK3cnP5/logo-red-copia.png")
                        })
                        .setLngLat([-71.22930729101564, -35.002020964785686]) // Reemplaza con la ubicación de tu punto de destino
                        .addTo(this.map);
                    this.marker1.on("dragend", this.updateRoute);
                    this.marker2.on("dragend", this.updateRoute);

                // Inicializa la capa de la ruta en el mapa
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
                            "line-join": "round",
                            "line-cap": "round",
                        },
                        paint: {
                            "line-color": "#EB568D",
                            "line-width": 4,
                        },
                    });
                this.updateRoute();
                    },
                    error => {
                        console.log(error)
                    }
                )
            });
        },
        updateRoute() {
            // INICIO Y FINAL 
            const origin = this.marker1.getLngLat();
            const destination = this.marker2.getLngLat();

            // Obtiene la ruta entre los dos puntos utilizando el servicio de direcciones de Mapbox
            this.directionsClient
                .getDirections({
                    profile: "driving",
                    waypoints: [
                        { coordinates: [origin.lng, origin.lat] }, // RUTA INICIO
                        { coordinates: [destination.lng, destination.lat] }, // RUTA FINAL
                    ],
                    geometries: "geojson",
                })
                .send()
                .then((response) => {
                    const routeGeoJSON = response.body.routes[0].geometry;
                    this.map.getSource("route").setData(routeGeoJSON);
                })
                .catch((error) => {
                    console.error("Error al obtener la ruta:", error);
                });
        },
        initGeocoder() {
            this.mapboxGeocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                marker: false,
            });

            this.map.addControl(this.mapboxGeocoder);

            // Actualizar la posición del marcador de origen cuando se selecciona un resultado
            this.mapboxGeocoder.on("result", (event) => {
                // Actualizar la posición del marcador de origen
                this.marker1.setLngLat(event.result.geometry.coordinates);

                // Actualizar la ruta
                this.updateRoute();
            });
        },
    },
};
</script>
<style>
#map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
}
</style> 