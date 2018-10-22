<template>
  <div id="app">
    <h4><a href="https://github.com/shenoy/vue-scrollama">Vue-Scrollama</a></h4>
    <h2>Examples</h2>
    <div id="nav">
      <router-link to="/basic">Basic</router-link>
      <router-link to="/progress">Progress</router-link>
      <router-link to="/stickygraphic">Sticky-Graphic</router-link>
    </div>
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
#nav {
  width: 80%;
  max-width: 40rem;
  margin: 1rem auto;
  padding-bottom: 40vh;
  display: flex;
  justify-content: center;
}
#nav a {
  padding: 1rem;
  text-decoration: none;
}
#nav a.router-link-active {
  text-decoration: underline;
}
</style>
