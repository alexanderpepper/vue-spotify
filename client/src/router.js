import Vue from 'vue'
import VueRouter from 'vue-router'
import Spotify from '@/views/Spotify'
import Callback from '@/views/Callback'
import Landing from '@/views/Landing'
import Playlists from '@/views/Playlists'
import Playlist from '@/views/Playlist'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'landing',
    component: Landing
  },
  {
    path: '/spotify',
    component: Spotify,
    children: [
      {
        path: '/playlists',
        name: 'playlists',
        component: Playlists,
        props: true
      },
      {
        path: '/playlist/:id',
        name: 'playlist',
        component: Playlist,
        props: true
      }
    ]
  },
  {
    path: '/callback',
    name: 'callback',
    component: Callback
  },
  {
    path: '/home',
    name: 'home',
    props: true,
    component: Spotify
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
