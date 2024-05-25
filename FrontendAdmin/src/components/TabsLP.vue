<template>
    <div>
        <div class="contenedorMovil">
            <Login />
        </div>

    </div>
</template>
  
<script>
import Login from "./login.vue"
export default {
    components: {
        Login
    },
    data: () => ({
        menu: 'inicio',
        active: false,
        active2: 0
    }),
    methods: {
        toTop: function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
    },
}
</script>
<style scoped>
.contenedorMovil {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 95vh;
}

h1 {
    text-align: center;
}

span {
    color: #36568c;
}

.barra {
    position: relative;
    bottom: 0;
    width: 100%;

    /* border-top: 5px solid rgba(0, 0, 0, 0.1); */
}

.contenedorMovil {
    display: flex;
    width: 100%;
    font-family: helvetica;
    overflow: auto;

}

.centrar-div {
    display: flex;
    justify-content: center;
}

.btn-ingresar {
    margin-bottom: 20px;
    width: 30vh;


}

.block {
    width: 90%;
    text-align: justify;
}

.foot {
    background-color: #253a5f;
    font-family: helvetica;
    color: white;
}
</style>