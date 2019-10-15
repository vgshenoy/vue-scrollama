<template>
  <div id="app">
    <Header />
    <div class="tabs is-toggle is-centered">
      <ul>
        <li v-for="r in routes" :key="r.path" :class="{'is-active': r.path === $route.path}">
          <router-link :to="r.path">{{r.label}}</router-link>
        </li>
      </ul>
    </div>
    <div class="stage">
      <transition name="fade">
        <router-view/>
      </transition>
    </div>
    <div class="debug-trigger-line" :style="{'top': triggerTop + 'px'}">
      <p>OFFSET: {{$store.offset}}</p>
    </div>
    <Footer class="footer"/>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {
      routes: [
        {path: '/basic', label: 'Basic'},
        {path: '/progress', label: 'Progress'},
        {path: '/stickygraphic1', label: 'Sticky Graphic 1'},
        {path: '/stickygraphic2', label: 'Sticky Graphic 2'}
      ]
    };
  },
  computed: {
    triggerTop() {
      return this.$store.offset * window.innerHeight;
    }
  }
}
</script>

<style lang="scss">
@import '~@fortawesome/fontawesome-free/css/all.css';
@import '~bulma';

#app {
  font-size: 18px;
  text-align: center;
}
.tabs {
  margin-top: -1.5rem;
  li {
    background-color: #FFF;
    border-radius: 4px;
  }
}
.stage {
  margin-top: 35vh;
}
.footer {
  margin-top: 50vh;
}
.debug-trigger-line {
  position: fixed;
  left: 0;
  width: 100%;
  height: 0;
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
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
