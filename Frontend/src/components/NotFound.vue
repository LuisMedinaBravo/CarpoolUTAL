<template>
    <div class="forbidden">

        <div class="centered">

            <span style="color: aliceblue; font-size: 250px;" class="material-icons-outlined">
                report_gmailerrorred
            </span>
            <h1 class="forbidden-title">404: Pagina no encontrada</h1>
            <p class="forbidden-subtitle">La dirección que buscas no existe.</p>
            <vs-button color="success" type="border" @click="volver()">Volver</vs-button>
        </div>

    </div>
</template>
  
<script>
export default {
    name: 'Forbidden',
    methods: {
        async volver(){
            await this.$router.push({ path: '/' })
        }
    }
}
</script>
  
<style scoped>
.forbidden {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #36568c;
}

.centered {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.forbidden-title {
    color: white;
    margin-top: 20px;
}

.forbidden-subtitle {
    color: white;
    margin-bottom: 20px;
}
</style>
  