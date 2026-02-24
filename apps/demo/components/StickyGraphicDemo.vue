<template>
  <div class="mx-auto max-w-5xl px-4 pb-24">
    <div class="grid gap-8 md:grid-cols-[minmax(0,1fr)_360px] md:items-start">
      <section ref="storyContainer" class="order-2 md:order-1">
        <article
          v-for="scene in scenes"
          :key="scene.id"
          :data-step="scene.id"
          class="step mb-10 flex min-h-[75vh] items-start top-[12vh]"
        >
          <div
            :class="[
              'rounded-xl border-2 p-6 shadow-sm transition-colors',
              activeStep === scene.id ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white'
            ]"
          >
            <p class="text-xs font-bold uppercase tracking-wider text-indigo-700">Step {{ scene.id }}</p>
            <h3 class="mt-2 text-2xl font-bold text-slate-900">{{ scene.title }}</h3>
            <p class="mt-3 leading-relaxed text-slate-600">{{ scene.description }}</p>
            <p class="mt-4 text-sm font-medium text-slate-500">
              progress: {{ stepProgress[scene.id] ?? 0 }}%
            </p>
          </div>
        </article>
      </section>

      <aside class="order-1 sticky top-3 z-10 md:order-2 md:top-[12vh]">
        <div class="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-slate-100 shadow-lg">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Sticky Graphic</p>
          <div class="mt-4 h-56 rounded-xl p-4 transition-all" :class="activeScene.colorClass">
            <p class="text-sm font-semibold text-white/80">{{ activeScene.kicker }}</p>
            <h4 class="mt-2 text-2xl font-bold text-white">{{ activeScene.title }}</h4>
            <p class="mt-3 text-sm leading-relaxed text-white/90">{{ activeScene.graphicText }}</p>
          </div>
          <p class="mt-4 text-sm text-slate-300">
            This panel stays sticky while text steps scroll.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useScrollama } from 'vue-scrollama'

const props = defineProps({
  offset: {
    type: Number,
    default: 0.5,
  },
})

const scenes = [
  {
    id: '1',
    kicker: 'Act 1',
    title: 'Discover',
    description: 'Introduce the context and pull readers in with a simple visual that does not move yet.',
    graphicText: 'A calm opening state gives people an anchor before transitions begin.',
    colorClass: 'bg-gradient-to-br from-sky-500 to-blue-700',
  },
  {
    id: '2',
    kicker: 'Act 2',
    title: 'Contrast',
    description: 'Shift tone and show differences in data or narrative while keeping the same sticky frame.',
    graphicText: 'Color and copy switch with the active step to communicate change quickly.',
    colorClass: 'bg-gradient-to-br from-fuchsia-500 to-purple-700',
  },
  {
    id: '3',
    kicker: 'Act 3',
    title: 'Resolve',
    description: 'End with a final message and visual payoff while preserving continuity of the layout.',
    graphicText: 'The story lands clearly because the graphic remains stable as text advances.',
    colorClass: 'bg-gradient-to-br from-emerald-500 to-teal-700',
  },
]

const storyContainer = ref(null)
const activeStep = ref(scenes[0].id)
const stepProgress = reactive({})
const sceneById = Object.fromEntries(scenes.map((scene) => [scene.id, scene]))

const activeScene = computed(() => sceneById[activeStep.value] ?? scenes[0])

useScrollama({
  container: storyContainer,
  stepSelector: '.step',
  offset: props.offset,
  progress: true,
  onStepEnter({ element }) {
    const stepId = element.dataset.step
    activeStep.value = stepId
    stepProgress[stepId] = stepProgress[stepId] ?? 0
  },
  onStepProgress({ element, progress }) {
    const stepId = element.dataset.step
    stepProgress[stepId] = Math.round(progress * 100)
  },
})
</script>
