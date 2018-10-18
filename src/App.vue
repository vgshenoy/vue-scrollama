<template>
  <div id="app">
    <h1>vue-scrollama</h1>
    <h3>Demo</h3>
    <div class="intro">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut qui molestiae modi vitae perferendis neque nostrum repellat, voluptatibus temporibus officiis fuga nemo alias sint pariatur numquam explicabo sit sed tempore architecto, dicta eaque laboriosam veritatis? Praesentium natus illum voluptas porro?</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut qui molestiae modi vitae perferendis neque nostrum repellat, voluptatibus temporibus officiis fuga nemo alias sint pariatur numquam explicabo sit sed tempore architecto, dicta eaque laboriosam veritatis? Praesentium natus illum voluptas porro?</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut qui molestiae modi vitae perferendis neque nostrum repellat, voluptatibus temporibus officiis fuga nemo alias sint pariatur numquam explicabo sit sed tempore architecto, dicta eaque laboriosam veritatis? Praesentium natus illum voluptas porro?</p>
    </div>
    <Scrollama @step-enter="stepHandler">
      <!-- optional graphic slot here -->
      <div slot="graphic">
        <div class="graphic">
          {{currStep || 'Current step no appears here'}}
        </div>
      </div>
      <!-- rest of the slots are considered steps -->
      <div class="step" data-step-no="1">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate praesentium asperiores ad. Libero id officia nisi fugit, non amet deserunt consectetur iusto dicta quia, reprehenderit minus maiores ad. Officia, explicabo?</p>
      </div>
      <div class="step" data-step-no="2">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate praesentium asperiores ad. Libero id officia nisi fugit, non amet deserunt consectetur iusto dicta quia, reprehenderit minus maiores ad. Officia, explicabo?</p>
      </div>
      <div class="step" data-step-no="3">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate praesentium asperiores ad. Libero id officia nisi fugit, non amet deserunt consectetur iusto dicta quia, reprehenderit minus maiores ad. Officia, explicabo?</p>
      </div>
      <div class="step" data-step-no="4">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate praesentium asperiores ad. Libero id officia nisi fugit, non amet deserunt consectetur iusto dicta quia, reprehenderit minus maiores ad. Officia, explicabo?</p>
      </div>
    </Scrollama>
    <div class="outro">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut qui molestiae modi vitae perferendis neque nostrum repellat, voluptatibus temporibus officiis fuga nemo alias sint pariatur numquam explicabo sit sed tempore architecto, dicta eaque laboriosam veritatis? Praesentium natus illum voluptas porro?</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut qui molestiae modi vitae perferendis neque nostrum repellat, voluptatibus temporibus officiis fuga nemo alias sint pariatur numquam explicabo sit sed tempore architecto, dicta eaque laboriosam veritatis? Praesentium natus illum voluptas porro?</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut qui molestiae modi vitae perferendis neque nostrum repellat, voluptatibus temporibus officiis fuga nemo alias sint pariatur numquam explicabo sit sed tempore architecto, dicta eaque laboriosam veritatis? Praesentium natus illum voluptas porro?</p>
    </div>
  </div>
</template>

<script>
import Scrollama from './components/Scrollama.vue'

export default {
  name: 'app',
  components: {
    Scrollama
  },
  data() {
    return {
      currStep: null
    }
  },
  methods: {
    stepHandler(e) {
      this.currStep = e.element.dataset.stepNo
    }
  }
}
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 20px;
  text-align: center;
}
.graphic {
  background-color: #CCC;
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF;
  font-size: 3rem;
}
.step {
  padding: 1rem;
  width: 60%;
  max-width: 50rem;
  margin: auto;
  background-color: #FFF;
  border: 1px solid #EEE;
  margin-bottom: 50vh;
}
</style>
