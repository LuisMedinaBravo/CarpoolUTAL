<template>
    <div>
        <p style="margin: 0; margin-left: 20px;">{{ audioFecha }}</p>
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
        audioFecha:String
    },
    methods: {
        playAudio() {
            this.$refs.audioPlayer.play();
        },
        
    }
}

</script>