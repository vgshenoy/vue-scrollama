<template>
  <div>
    <div ref="container">
      <div
        v-for="n in 3"
        :key="n"
        :data-step="n"
        class="step"
      >
        Step {{ n }}
      </div>
    </div>
    <pre>{{ JSON.stringify(lastEvent, null, 2) }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollama } from 'vue-scrollama'

const container = ref(null)
const lastEvent = ref(null)

useScrollama({
  get step() { return Array.from(container.value.children) },
  offset: 0.5,
  progress: true,
  onStepEnter({ element, index, direction }) {
    lastEvent.value = { event: 'step-enter', step: element.dataset.step, index, direction }
  },
  onStepExit({ element, index, direction }) {
    lastEvent.value = { event: 'step-exit', step: element.dataset.step, index, direction }
  },
  onStepProgress({ element, index, direction, progress }) {
    lastEvent.value = { event: 'step-progress', step: element.dataset.step, index, direction, progress: progress.toFixed(2) }
  },
})
</script>

<style scoped>
.step {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  border: 2px solid #ccc;
  margin: 1rem 0;
}
</style>
