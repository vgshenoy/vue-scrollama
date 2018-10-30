<template>
  <div>
    <Scrollama :debug="true" @step-enter="stepEnterHandler">
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
// NOTE: In your projects, import Scrollama from 'vue-srollama'
import Scrollama from '../components/Scrollama.vue' 


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

<style scoped>
.step {
  width: 30vw;
  padding: 10rem 0;
  margin: 3rem 2.5vw 10rem;
  border: 1px solid #333;
  display: flex;
  justify-content: center;
}
.step.is-active {
  background-color: lightgoldenrodyellow;
}
.graphic {
  position: absolute;
  /* transform: translateY(-50%); */
  right: 0;
  margin: 0 2.5vw;
  width: 60vw;
  top: 25vh;
  height: 50vh;
  background-color: #DDD;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
}
.graphic p {
}
</style>
