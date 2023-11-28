import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('./components/IndexApp.vue')
    },
    {
      path: '/english',
      name: 'english',
      // component: EnglishDB
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./components/EnglishDB.vue')
    },
    {
      path: '/fiveradio',
      name: 'fiveradio',
      component: () => import('./components/FiveRadio.vue')
    },
    {
      path: '/animalapp',
      name: 'animalapp',
      component: () => import('./components/AnimalApp.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('./components/account/AccountApp.vue')
    },
    {
      path: '/profileapp',
      name: 'profileapp',
      component: () => import('./components/ProfileApp.vue')
    },
    {
      path: '/updateprofile',
      name: 'updateprofile',
      component: () => import('./components/account/UpdateProfile.vue')
    },
  ]
})

export default router