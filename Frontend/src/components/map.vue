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
import { mapGetters } from 'vuex';

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
    mounted() {
        mapboxgl.accessToken =
            "pk.eyJ1IjoidGhlcm9kcm9nbyIsImEiOiJjbDIxOWFueHUweWk0M2NvNjV3M2I0ZWcwIn0.-HRLRZ2Adj0LExGfnJiajQ";
        this.initializeMap();
        this.initGeocoder();
    },
    methods: {
        openNotification(titulo,duration,text,color,position) {
            // Envia una notificacion (es de vuesax)
            this.$vs.notification({
                position,
                color:color,
                duration:duration,
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
            const mapboxClient = MapboxClient({ accessToken: mapboxgl.accessToken });
            this.directionsClient = MapboxDirections(mapboxClient);

            this.map = new mapboxgl.Map({
                container: this.$refs.map,
                style: "mapbox://styles/therodrogo/clg72edy900cs01pp0z1rf0r9",
                center: [-71.235, -34.990315],
                zoom: 8,
                /* minZoom:5 */
            });

            this.map.on("load", () => {
                
                const geolocate = new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true,
                        bottom: '10px',
                        left: '10px'
                    },
                    trackUserLocation: true,
                    position: "bottom-right"
                });

               
                //Markerseleccion
                this.marker1 = new mapboxgl.Marker({
                    draggable: true,
                    element: this.createMarkerElement("https://i.ibb.co/px8KtHj/logogps.png"),
                })
                    .setLngLat([null, null])
                    
                //Marker utalca
                this.marker2 = new mapboxgl.Marker({
                    draggable: false,
                    element: this.createMarkerElement("https://i.ibb.co/z2gLGgb/logofacultadgps.png"),
                })
                    .setLngLat([-71.23025064539733, -35.00254581757482])
                    .addTo(this.map);
                    
                this.marker1.on("dragend", 
                    this.updateRoute
                   
                );
              
                this.marker2.on("dragend", 
                    this.updateRoute
                );  
            
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
            this.updatemarker1()
            var origin=null
            var destination =null
           
            if(this.$store.state.haciautalca==true){
                origin = this.marker2.getLngLat();
                destination = this.marker1.getLngLat();
            }else{
                origin = this.marker1.getLngLat();
                destination = this.marker2.getLngLat();
            }
            
            
            if(origin.lng!=0 ){
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
                    if(response.body.routes[0].geometry!=null){
                        const routeGeoJSON = response.body.routes[0].geometry;
                    // Vamos a llamar la función que anima la ruta en vez de establecer dir3ectamente los datos en la capa (OSEA QUE LO TRAZE DIRECTAMENTE)
                    
                    this.centrarruta()
                    
                    this.map.getSource("route").setData(routeGeoJSON);
                    }
                })
                .catch(error => {
                   
                });
            }
        },

    
        async initGeocoder() {
            this.mapboxGeocoder = new MapboxGeocoder({
                accessToken: mapboxgl.accessToken,
                mapboxgl: mapboxgl,
                marker: false,
            });

            this.map.addControl(this.mapboxGeocoder);
            
            this.mapboxGeocoder.on("result", event => {
                this.marker1.setLngLat(event.result.geometry.coordinates);
                
                this.updatemarker1();
                this.updateRoute();
            });
            
        },
        updatemarker1(){
            if(this.marker1.getLngLat().lng!=0){
                this.reverseGeocode(this.marker1.getLngLat());
                this.$store.state.marker1.lat=this.marker1.getLngLat().lat
                this.$store.state.marker1.lng=this.marker1.getLngLat().lng
                this.$store.state.rutavalida=false
            }
            
           
        },reverseGeocode(lngLat) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          const feature = data.features[0];
        
          if(feature!=null && feature.place_name.includes("Chile")){
            
            this.$store.state.marker1.nombre =feature.place_name
            
            this.$store.state.rutavalida=true
          }else{
            this.$store.state.rutavalida=false
            feature==null
            this.openNotification("Ruta no encontrada",2000,"","danger","top-center")
          }
          
          
          
        });
    },centrarruta() {
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend({lng:this.$store.state.marker1.lng,lat:this.$store.state.marker1.lat});
            bounds.extend({lng:this.$store.state.marker2.lng,lat:this.$store.state.marker2.lat});
            this.map.fitBounds(bounds, { padding: 150});
            this.marker1.addTo(this.map)
            
            
        },revisardistancia(){
            const turf = require('@turf/turf');
            var umbralDistancia = 4.99;
            const lineString = turf.lineString(this.$store.state.coordenadas);
            const marker = turf.point([this.$store.state.posicionseleccionada.lng,this.$store.state.posicionseleccionada.lat])
            const nearestPointOnLine = turf.nearestPointOnLine(lineString, marker);
            const distanceToLine = turf.distance(nearestPointOnLine, marker,{ units: 'meters' });
            console.log(distanceToLine)
            if(distanceToLine<=umbralDistancia){
                this.active = "viajar"
               /*  this.openNotification("Viaje seleccionado",3000,"revisa la información de tu viaje en tu apartado de viajes","success")
              */   // Enviamos la not
                NotiBus.$emit('enviarNotificacion','Solicitud unirse viaje');
            }else{
                this.openNotification("Posición incorrecta para subir",3000,"Estas a "+Math.trunc(distanceToLine)+" metros del punto de parada más cercano ","danger",
                "top-center")
            }

            /* const distanceToLine = turfdistance(nearestPointOnLine, turf.point(this.$store.state.posicionseleccionada));
            Console.log(distanceToLine ) */ 
        }
    },computed: {
    ...mapGetters(['gethaciautalca']),
    haciautalca() {
      return this.gethaciautalca;
    }
  },
  watch: {
    haciautalca(newValue, oldValue) {
        this.updateRoute();
    }
  }
};
</script>

<style>
#map {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1;
    width: 100%;
}

.mapboxgl-ctrl-top-right .mapboxgl-ctrl {
    float: right;
    margin: 10px 10px 0 22px;
}

</style>

