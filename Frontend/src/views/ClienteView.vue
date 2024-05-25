<template>
    <div>
        <div v-responsive.lg.xl>
        </div>
        <div v-if="comprobado == true" class="contenedorMovil" v-responsive.sm.xs>
            <!-- <ClienteNavbar /> -->
            <NavbarMenu />
        </div>
    </div>
</template>
  
<script>

import NavbarMenu from '@/components/NavbarMenu.vue';
import API from '@/api';

export default {
    data: () => ({
        comprobado: null
    }),
    methods: {
        /*  async verificarToken() {
             if (localStorage.getItem('carpooltoken')) {
                 var token =  JSON.parse(localStorage.getItem("carpooltoken"))
                 var user = await API.getuserbyid(token._id)
                 if(user == false){
                     this.comprobado = false
                     await this.$router.push({ path: '/Forbidden' })
                 }else{
                     this.comprobado = true
                     localStorage.setItem('carpooltoken', JSON.stringify(user));
                 }
             } else {
                 this.comprobado = false
                 await this.$router.push({ path: '/Forbidden' })
             }
         } */
    },
    components: { NavbarMenu },
    async beforeCreate() {
        if (localStorage.getItem('carpooltoken')) {
            var token = JSON.parse(localStorage.getItem("carpooltoken"))
            var user = await API.getuserbyid(token._id)
            if (user == false) {
                this.comprobado = false
                await this.$router.push({ path: '/Forbidden' })
            } else {
                this.comprobado = true
                localStorage.setItem('carpooltoken', JSON.stringify(user));
            }
        } else {
            this.comprobado = false
            await this.$router.push({ path: '/Forbidden' })
        }
        await this.$store.commit('conectarSocket');
    },
    beforeDestroy() {
        this.$store.commit('desconectarSocket');
    },
}
</script>
<style scoped>
.contenedorMovil {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 95vh;

}
</style>
  