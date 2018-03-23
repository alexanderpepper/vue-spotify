import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import Home from '@/components/Home'
import Playlist from '@/components/Playlist'
import User from '../components/User'
import Users from '../components/Users'
import Password from '../components/Password'
import AuthCallback from '../components/AuthCallback'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Landing',
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
      path: '/password',
      name: 'password',
      component: Password
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/callback',
      name: 'callback',
      component: AuthCallback
    },
    {
      path: '/playlist/:id',
      name: 'playlist',
      props: true,
      component: Playlist
    }
  ]
})
