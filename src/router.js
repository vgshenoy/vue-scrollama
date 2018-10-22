import Vue from "vue";
import Router from "vue-router";

import Basic from './examples/Basic'
import Progress from './examples/Progress'
import StickyGraphic from './examples/StickyGraphic'

Vue.use(Router);

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
});