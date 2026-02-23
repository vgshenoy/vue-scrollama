<template>
  <div class="max-w-2xl mx-auto px-4 pb-24">
    <Scrollama
      :offset="props.offset"
      @step-enter="onStepEnter"
      @step-exit="onStepExit"
      @step-progress="onStepProgress"
    >
      <div
        v-for="n in 3"
        :key="n"
        :data-step="n"
        :class="[
          'step h-[80vh] flex flex-col items-center justify-center rounded-xl border-2 shadow-sm text-2xl font-semibold',
          activeStep === String(n) ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : 'bg-white border-slate-200 text-slate-700'
        ]"
      >
        Step {{ n }}
        <span class="mt-2 text-sm font-medium opacity-70">
          {{ getStepProgress(n) }}%
        </span>
      </div>
    </Scrollama>
    <pre class="fixed top-4 right-4 w-72 max-h-[calc(100vh-2rem)] overflow-auto rounded-lg border border-slate-200 bg-slate-900 text-slate-100 text-xs p-4 font-mono shadow-lg">{{ JSON.stringify(lastEvent, null, 2) }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Scrollama from 'vue-scrollama'

const props = defineProps({
  offset: {
    type: Number,
    default: 0.5,
  },
})

const lastEvent = ref(null)
const activeStep = ref(null)
const stepProgress = ref({})

function getStepProgress(step) {
  return stepProgress.value[String(step)] ?? 0
}

function onStepEnter({ element, index, direction }) {
  activeStep.value = element.dataset.step
  stepProgress.value[element.dataset.step] = stepProgress.value[element.dataset.step] ?? 0
  lastEvent.value = { event: 'step-enter', step: element.dataset.step, index, direction }
}

function onStepExit({ element, index, direction }) {
  if (activeStep.value === element.dataset.step) activeStep.value = null
  lastEvent.value = { event: 'step-exit', step: element.dataset.step, index, direction }
}

function onStepProgress({ element, index, direction, progress }) {
  stepProgress.value[element.dataset.step] = Math.round(progress * 100)
  lastEvent.value = { event: 'step-progress', step: element.dataset.step, index, direction, progress: progress.toFixed(2) }
}
</script>
