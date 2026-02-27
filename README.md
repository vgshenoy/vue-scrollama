# Vue Scrollama

<p align="center">
  <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer">
    <img height="100" src="https://vuejs.org/images/logo.png" alt="Vue logo">
  </a>
  <a href="https://github.com/russellsamora/scrollama" target="_blank" rel="noopener noreferrer">
    <img height="100" src="https://raw.githubusercontent.com/russellsamora/scrollama/main/docs/logo.png" alt="scrollama.js logo">
  </a>
</p>

Easy scroll-driven interactions (scrollytelling) for Vue 3, powered by [Scrollama](https://github.com/russellsamora/scrollama).

## Install

```sh
npm add vue-scrollama
```

## Quickstart - Composable API

Use this when you want direct setup and lifecycle control.
If you provide `onStepProgress`, the composable auto-enables `progress` for you.

```vue
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

const { isReady, rebuild, resize, destroy } = useScrollama({
  container,
  stepSelector: '.step', // optional: defaults to direct container children
  offset: 0.5,
  progress: true,
  onStepEnter({ element, index, direction }) {
    console.log('enter', { stepId: element.dataset.step, index, direction })
  },
  onStepExit({ element, index, direction }) {
    console.log('exit', { stepId: element.dataset.step, index, direction })
  },
  onStepProgress({ element, index, direction, progress }) {
    console.log('progress', { stepId: element.dataset.step, index, direction, progress })
  },
})

console.log(isReady.value) // false before mount, true after setup
// call rebuild() if step elements are added/removed dynamically
// call destroy() if you need manual early teardown
</script>
```

## Quickstart - Component API

Any direct child of `<Scrollama>` is treated as a step element.
The component API manages setup/teardown lifecycle for you.

```vue
<template>
  <Scrollama @step-enter="onStepEnter" @step-exit="onStepExit" @step-progress="onStepProgress" :offset="0.5">
    <div v-for="n in 3" :key="n" :data-step="n" class="step">
      Step {{ n }}
    </div>
  </Scrollama>
</template>

<script setup>
import Scrollama from 'vue-scrollama'

function onStepEnter({ element, index, direction }) {
  console.log('enter', { stepId: element.dataset.step, index, direction })
}

function onStepExit({ element, index, direction }) {
  console.log('exit', { stepId: element.dataset.step, index, direction })
}

function onStepProgress({ element, index, direction, progress }) {
  console.log('progress', { stepId: element.dataset.step, index, direction, progress })
}
</script>
```

## Nuxt / SSR

Scrollama requires browser DOM APIs, so render scroll stories client-side:

```vue
<template>
  <ClientOnly>
    <YourStory /> <!-- your component using useScrollama or <Scrollama> -->
  </ClientOnly>
</template>
```

`useScrollama` and `<Scrollama>` defer DOM access to `onMounted`, so they are SSR-safe to import, but story content should still be client-only to avoid hydration mismatch.

## Examples

- Demo app: `apps/demo/`
- Sticky graphic (pinned visual + scrolling steps): [`apps/demo/components/StickyGraphicDemo.vue`](./apps/demo/components/StickyGraphicDemo.vue)

## API

### `useScrollama(options)`

Required:

- `container: HTMLElement | Ref<HTMLElement | null>`

Optional:

- `stepSelector?: string` (defaults to direct container children)
- `offset?: number`
- `progress?: boolean` (auto-enabled when `onStepProgress` is provided)
- `once?: boolean`
- `threshold?: number`
- `debug?: boolean`
- `root?: string | HTMLElement`
- `onStepEnter?: (payload: { element, index, direction }) => void`
- `onStepExit?: (payload: { element, index, direction }) => void`
- `onStepProgress?: (payload: { element, index, direction, progress }) => void`

Returns:

- `isReady: Readonly<Ref<boolean>>`
- `resize(): boolean`
- `rebuild(): boolean`
- `destroy(): void`

`useScrollama` automatically calls `resize()` on window resize, orientation changes, and container size changes.

### Component props

`<Scrollama />` forwards props to `scrollama.setup(options)`:

- `offset?: number`
- `progress?: boolean`
- `once?: boolean`
- `threshold?: number`
- `debug?: boolean`
- `root?: string | HTMLElement`
- `stepSelector?: string`

Reference: [scrollama.setup(options)](https://github.com/russellsamora/scrollama#scrollamasetupoptions)

Non-scrollama attributes (`id`, `data-*`, ARIA, classes, etc.) are forwarded to the root `.scrollama__steps` element.

### Component events

- `step-enter`: `{ element, index, direction }`
- `step-exit`: `{ element, index, direction }`
- `step-progress`: `{ element, index, direction, progress }`

Note: for the component API, progress tracking auto-enables when you listen to `@step-progress`.

### Step element vs `data-step`

- A step element is the DOM element tracked by Scrollama.
- `data-step` is optional metadata you define on each step element.
- Use `data-step` (or any `data-*`) when you want stable IDs/labels in handlers.
- If you do not need custom metadata, rely on `index` from the payload.

## Compatibility

- Module format: ESM only
- Node: `>=20`
- Vue: `^3.5.0`
- Scrollama: `~3.2.0`
- Polyfill: `intersection-observer` not required for modern browsers

## Troubleshooting

### No events fire

- Ensure steps are direct children of `<Scrollama>`, or use `stepSelector` with `useScrollama`
- Ensure each step element has visible height
- Ensure container exists on mount (`ref` resolves to an element)

### `step-progress` never fires

- Component API: attach `@step-progress`
- Composable API: provide `onStepProgress` (auto-enables progress) or set `progress: true` explicitly

### Nuxt hydration mismatch

- Wrap the scroll story in `<ClientOnly>`

### Dynamic step content does not update

- Component API: rebuilds automatically when direct child step elements are added/removed
- Composable API: call `rebuild()` after adding/removing step elements

## Upgrade notes (v2 -> v3)

- Package is now ESM-only (CommonJS `require('vue-scrollama')` is not supported)
- Vue 3.5+ is required
- Scrollama upgraded to 3.x (`order` option removed upstream)
- For SSR/Nuxt, use `<ClientOnly>` around stories

## Releasing

- Release flow and pipeline details: [`RELEASING.md`](./RELEASING.md)

## License

MIT
