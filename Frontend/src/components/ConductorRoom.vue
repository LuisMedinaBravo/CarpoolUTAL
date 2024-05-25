<template>
    <div>
        conductor
        <vs-button>volver</vs-button>
    </div>
</template>

<script>
import SocketioService from "../services/socketio.service";
import * as io from "socket.io-client";

export default {
    name: 'G2ProyTaller12023ConductorRoom',

    data() {
        return {

        };
    },
    created() {

        /* this.socket = io("http://localhost:5050"); */
        this.socket = io("https://carpoolsocketnotificacion-wacd334doa-tl.a.run.app");
        //this.socket = io("35.188.227.129:5003");
        this.socket.on("connect_error", (err) => {
            console.log(err.message); // prints the message associated with the error
        })
        SocketioService.socket = this.socket;
        //SocketioService.broadcast();
        //this.obtenerParticipantes();
        /* this.obtenerUltimaPuja() */

    },
    beforeUnmount() {
        SocketioService.disconnect();
    },

    mounted() {

    },

    methods: {

    },
};
</script>

<style lang="scss" scoped></style>