<template>
  <div id="app">
    <header>
      <h2><a href="https://github.com/shenoy/vue-scrollama" target="_blank">Vue-Scrollama</a></h2>
      <p>A Vue component to easily create scroll-driven interactions (aka scrollytelling). Uses <a href="https://github.com/russellgoldenberg/scrollama" target="_blank">Scrollama</a> under the hood.</p>
      <p>Documentation <a href="https://github.com/shenoy/vue-scrollama/" target="_blank">here</a> and source code for the examples below <a href="https://github.com/shenoy/vue-scrollama/tree/master/src/examples" target="_blank">here</a>.</p>
      <div id="nav">
        <router-link to="/basic">Basic</router-link>
        <router-link to="/progress">Progress</router-link>
        <router-link to="/stickygraphic">Sticky-Graphic</router-link>
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
  max-width: 40rem;
  margin: 0 auto;
}
#nav {
  width: 80%;
  max-width: 40rem;
  margin: 2rem auto;
  padding-bottom: 40vh;
  display: flex;
  justify-content: center;
}
#nav a {
  padding: 1rem;
  text-decoration: none;
  text-transform: uppercase;
}
#nav a.router-link-active {
  background-color: #666;
  color: #FFF;
  border-radius: 3px;
}
</style>
