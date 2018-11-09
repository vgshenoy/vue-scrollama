import Vue from "vue"
import Router from "vue-router"

import Basic from './views/Basic'
import Progress from './views/Progress'
import StickyGraphic1 from './views/StickyGraphic1'
import StickyGraphic2 from './views/StickyGraphic2'

import { page } from 'vue-analytics'

Vue.use(Router)

const router = new Router({
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
      path: '/stickygraphic1',
      component: StickyGraphic1
    },
    {
      path: '/stickygraphic2',
      component: StickyGraphic2
    }
  ]
})

router.afterEach((to, from) => {
  // console.log(to)
  page(to)
})

export default router