import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Playlists from '@/components/Playlists'
import Playlist from '@/components/Playlist'
import User from '../components/User'
import Users from '../components/Users'
import Callback from '../components/Callback'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/user/:id?',
      name: 'user',
      component: User,
      props: true
    },
    {
      path: '/users',
      name: 'users',
      component: Users
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: Playlists
    },
    {
      path: '/callback',
      name: 'callback',
      component: Callback
    },
    {
      path: '/playlist/:id',
      name: 'playlist',
      props: true,
      component: Playlist
    }
  ]
})
