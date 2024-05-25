<template>
    <div>
        <p style="margin: 0; margin-left: 20px;">Fecha: {{ audioFecha }}</p>
        <audio controls :src="audioUrl" ref="audioPlayer"></audio>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
        }
    },
    props:{
        audioUrl:String,
        audioFecha:String
    },
    methods: {
        playAudio() {
            this.$refs.audioPlayer.play();
        },
        
    }
}

</script>