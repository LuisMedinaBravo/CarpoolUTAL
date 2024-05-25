<template>
    <div>
        <div>
            <div class="navbar">
                <router-link class="logo" to="/">
                    <img height="100%" :src="require('@/assets/carpool.png')">
                </router-link>

                <DialogLogin />



            </div>


        </div>

    </div>
</template>

<script>
import DialogLogin from './DialogLogin.vue';

export default {
    data() {
        return {
            count: 0
        };
    },
    cambiartab() {
        this.Tabactivo = 1;
    },
    components: { DialogLogin }
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
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

.vs-button span {
    color: rgb(255, 255, 255);
}

.router-link {
    width: fit-content;
    background-color: black;
}
</style>


