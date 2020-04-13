import Vue from 'vue'
import VueRouter from 'vue-router'

import Decks from '@/views/decks.vue'
import Login from '@/views/login.vue'
import ViewDecks from '@/views/viewDecks.vue'
import Signup from '@/views/signup.vue'
import UploadFile from '@/views/uploadFile.vue'
import User from '@/views/user.vue'
import Home from '@/views/home.vue'
import Flashcards from '@/views/flashcards.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/viewDecks',
    name: 'viewDecks',
    component: ViewDecks
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },

  {
    path: '/uploadFile',
    name: 'uploadFile',
    component: UploadFile
  },
  {
    path: '/user',
    name: 'user',
    component: User
  },
  {
    path: '/decks',
    name: 'decks',
    component: Decks
  },
  {
    path: '/decks/:deckId/',
    name: 'flashcards',
    component: Flashcards
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
