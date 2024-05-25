import * as io from 'socket.io-client'

class SocketioService {
    socket;
    constructor() {}
    
    broadcast(){
        this.socket.on('my broadcast', (data) => {
            console.log(data);
        });
    }
    sendMessage(data) {
        // Lo modifique para poder luego manejar los filtrs
        if (this.socket) {
          this.socket.emit("mensaje:enviado", data );
        }
      }
    sendViaje(data) {
        if(this.socket){
            this.socket.emit('viaje:enviado', data);
        }
    }
    sendChat(data) {
        if(this.socket){
            console.log("enviando chat")
            this.socket.emit('chat:enviado', data);
        }
    }
    sendTermino(data) {
        if(this.socket){
            this.socket.emit('termino', data);
        }
    }
    setupSocketConnection() {
        /* this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT); */
        this.socket = io("https://socketnotificacion-wacd334doa-tl.a.run.app");
        /* this.socket = io("https://carpoolsocketnotificacion-wacd334doa-tl.a.run.app"); */
       
        console.log("hola")
        this.socket.emit('my message', 'Hello there from Vue.');
    }
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
    
  }
  
  export default new SocketioService();