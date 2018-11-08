<template>
  <div id="app">
    <div class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="title">
            <a href="https://github.com/shenoy/vue-scrollama" target="_blank">Vue-Scrollama</a>
          </div>
          <div class="content">
            <p>A Vue component to easily create scroll-driven interactions (aka scrollytelling)</p>
            <p>
              <a href="https://github.com/shenoy/vue-scrollama#vue-scrollama">Documentation on Github →</a>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="title is-5">Examples</div>
    <div class="tabs is-toggle is-centered is-rounded">
      <ul>
        <li v-for="r in routes" :key="r.path" :class="{'is-active': r.path == $route.path}">
          <router-link :to="r.path">{{r.label}}</router-link>
        </li>
      </ul>
    </div>
    <div class="stage">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routes: [
        {path: '/basic', label: 'Basic'},
        {path: '/progress', label: 'Progress'},
        {path: '/stickygraphic1', label: 'Sticky Graphic 1'},
        {path: '/stickygraphic2', label: 'Sticky Graphic 2'}
      ]
    }
  }
}
</script>

<style lang="scss">
@import '~bulma';

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 18px;
  margin: 0;
  text-align: center;
  padding: 0;
  padding-bottom: 100vh;
}
.stage {
  margin-top: 30vh;
}
@media (max-width: 500px) {
  .tabs {
    font-size: 0.8rem;
  }
}
</style>
