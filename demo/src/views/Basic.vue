<template>
  <div>
    <Scrollama :debug="true" @step-enter="stepEnterHandler" @step-exit="stepExitHandler">
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
// NOTE: In your projects, import Scrollama from 'vue-srollama'
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
    },
    stepExitHandler({element, direction, index}) {
      console.log({element, direction, index});
      this.currStepId = null;
    }
  }
}
</script>

<style scoped>
.step {
  width: 80%;
  max-width: 40rem;
  padding: 10rem 0;
  margin: 3rem auto 10rem;
  border: 1px solid #333;
  display: flex;
  justify-content: center;
}
.step.is-active {
  background-color: lightgoldenrodyellow;
}
</style>
