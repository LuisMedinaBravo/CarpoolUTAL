import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/gestionarviajes',
    name: 'gestionarviajes',
    component: () => import(/* webpackChunkName: "about" */ '../components/Gestionarviajes.vue')
  },
  {
    path: '/gestionarusuarios',
    name: 'gestionarusuarios',
    component: () => import(/* webpackChunkName: "about" */ '../components/Gestionarusuarios.vue')
  }, 
  {
    path: '/menuadmincarpooling',
    name: 'menuadmincarpooling',
    component: () => import(/* webpackChunkName: "about" */ '../components/NavbarMenu.vue')

  },
  {
    path: '/crearusuario',
    name: 'crearusuario',
    component: () => import(/* webpackChunkName: "about" */ '../components/CrearUsuario.vue')
  },
  {
    path:"*",
    name:"NotFound",
    component: ()=> import("../components/NotFound.vue")
  }
]

const router = new VueRouter({
  routes
})

export default router
