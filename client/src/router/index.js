import Vue from 'vue'
import Router from 'vue-router'
import Landing from '@/components/Landing'
import User from '../components/User'
import Users from '../components/Users'
import Password from '../components/Password'

Vue.use(Router)

export default new Router({
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
    }
  ]
})
