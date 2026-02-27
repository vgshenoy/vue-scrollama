<template>
  <div class="mx-auto max-w-6xl px-4 pb-24">
    <div class="grid gap-8 md:grid-cols-[minmax(0,1fr)_380px] md:items-start">
      <section ref="storyContainer" class="relative z-20 order-2 md:order-1 md:z-auto">
        <article
          v-for="phase in phases"
          :key="phase.id"
          :data-step="phase.id"
          class="step mb-10 flex min-h-[78vh] items-start"
        >
          <div
            :class="[
              'w-full rounded-xl border-2 bg-white p-6 shadow-sm transition-colors',
              activeStep === phase.id ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white'
            ]"
          >
            <p class="text-xs font-bold uppercase tracking-wider text-amber-700">Phase {{ phase.id }}</p>
            <h3 class="mt-2 text-2xl font-bold text-slate-900">{{ phase.title }}</h3>
            <p class="mt-3 leading-relaxed text-slate-600">{{ phase.description }}</p>
            <p class="mt-4 text-sm font-medium text-slate-500">
              scrub progress: {{ stepProgress[phase.id] ?? 0 }}%
            </p>
          </div>
        </article>
      </section>

      <aside class="order-1 sticky top-3 z-0 md:order-2 md:top-[12vh] md:z-10">
        <div class="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-slate-100 shadow-lg">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Sticky Graphic</p>
          <div class="mt-4 rounded-xl bg-slate-800 p-4">
            <p class="text-sm font-semibold text-white">{{ activePhase.title }}</p>
            <p class="mt-1 text-xs text-slate-300">{{ activePhase.kicker }}</p>
            <div class="mt-4 flex items-center gap-4">
              <svg class="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#334155" stroke-width="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#f59e0b"
                  stroke-width="3"
                  stroke-linecap="round"
                  :stroke-dasharray="`${score}, 100`"
                />
              </svg>
              <div>
                <p class="text-xs uppercase tracking-wide text-slate-400">Composite score</p>
                <p class="text-3xl font-bold text-amber-300">{{ score }}</p>
              </div>
            </div>
            <div class="mt-4 space-y-3">
              <div v-for="metric in metrics" :key="metric.key">
                <div class="mb-1 flex justify-between text-xs text-slate-300">
                  <span>{{ metric.label }}</span>
                  <span>{{ metric.value }}%</span>
                </div>
                <div class="h-2 rounded bg-slate-700">
                  <div
                    class="h-full rounded bg-gradient-to-r from-amber-400 to-orange-500 transition-[width]"
                    :style="{ width: `${metric.value}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
          <p class="mt-4 text-sm text-slate-300">
            `step-progress` drives smooth interpolation between states.
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

const phases = [
  {
    id: '1',
    title: 'Baseline',
    kicker: 'Raw workflow with manual handoffs',
    description: 'Start from a stable baseline so users can feel each transition as they scroll.',
    from: { speed: 20, retention: 30, automation: 10 },
    to: { speed: 40, retention: 42, automation: 22 },
  },
  {
    id: '2',
    title: 'Optimization',
    kicker: 'Process cleanup and sequencing',
    description: 'As progress increases, throughput and retention improve together.',
    from: { speed: 40, retention: 42, automation: 22 },
    to: { speed: 64, retention: 58, automation: 45 },
  },
  {
    id: '3',
    title: 'Automation',
    kicker: 'Rules replace repetitive operations',
    description: 'Automation climbs sharply while quality stays controlled.',
    from: { speed: 64, retention: 58, automation: 45 },
    to: { speed: 78, retention: 72, automation: 71 },
  },
  {
    id: '4',
    title: 'Scale',
    kicker: 'Reliable system with guardrails',
    description: 'Final phase balances speed, retention, and automation for sustained output.',
    from: { speed: 78, retention: 72, automation: 71 },
    to: { speed: 92, retention: 86, automation: 88 },
  },
]

const storyContainer = ref(null)
const activeStep = ref(phases[0].id)
const stepProgress = reactive({})
const phaseById = Object.fromEntries(phases.map((phase) => [phase.id, phase]))

const activePhase = computed(() => phaseById[activeStep.value] ?? phases[0])

function interpolate(fromValue, toValue, progressPercent) {
  const progressRatio = progressPercent / 100
  return Math.round(fromValue + (toValue - fromValue) * progressRatio)
}

const metrics = computed(() => {
  const progressPercent = stepProgress[activeStep.value] ?? 0
  const phase = activePhase.value

  return [
    {
      key: 'speed',
      label: 'Speed',
      value: interpolate(phase.from.speed, phase.to.speed, progressPercent),
    },
    {
      key: 'retention',
      label: 'Retention',
      value: interpolate(phase.from.retention, phase.to.retention, progressPercent),
    },
    {
      key: 'automation',
      label: 'Automation',
      value: interpolate(phase.from.automation, phase.to.automation, progressPercent),
    },
  ]
})

const score = computed(() => {
  const total = metrics.value.reduce((sum, metric) => sum + metric.value, 0)
  return Math.round(total / metrics.value.length)
})

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
    stepProgress[element.dataset.step] = Math.round(progress * 100)
  },
})
</script>
