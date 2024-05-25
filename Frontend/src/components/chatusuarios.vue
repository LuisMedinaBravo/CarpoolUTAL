<template>
  <div>
    <div class="dialog">
      <loading v-if="isLoading"></loading>
      <div class="sup">
        <div class="cerrar">
          <vs-button square class="botoncerrar" @click="handleClose">
            <span class="material-icons-outlined">
              arrow_back
            </span>
          </vs-button>
        </div>
      </div>

      <div class="contenedorchat" ref="contenedorchat" id="contenedorchat">
        <div v-for="(mensaje, index) in mensajes" :key="index">
          <div v-if="mensaje.enviado">
            <div class="mensaje-enviado">
              <div class="enviado">
                <!-- <textarea-autosize  v-model="mensaje.texto "/> -->
                {{ mensaje.texto }}

                <p class="hora" style="color:white;">{{ mensaje.hora }}</p>
              </div>

            </div>
          </div>
          <div v-else>
            <div class="mensaje-recibido">
              <div class="mensaje-info">


              </div>
              <div class="recibido">
                <div class="nombrerecibido" style="display: flex; flex-direction: column;">
                  <span class="nombre">{{ mensaje.nombre }}</span>
                  <!-- <textarea-autosize  v-model="mensaje.texto "/> -->
                  {{ mensaje.texto }}

                </div>
                <p class="hora" style="margin: 0;">{{ mensaje.hora }}</p>

              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="contenedorenviar">
        <div class="contenedortexto">
          <textarea-autosize placeholder="Ingrese un mensaje" v-model="mensajaparaenviar"
            style="height: auto; padding: 5%; border-radius: 12px;" />
          <vs-button success circle @click="enviarMsj()">
            <span class="material-icons-outlined">
              chevron_right
            </span>
          </vs-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from '@/api';
import loading from './loading.vue';
export default {
  data() {
    return {
      active: 0,
      chat: this.$store.state.activarchat,
      mensajes: [],
      mensajaparaenviar: "",
      isLoading: false,
    }
  },
  components: { loading },
  methods: {
    handleClose() {
      this.$store.state.opcion = 0
    },
    async obtenerMsjBD() {
      var msjeBD = await API.getviajebyid(this.$store.state.historialviajeseleccionado)
      await msjeBD.chat.forEach(element => {
        if (element.idemisor == JSON.parse(localStorage.getItem("carpooltoken"))._id) {
          element.enviado = true
        } else {
          element.enviado = false
        }
        this.mensajes.push(element)
      });
    },
    async enviarMsj() {
      if (this.mensajaparaenviar != "") {

        const now = new Date(Date.now());
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const message = {
          nombre: JSON.parse(localStorage.getItem("carpooltoken")).nombre,
          idemisor: JSON.parse(localStorage.getItem("carpooltoken"))._id,
          texto: this.mensajaparaenviar,
          enviado: true,
          hora: hours + ":" + minutes + " pm"
        };
        const data = {
          idviaje: this.$store.state.historialviajeseleccionado,
          mensaje: {
            nombre: message.nombre,
            idemisor: message.idemisor,
            texto: message.texto,
            hora: message.hora
          }
        }
        API.agregarMensajeChat(data)
        console.log(message)
        await this.$store.state.socketRoom.emit('chat:enviar', this.$store.state.historialviajeseleccionado, message, () => {
          /* this.mensajes.push(message);
          console.log('se agresiiiii') */
        });
        console.log('111')
        var container = document.getElementById('contenedorchat');
        container.scrollTop = container.scrollHeight;
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });

        this.mensajaparaenviar = '';

      }
    },
    async obtenerMensajes() {
      // Para esuchar los nuevos mensajes
      this.$store.state.socketRoom.on('chat:recibir', async (message) => {
        console.log('Mensaje recibido:', message);
        if (message.idemisor != JSON.parse(localStorage.getItem("carpooltoken"))._id) {
          message.enviado = false
        }
        console.log("se optine")
        await this.mensajes.push(message);

        console.log("se baja")
        const container = document.getElementById('contenedorchat');
        container.scrollTop = container.scrollHeight;
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      });


    }
  },
  async mounted() {
    this.isLoading = true
    await this.obtenerMsjBD()
    await this.obtenerMensajes();
    this.isLoading = false

    var container = document.getElementById('contenedorchat');
    container.scrollTop = container.scrollHeight;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  },
}

</script>

<style scoped>
.dialog {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #eeeeee;

}

.vs-input {

  width: 100vw;

}

.contenedorchat {
  position: relative;
  top: 45px;
  height: 80vh;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 2%;

}

.contenedorenviar {
  position: fixed;
  display: flex;
  bottom: 0;
  width: 100%;
  margin: 10px;
}

.contenedortexto {
  display: flex;
  margin-left: 2%;
  width: 100%;
  /* background-color: #d7d7d7; */
}

.contenedorboton {
  display: flex;
  justify-content: center;
  position: relative;
  bottom: 4%;
}

.contenedorboton .vs-button {

  width: 40px;
  height: 80%;
}

.mensaje-enviado {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.enviado {
  display: flex;
  flex-direction: column;
  color: white;
  padding: 5px;
  border-radius: 12px;
  max-width: 70vw;
  margin-bottom: 5px;
  text-align: left;
  word-wrap: break-word;
  font-size: 13px;
  padding: 3%;
  background-color: #36568c;
  height: auto;

}

.enviado .hora {

  width: 100%;
  text-align: right;
}

.enviado textarea {
  width: 70vw;
  background: transparent;
  border: none;
  color: rgb(255, 255, 255);
  resize: auto;
  outline: none;
}

.recibido textarea {
  display: flex;
  flex-direction: row;
  width: 70vw;
  background: transparent;
  border: none;
  color: rgb(0, 0, 0);
  resize: auto;
  outline: none;
}

.recibido {
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  padding: 3%;
  border-radius: 10px;
  max-width: 70vw;
  margin-bottom: 5px;
  text-align: left;
  word-wrap: break-word;
  font-size: 13px;
  padding: 3%;
}

.recibido .hora {
  position: relative;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.581);
  text-align: right;

}

.mensaje-recibido {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.nombre {
  font-weight: bold;
  margin-right: 5px;
}

.hora {
  position: relative;
  margin: 0;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.581);
}

.barrasup {
  width: 100%;
  height: 5%;
  display: flex;
  align-items: center;


}

.titulo {
  display: inline-block;
  width: 90%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.cerrar {
  width: 12%;
  display: flex;

}

.contenedortexto textarea {
  width: 70vw;
  height: 2vh;
  background: white;
  border: none;
  color: black;
  outline: none;
}

.sup {
  position: absolute;
  display: flex;
  width: 100vw;
  background: none;
  z-index: 10;
  background-color: #36568c;
}

.nombrerecibido .nombre {
  color: #36568c;
}

.botoncerrar {
  display: inline-block;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;

}

.material-icons-outlined {
  font-size: 2em;
  margin-left: 0px;
}</style>