<template>
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <div class="pointer-events-none fixed inset-x-0 z-20" :style="{ top: `${offset * 100}vh` }">
      <div class="border-t-2 border-dotted border-rose-400/90" />
      <div class="absolute -top-6 left-4 rounded bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-700">
        offset {{ Math.round(offset * 100) }}%
      </div>
    </div>
    <header class="py-16 px-4 text-center">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900">
        vue-scrollama
      </h1>
      <p class="mt-3 text-lg text-slate-600 max-w-xl mx-auto">
        Scroll down to explore component primitives and real-world scrollytelling patterns.
      </p>
      <div class="mt-4 flex justify-center">
        <a
          href="https://github.com/vgshenoy/vue-scrollama"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Open original vue-scrollama repository on GitHub"
        >
          <Github class="h-4 w-4" :stroke-width="2" />
          <span>GitHub</span>
        </a>
      </div>
      <div class="mt-8 inline-flex flex-wrap justify-center gap-2 rounded-lg border border-slate-300 bg-white p-1 shadow-sm">
        <button
          class="px-4 py-2 text-sm font-semibold rounded-md border transition-all"
          :class="activeDemo === 'component' ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-transparent text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'"
          @click="activeDemo = 'component'"
        >
          Component API
        </button>
        <button
          class="px-4 py-2 text-sm font-semibold rounded-md border transition-all"
          :class="activeDemo === 'composable' ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-transparent text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'"
          @click="activeDemo = 'composable'"
        >
          Composable API
        </button>
        <button
          class="px-4 py-2 text-sm font-semibold rounded-md border transition-all"
          :class="activeDemo === 'sticky' ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-transparent text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900'"
          @click="activeDemo = 'sticky'"
        >
          Sticky Graphic
        </button>
      </div>
    </header>
    <div class="h-[40vh]" />
    <ClientOnly>
      <ScrollamaDemo v-if="activeDemo === 'component'" :offset="offset" />
      <ScrollamaComposableDemo v-else-if="activeDemo === 'composable'" :offset="offset" />
      <StickyGraphicDemo v-else :offset="offset" />
    </ClientOnly>
    <div class="h-screen" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Github } from 'lucide-vue-next'

const activeDemo = ref('sticky')
const offset = 0.5
</script>

<style>
body {
  font-family: 'JetBrains Mono', monospace;
}
</style>
