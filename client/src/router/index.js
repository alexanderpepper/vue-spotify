import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Playlist from '@/components/Playlist'
import Playlists from '@/components/Playlists'
import User from '../components/User'
import Users from '../components/Users'
import Callback from '../components/Callback'
import Spotify from '../components/Spotify'

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
})
