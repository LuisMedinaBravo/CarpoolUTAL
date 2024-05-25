<template>
  <div v-if="validlogin == true">
    <vs-navbar shadow square center-collapsed v-model="active" class="navbarcontenedor">
      <template #left>
        <span @click="activeSidebar = !activeSidebar" class="material-icons-outlined" style="color:#36568c;">
          menu
        </span>
      </template>
      <img src="https://i.ibb.co/kM1Tm5S/otroauto.png" />
    </vs-navbar>
    <vs-sidebar absolute v-model="active" :open.sync="activeSidebar">
      <template #logo>
        <vs-avatar>
          <img src="https://bestbuyerpersona.com/wp-content/uploads/2022/02/undraw_profile_pic_ic5t.png" alt="">
        </vs-avatar>
        <div class="cajanombre">
          <p>{{ nombreUser }}</p>
        </div>
      </template>
      <vs-sidebar-item id="crear">
        <template #icon>
          <span class="material-icons-outlined">
            person_add
          </span>
        </template>
        Crear usuarios
      </vs-sidebar-item>
      <vs-sidebar-item id="crearexcel">
        <template #icon>
          <span class="material-icons-outlined">
            add
          </span>
        </template>
        Añadir usuarios excel
      </vs-sidebar-item>

      <vs-sidebar-item id="viajes">
        <template #icon>
          <span class="material-icons-outlined">
            directions_car
          </span>
        </template>
        Gestionar viajes
      </vs-sidebar-item>

      <vs-sidebar-item id="usuarios">
        <template #icon>
          <span class="material-icons-outlined">
            people
          </span>
        </template>
        Gestionar Usuarios
      </vs-sidebar-item>



      <vs-sidebar-item>
        <vs-button id="cerrarsesion" @click=cerrarSesion>
          <span class="material-icons-outlined">
            logout
          </span>
          Cerrar Sesion
        </vs-button>
      </vs-sidebar-item>
    </vs-sidebar>
    <div class="contenedorMenu">
      <div v-if="active == 'viajes'">
        <Gestionarviajes />

      </div>
      <div v-if="active == 'usuarios'">
        <Gestionarusuarios />

      </div>

      <div v-if="active == 'crearexcel'">
        <Excel />

      </div>

      <div v-if="active == 'crear'">
        <CrearUsuario />

      </div>

    </div>
  </div>
</template>
<script>

import Gestionarviajes from "./Gestionarviajes.vue"
import Gestionarusuarios from "./Gestionarusuarios.vue"
import CrearUsuario from "./CrearUsuario.vue"
import Excel from "./Excel.vue"


export default {
  data: () => ({
    activeSidebar: false,
    active: 'crear',
    nombreUser: "ADMINISTRADOR",
    validlogin: false
  }),

  mounted() {
    /* this.usuario() */
    this.$store.state.validlogin = JSON.parse(localStorage.getItem("validlogin"))

    if (this.$store.state.validlogin == true) {
      this.validlogin = true
    } else {
      this.$router.push({ path: '/' })
      console.log("login invalido")
      this.validlogin = false
    }

  },

  methods: {

    cerrarSesion() {




      this.$router.push({ path: '/' })


      localStorage.clear()
    }, gestionarusuarios() {

    }
  },
  components: {
    Gestionarviajes,
    Gestionarusuarios,
    CrearUsuario,
    Excel,
}
}
</script>

<style scoped>
.navbarcontenedor{
  display: block;
}
.contenedorMenu {
  display: flex;
  position: relative;
  justify-content: center;
  top: 44px;
  width: 100vw;
}

img {
  position: absolute;

  height: 35px;
  z-index: 5000;
}

.material-icons-outlined {
  margin-left: 0;
}

.cajanombre {
  display: flex;
  width: 50%;
}

#cerrarsesion {
  color: rgba(var(--vs-text), 1);
  width: 100%;
  background-color: white;

}
</style>