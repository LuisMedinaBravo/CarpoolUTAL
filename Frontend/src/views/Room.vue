<template>
    <div>
        <h1>Salas</h1>
        <div v-if="!username">
            <vs-row>
                <label for="username">ID de usuario:</label>
                <input type="text" v-model="userId" />
                <button @click="conectarUsuario">Ingresar</button>
            </vs-row>
        </div>
        <div v-if="username">
            <div v-if="!roomId">


                <h2>Crear Sala</h2>
                <label for="newRoomId">ID de la sala:</label>
                <input type="text" v-model="newRoomId" />
                <button @click="crearSalaYUnirse">Crear Sala</button>



                <h2>Unirse a una Sala</h2>
                <label for="joinRoomId">ID de la sala:</label>
                <input type="text" v-model="joinRoomId" />
                <button @click="unirSala">Unirse</button>


            </div>
            <div v-if="roomId">
                <h2>Usuarios en la sala: {{ roomId }}</h2>
                <ul>
                    <li v-for="(user, index) in roomUsers" :key="index">
                        {{ user }}
                    </li>
                </ul>
                <ul>
                    <li v-for="(message, index) in messages" :key="index">
                        {{ message.username }}: {{ message.text }}
                    </li>
                </ul>
                <input type="text" v-model="currentMessage" @keyup.enter="mandarMensaje" />
                <button @click="mandarMensaje">Enviar</button>
            </div>
        </div>
    </div>
</template>
  
<script>
import { io } from 'socket.io-client';

export default {
    data() {
        return {
            socket: null,
            messages: [],
            currentMessage: '',
            userId: '',
            username: '',
            newRoomId: '',
            joinRoomId: '',
            roomId: '',
            roomUsers: [],
        };
    },
    methods: {
        conectarUsuario() {
            this.username = this.userId;
            this.state.socketRoom = io('https://socketroom-wacd334doa-uc.a.run.app');
            /* this.socket = io('http://localhost:5050'); */
            // Nos conectamos al socket
            this.socket.on('connect', () => {
                console.log('Usuario conectandose...');
                this.obtenerMensajes()
            });
        },

        crearSalaYUnirse() {
            this.roomId = this.newRoomId;
            this.socket.emit('join room', this.roomId);
        },
        unirSala() {
            this.roomId = this.joinRoomId;
            this.socket.emit('join room', this.roomId);
        },
        mandarMensaje() {
            if (this.currentMessage.trim() !== '') {
                console.log(this.currentMessage)
                const message = {
                    username: this.username,
                    text: this.currentMessage,
                };
                console.log(message)
                this.socket.emit('chat:enviar', this.roomId, message, () => {
                    console.log("entro al emit")
                    // El mensaje se envió con éxito, agregamos el mensaje a la lista
                    this.messages.push(message);
                    this.currentMessage = '';
                });
            }
        },
        obtenerMensajes() {
            // Para esuchar los nuevos mensajes
            this.socket.on('chat:recibir', (message) => {
                console.log('Mensaje recibido:', message);
                this.messages.push(message);
            });
        }
    },

};
</script>
  