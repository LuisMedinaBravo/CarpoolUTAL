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

    path: '/cliente',
    name: 'cliente',
    component: () => import(/* webpackChunkName: "about" */ '../views/ClienteView.vue')
  },
  {

    path: '/chat',
    name: 'chat',
    component: () => import(/* webpackChunkName: "about" */ '../views/ChatView.vue')
  },
  {
    path:"/subida",
    name:"subida",
    component: ()=> import("../views/puntosdesubida.vue")
  },
  {
    path:"/calificar",
    name:"calificar",
    component: ()=> import("../components/CalificarChofer.vue")
  },
  {
    path:"/primerinicio",
    name:"primerinicio",
    component: ()=> import("../views/PrimerInicioView.vue")
  },
  {
    path:"/Forbidden",
    name:"Forbidden",
    component: ()=> import("../components/prohibido.vue")
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
