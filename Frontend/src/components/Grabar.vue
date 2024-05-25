<template>
    <div>
   <!-- fonts style -->

            <vs-button id="startRecording" @click="startRecording" class="start-recording-button" v-if="showStartButton" >  <i class="fa fa-microphone"></i> </vs-button>
            <vs-button id="stopRecording" @click="stopRecording" class="stop-recording-button" v-if="showStopButton" >{{ formatTime(recordingTime) }}</vs-button> 
    </div>

</template>

<script>


export default {
   
    data: () => ({

        showStartButton: true,
        showStopButton: false,
        recording: false,
        chunks: [],
        mediaRecorder: null,
        audioRef: null,
        audioUrl: null,
        recordingTime: 0,
       
    }),


    methods: {
       
       
        startRecording() {

            this.showStopButton = true;
            this.showStartButton = false;

      
            this.chunks=[];
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            this.recording = true;
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0) {
                this.chunks.push(event.data);
                }
            });
            this.mediaRecorder.start();
            this.recordingTime = 0;
            this.recordingTimeInterval = setInterval(() => {
                this.recordingTime++;
            }, 1000);
            });
        },
        stopRecording() {

            this.showStopButton = false;
            this.showStartButton = true;
        

            if (this.mediaRecorder && this.recording) {
            this.recording = false;
            clearInterval(this.recordingTimeInterval);
            this.mediaRecorder.stop();
            this.mediaRecorder.addEventListener('stop', () => {
                const blob = new Blob(this.chunks, { type: 'audio/mp3' });
                const audioUrl = URL.createObjectURL(blob);
                this.audioUrl = audioUrl;
                this.uploadAudio();


            });
            
            }
        },


        uploadAudio() {

            if (this.audioUrl) {


            let fechaActual = new Date();
                    let dia = fechaActual.getDate();
                    let mes = fechaActual.getMonth() + 1; 
                    let anio = fechaActual.getFullYear();

                    let fechaCompleta = `${dia}:${mes}:${anio}`;


                    let horasActual = new Date();
                    let hora = horasActual.getHours();
                    let minutos = horasActual.getMinutes();
                    let segundos = horasActual.getSeconds();

                    let horaCompleta = `${hora}:${minutos}:${segundos}`;

                    let fechaHora = fechaCompleta+'-'+horaCompleta;

                   
                    let id_unico= JSON.parse(localStorage.getItem("carpooltoken"))._id;
                  

                const blob = new Blob(this.chunks, { type: 'audio/mp3' });
                const storageRef = firebase.storage().ref().child(`Audios/${id_unico}/`+fechaHora+'.mp3');
                
                storageRef.put(blob).then(() => {
                   
                    console.log('Se subió el audio a Firebase');
                
                    const storageRef = firebase.storage().ref().child(`Audios/${id_unico}/`+fechaHora+'.mp3');
                       
                    storageRef.put(blob).then(() => {
                        console.log('Se subió el audio a Firebase');
                        storageRef.getDownloadURL().then((url) => {
                            
                            const audioSrc = url;
                            alert(audioSrc);
                            
                });
                });
            });
        }
        },

        formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        },

    },
    
   
}
</script>

<style>


.start-recording-button {
  font-size: 40px;
  padding: 12px 20px; 
  background-color: red;
  border-radius: 80%;
  animation: pulse 1s infinite;
  left:300%;
}

.stop-recording-button {
  font-size: 40px; 
  padding: 12px 20px; 
  background-color: rgb(25, 16, 202);
  border-radius: 80%;
  animation: pulse 1s infinite;
  left:300%;
} 

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
} 

</style>