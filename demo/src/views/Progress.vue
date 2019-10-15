<template>
  <div>
    <Scrollama :offset="$store.offset" :progress="true" @step-progress="stepProgressHandler">
      <div
        v-for="step in steps" :key="step.no"
        :data-step-id="step.id"
        class="step"
        :style="{'background-color': `rgba(${step.rgb}, ${step.progress})`}"
      >
        <div>STEP {{step.id}}</div>
        <div>{{(step.progress * 100).toFixed(1)}}%</div>
      </div>
    </Scrollama>
  </div>
</template>

<script>

// polyfill for IntersectionObserver
import 'intersection-observer';
// import Scrollama from '../../../src/Scrollama'
import Scrollama from 'vue-scrollama';

export default {
  components: {
    Scrollama
  },
  data() {
    return {
      currStepId: null,
      steps: [
        {id: 1, rgb: '250,220,0', progress: 0},
        {id: 2, rgb: '50,250,200', progress: 0}
      ]
    };
  },
  methods: {
    stepProgressHandler({element, progress, index}) {
      console.log({element, progress, index});
      this.currStepId = element.dataset.stepId;
      this.steps.find(d => d.id === this.currStepId).progress = progress;
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
  flex-direction: column;
  justify-content: center;
}
</style>
