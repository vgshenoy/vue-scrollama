<template>
  <div id="app">
    <header>
      <h2><a href="https://github.com/shenoy/vue-scrollama" target="_blank">Vue-Scrollama</a></h2>
      <p>A Vue component to easily create scroll-driven interactions (aka scrollytelling). Uses <a href="https://github.com/russellgoldenberg/scrollama" target="_blank">Scrollama</a> under the hood.</p>
      <p>Documentation <a href="https://github.com/shenoy/vue-scrollama/" target="_blank">here</a> and source code for the examples below <a href="https://github.com/shenoy/vue-scrollama/tree/master/demo/src/views/" target="_blank">here</a>.</p>
      <div id="nav">
        <router-link to="/basic">Basic</router-link> /
        <router-link to="/progress">Progress</router-link> /
        <router-link to="/stickygraphic1">Sticky-Graphic 1</router-link> /
        <router-link to="/stickygraphic2">Sticky-Graphic 2</router-link>
      </div>
    </header>
    <router-view/>
  </div>
</template>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 18px;
  margin: 0;
  padding: 0;
  text-align: center;
}
#app {
  padding-bottom: 100vh;
}
header {
  max-width: 60rem;
  margin: 0 auto;
}
#nav {
  margin: 2rem auto;
  padding-bottom: 40vh;
}
#nav a {
  padding: 0.5rem;
  text-decoration: none;
  text-transform: uppercase;
  display: inline-block;
}
#nav a.router-link-active {
  background-color: #666;
  color: #FFF;
  border-radius: 3px;
}
</style>
