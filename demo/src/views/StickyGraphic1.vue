<template>
  <div>
    <Scrollama :offset="$store.offset" @step-enter="stepEnterHandler">
      <div slot="graphic" class="graphic">
        <p>{{currStepId}}</p>
      </div>
      <div 
        v-for="step in steps" :key="step.no"
        :data-step-id="step.id"
        class="step" :class="{'is-active': step.id == currStepId}">
        <p>STEP {{step.id}}</p>
      </div>
    </Scrollama>
  </div>
</template>

<script>

// polyfill for IntersectionObserver
import 'intersection-observer'
// import Scrollama from '../../../src/Scrollama' 
import Scrollama from 'vue-scrollama'


export default {
  components: {
    Scrollama
  },
  data() {
    return {
      currStepId: null,
      steps: [
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4}
      ]
    }
  },
  methods: {
    stepEnterHandler({element, direction, index}) {
      console.log({element, direction, index});
      this.currStepId = element.dataset.stepId
    }
  }
}
</script>

<style src="vue-scrollama/dist/vue-scrollama.css"></style>

<style scoped>
.step {
  width: 80%;
  max-width: 40rem;
  padding: 10rem 0;
  margin: 0 auto 15rem;
  border: 1px solid #333;
  background-color: white;
  display: flex;
  justify-content: center;
}
.step.is-active {
  background-color: beige;
}
.graphic {
  height: 80vh;
  background-color: #DDD;
  border: 1px solid #333;
  display: flex;
  margin: 0 3rem;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
}
</style>
