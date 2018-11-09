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
            <div class="buttons">
              <a href="https://github.com/shenoy/vue-scrollama#vue-scrollama" class="button is-medium" target="_blank">
                <span class="icon">
                  <i class="fab fa-github"></i>
                </span>
                <span>Documentation</span>
              </a>
              <a href="https://codesandbox.io/search?query=vue-scrollama%20shenoy&page=1&refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=vue-scrollama" target="_blank">
                <img src="codesandbox.svg">
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="title is-4">Examples</div>
    <div class="tabs is-toggle is-centered">
      <ul>
        <li v-for="r in routes" :key="r.path" :class="{'is-active': r.path == $route.path}">
          <router-link :to="r.path">{{r.label}}</router-link>
        </li>
      </ul>
    </div>
    <div class="stage">
      <router-view/>
    </div>
    <div class="debug-trigger-line" :style="{'top': triggerTop + 'px'}">
      <p>OFFSET: {{$store.offset}}</p>
    </div>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>vue-scrollama</strong> by <a href="https://vigneshenoy.com">Vignesh Shenoy</a>. License <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
        </p>
      </div>
    </footer>
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
  },
  computed: {
    triggerTop() {
      return this.$store.offset * window.innerHeight
    }
  }
}
</script>

<style lang="scss">
@import '~@fortawesome/fontawesome-free/css/all.css';
@import '~bulma';

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 18px;
  margin: 0;
  text-align: center;
  padding: 0;
}
.footer {
  margin-top: 100vh;
}
.stage {
  margin-top: 35vh;
}
.debug-trigger-line {
  position: fixed;
  left: 0px;
  width: 100%;
  height: 0px;
  border-top: 2px dashed black;
  z-index: 9999;
  p {
    text-align: left;
    font-size: 12px;
    font-family: monospace;
    color: black;
    margin: 0px;
    padding: 6px;
  }
}
.buttons {
  display: flex;
  justify-content: center;
}
@media (max-width: 500px) {
  #app {
    font-size: 14px;
  }
  .tabs {
    font-size: 0.6rem;
  }
}
</style>
