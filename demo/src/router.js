import Vue from "vue"
import Router from "vue-router"

import Basic from './views/Basic'
import Progress from './views/Progress'
import StickyGraphic from './views/StickyGraphic'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/basic'
    },
    {
      path: '/basic',
      component: Basic
    },
    {
      path: '/progress',
      component: Progress
    },
    {
      path: '/stickygraphic',
      component: StickyGraphic
    }
  ]
})