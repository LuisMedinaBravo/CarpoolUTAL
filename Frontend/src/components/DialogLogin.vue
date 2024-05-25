<template>
    <div class="center">
        <vs-button color="#3C5E99" style="width: 150px; height: 50px;margin-top: 5px;" circle @click="active = !active">
            <div style="display: flex; justify-content: center;">

                <p style="margin: 0;margin-top: 3px;">Iniciar Sesión</p>
                <span style="margin-left: 10px;" class="material-icons-outlined">
                    login
                </span>
            </div>


        </vs-button>
        <vs-dialog not-close not-padding blur v-model="active">
            <Login />
        </vs-dialog>
    </div>
</template>
<script>
import Login from "./login.vue"
export default {
    data: () => ({
        active: false,
    }),
    components: {
        Login
    }
}
</script>

<style scoped></style>
