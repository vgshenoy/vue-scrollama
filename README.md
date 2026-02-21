# Vue Scrollama

<p align="center">
    <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer">
        <img height="100" src="https://vuejs.org/images/logo.png" alt="Vue logo">
    </a>
    <a href="https://github.com/russellgoldenberg/scrollama" target="_blank" rel="noopener noreferrer">
        <img height="100" src="https://russellgoldenberg.github.io/scrollama/logo.png" alt="scrollama.js"/>
    </a>
</p>

A Vue component to easily setup scroll-driven interactions (aka scrollytelling). Uses [Scrollama](https://github.com/russellgoldenberg/scrollama) under the hood.

The best way to understand what it can do for you is to check out the examples [here](https://vue-scrollama.vercel.app) and [here](#examples).

If you're upgrading from v1 to v2 (which you should), do check out the [release notes](#release-notes).

## Installation

```sh
npm install vue-scrollama intersection-observer
```
Scrollama makes use of [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and you'll want to manually add its polyfill `intersection-observer` for cross-browser support.

## Basic Usage

Any elements placed directly inside a `Scrollama` component will be considered as steps. As the user scrolls, events will be triggered and emitted which you can handle as required:

* `step-enter`: when the top or bottom edge of a step element enters the offset threshold
* `step-exit`: when the top or bottom edge of a step element exits the offset threshold
* `step-progress`: continually fires the progress (0-1) a step has made through the threshold

Here's a simple example with three `<div>` elements as steps and a `step-enter` event

```vue
<template>
  <Scrollama @step-enter="stepEnterHandler">
    <div class="step-1" data-step="a">...</div> // classes like .step-1 may be used to adjust the style and dimensions of a step
    <div class="step-2" data-step="b">...</div> // data-* attributes can be helpful to store instructions to be used in handlers
    <div class="step-3" data-step="c">...</div>
  </Scrollama>
</template>

<script>
import 'intersection-observer' // for cross-browser support
import Scrollama from 'vue-scrollama' // local registration in this example, can also be globally registered

export default {
  components: {
    Scrollama // local registration in this example, can also be globally registered 
  },
  methods: {
    stepEnterHandler ({element, index, direction}) {
      // handle the step-event as required here
      console.log({ element, index, direction });
      // use the data attributes if needed
      console.log(element.dataset.step) // a, b or c 
    }
  }
}
</script>
```

## API Reference

### Props
Props passed to the `Scrollama` component will simply be passed on to scrollama's [setup method](https://github.com/russellgoldenberg/scrollama#scrollamasetupoptions):

```vue
// example with offset prop set to 0.8
<template>
  <Scrollama @step-enter="stepHandler" :offset="0.8">
      ...
  </Scrollama>
</template>
```

### Events
* `step-enter`
* `step-exit`
* `step-progress`


## Examples

### Codesandbox

Note: The triggering might not work precisely in the split window browser in CodeSandbox. Open in a new window for more precise triggering.

* [Basic](https://codesandbox.io/s/5kn98j4w74)
* [Progress](https://codesandbox.io/s/ryx25zrj5q)
* [Sticky Graphic 1](https://codesandbox.io/s/j3oy2k6lxv)
* [Sticky Graphic 2](https://codesandbox.io/s/jznvyjpr9w)

and [more](https://codesandbox.io/search?query=vue-scrollama%20vgshenoy&page=1&refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=vue-scrollama).

### Nuxt

Example repo [here](https://github.com/vgshenoy/vue-scrollama-demo-nuxt).

## Nuxt 4 / SSR Usage

Scrollama requires `window` and DOM access, so it must run client-side only. Both the `Scrollama` component and `useScrollama` composable are SSR-safe - they defer all DOM access to `onMounted` - but the component must be rendered inside `<ClientOnly>` to prevent hydration mismatches.

### Using the Scrollama component

Wrap your scrollama component in `<ClientOnly>` to skip server rendering:

```vue
<!-- app.vue or any page -->
<template>
  <ClientOnly>
    <ScrollamaStory />
  </ClientOnly>
</template>
```

```vue
<!-- components/ScrollamaStory.vue -->
<template>
  <Scrollama
    @step-enter="onStepEnter"
    @step-exit="onStepExit"
    @step-progress="onStepProgress"
    :offset="0.5"
  >
    <div v-for="n in 3" :key="n" :data-step="n" class="step">
      Step {{ n }}
    </div>
  </Scrollama>
</template>

<script setup>
import Scrollama from 'vue-scrollama'

function onStepEnter({ element, index, direction }) {
  console.log('enter', { step: element.dataset.step, index, direction })
}

function onStepExit({ element, index, direction }) {
  console.log('exit', { step: element.dataset.step, index, direction })
}

function onStepProgress({ element, index, direction, progress }) {
  console.log('progress', { step: element.dataset.step, index, direction, progress })
}
</script>
```

### Using the useScrollama composable

The composable also works inside `<ClientOnly>` components:

```vue
<!-- components/ScrollamaComposable.vue -->
<template>
  <div ref="container">
    <div v-for="n in 3" :key="n" :data-step="n" class="step">
      Step {{ n }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollama } from 'vue-scrollama'

const container = ref(null)

useScrollama({
  get step() { return Array.from(container.value.children) },
  offset: 0.5,
  progress: true,
  onStepEnter({ element, index, direction }) {
    console.log('enter', { step: element.dataset.step, index, direction })
  },
  onStepExit({ element, index, direction }) {
    console.log('exit', { step: element.dataset.step, index, direction })
  },
  onStepProgress({ element, index, direction, progress }) {
    console.log('progress', { step: element.dataset.step, index, direction, progress })
  },
})
</script>
```

### Why `<ClientOnly>`?

The `useScrollama` composable and `Scrollama` component both defer DOM access to `onMounted`, so they won't crash during SSR. However, the step elements rendered inside them would produce HTML on the server that scrollama then manipulates on the client, causing hydration mismatches. Wrapping in `<ClientOnly>` avoids this entirely.

A working Nuxt example is available in `examples/nuxt/`.

## Upgrade from v2 to v3

### Breaking Changes Checklist

- [ ] Vue 3.5+ is now required (was Vue 2)
- [ ] Scrollama upgraded from 2.x to 3.2 - the `order` option is no longer supported
- [ ] `intersection-observer` polyfill is no longer required (modern browsers have native support)
- [ ] Import path changed: `import Scrollama from 'vue-scrollama'` still works, but the package now ships ESM/CJS via Vite instead of UMD/ESM via Rollup
- [ ] If using Nuxt/SSR, wrap scrollama content in `<ClientOnly>` (see [Nuxt 4 / SSR Usage](#nuxt-4--ssr-usage))

### Before (v2 - Vue 2 Options API)

```vue
<template>
  <Scrollama @step-enter="onStepEnter" @step-exit="onStepExit" :offset="0.5">
    <div class="step" data-step="a">Step A</div>
    <div class="step" data-step="b">Step B</div>
  </Scrollama>
</template>

<script>
import 'intersection-observer'
import Scrollama from 'vue-scrollama'

export default {
  components: { Scrollama },
  methods: {
    onStepEnter({ element, index, direction }) {
      console.log('enter', element.dataset.step)
    },
    onStepExit({ element, index, direction }) {
      console.log('exit', element.dataset.step)
    }
  }
}
</script>
```

### After (v3 - Vue 3 Composition API)

The component API is unchanged - only the Vue 2 boilerplate changes:

```vue
<template>
  <Scrollama @step-enter="onStepEnter" @step-exit="onStepExit" :offset="0.5">
    <div class="step" data-step="a">Step A</div>
    <div class="step" data-step="b">Step B</div>
  </Scrollama>
</template>

<script setup>
import Scrollama from 'vue-scrollama'

function onStepEnter({ element, index, direction }) {
  console.log('enter', element.dataset.step)
}

function onStepExit({ element, index, direction }) {
  console.log('exit', element.dataset.step)
}
</script>
```

Or use the new `useScrollama` composable for direct control:

```vue
<template>
  <div ref="container">
    <div class="step" data-step="a">Step A</div>
    <div class="step" data-step="b">Step B</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollama } from 'vue-scrollama'

const container = ref(null)

useScrollama({
  get step() { return Array.from(container.value.children) },
  offset: 0.5,
  onStepEnter({ element, index, direction }) {
    console.log('enter', element.dataset.step)
  },
  onStepExit({ element, index, direction }) {
    console.log('exit', element.dataset.step)
  },
})
</script>
```

### SSR and Polyfills

- **IntersectionObserver**: Modern browsers (Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+) have native support. You can drop the `intersection-observer` polyfill unless you need to support older browsers.
- **SSR/Nuxt**: Scrollama requires `window` and DOM access. Wrap your scrollama content in `<ClientOnly>` to prevent hydration mismatches. See the [Nuxt 4 / SSR Usage](#nuxt-4--ssr-usage) section for full examples.

## Release Notes

### v3.0

* Requires Vue ^3.5.0 and Scrollama ~3.2.0
* Scrollama's `order` option is no longer supported - it was removed in Scrollama 3.x
* Scrollama 3.x uses a built-in resize observer, so manual resize handling is no longer needed
* The `intersection-observer` polyfill is no longer required for modern browsers

### v2.0

* Fixes buggy behaviour and improves performance on mobile devices
* Updated in accordance with the latest `scrollama` API
* *Breaking*: No more `graphic` slot, create your graphic outside the `Scrollama` component now and style it as per your needs (have a look at the examples above for guidance)
* DOM scaffolding generated by `Scrollama` has been simplified
* No need to import CSS any more, the DOM scaffolding is just one `div` and can be styled by adding classes or styles on the `Scrollama` component
