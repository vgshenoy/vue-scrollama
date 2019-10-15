<template>
  <div class="hero is-dark">
    <div class="hero-body">
      <div class="container">
        <div class="title is-uppercase">
          Vue-Scrollama
        </div>
        <div class="content">
          <p>A Vue component to easily create scroll-driven interactions (aka scrollytelling)</p>
          <div class="buttons is-centered">
            <a class="button is-medium" href="https://github.com/shenoy/vue-scrollama#vue-scrollama" target="_blank">
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
        <div class="content instructions">
          <p>
            Choose an example and start scrolling!
          </p>
          <p>
            Code for this page can be found <a href="https://github.com/shenoy/vue-scrollama/tree/master/demo/src/views" target="_blank">here</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
  .hero {
    padding-bottom: 1vh;
  }
  .instructions {
    margin-top: 6vh;
    a {
      color: tomato;
      text-decoration: underline;
      &:hover {
        color: orange;
      }
    }
  }
</style>

