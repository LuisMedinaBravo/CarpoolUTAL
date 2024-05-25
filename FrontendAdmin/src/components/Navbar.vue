<template>
    <div>
        <div>
            <div class="navbar">
                <router-link class="logo" to="/">
                    <img height="100%" src="https://i.ibb.co/g7L6Rfj/carpool.png">
                </router-link>
                


            </div>


        </div>

    </div>
</template>

<script>

export default {
    data() {
        return {
            count: 0
        };
    },
    cambiartab() {
        this.Tabactivo = 1;
    },
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: center;
    width: 100%;
    background-color: #36568c;
    height: 8vh;
}

.logo {
    height: 100%;
    margin-left: 5%;
}

.vs-button {
    top: 20%;
    color: rgb(255, 255, 255);
    height: 50%;
}

.vs-button span{
    color: rgb(255, 255, 255);
}
.router-link{
    width: fit-content;
    background-color: black;
}

</style>


