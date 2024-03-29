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

## Release Notes

### v2.0

* Fixes buggy behaviour and improves performance on mobile devices
* Updated in accordance with the latest `scrollama` API
* *Breaking*: No more `graphic` slot, create your graphic outside the `Scrollama` component now and style it as per your needs (have a look at the examples above for guidance)
* DOM scaffolding generated by `Scrollama` has been simplified
* No need to import CSS any more, the DOM scaffolding is just one `div` and can be styled by adding classes or styles on the `Scrollama` component
