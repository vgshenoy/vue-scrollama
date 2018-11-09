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

Jump straight to examples [here](#examples).

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

```html
<template>
  <Scrollama @step-enter="stepEnterHandler">
    <div class="step1" data-step="a">...</div> // classes like .step1 are helpful to adjust the style and dimensions of a step
    <div class="step2" data-step="b">...</div> // data-* attributes are helpful to store instructions to be used in handlers
    <div class="step3" data-step="c">...</div>
  </Scrollama>
</template>

<script>
import 'intersection-observer' // for cross-browser support
import Scrollama from 'vue-scrollama'

export default {
  components: {
    Scrollama
  },
  methods: {
    stepEnterHandler ({element, index, direction}) {
      // handle the step-event as required here
      console.log(element, index, direction)
    }
  }
}

<style src="vue-scrollama/dist/vue-scrollama.css"></style>
<style>
/* your styles here */
</style>

```

### Sticky Graphic
To add a sticky graphic element ([example](https://vue-scrollama.now.sh/#/stickygraphic1)), place it into a slot with name 'graphic'.

```html
// classes are helpful to adjust the style and dimensions of the graphic
<template>
  <Scrollama @step-enter="stepEnterHandler">
    <div slot="graphic" class="graphic">...</div> 
    <div class="step1" data-step="a">...</div>
    <div class="step2" data-step="b">...</div>
    <div class="step3" data-step="c">...</div>
  </Scrollama>
</template>
```

## Scrollama Options

Props passed to the `Scrollama` component will be passed on to scrollama's [setup method](https://github.com/russellgoldenberg/scrollama#scrollamasetupoptions):

* `offset`: (number, 0 - 1): How far from the top of the viewport to trigger a step. **(default: 0.5)** 
* `progress`: (boolean): Whether to fire incremental step progress updates or not. **(default: false)**
* `debug`: (boolean): Whether to show visual debugging tools or not. **(default: false)**
* `order`: (boolean): Whether to preserve step triggering order if they fire out of sync (eg. ensure step 2 enters after 1 exits). **(default: true)**
* `once`: (boolean): Only trigger the step to enter once then remove listener. **default: false**
* `threshold`: (number, 1+): The granularity of the progress interval, in pixels (smaller = more granular updates). **(default: 4)**

```html
// example with offset set to 0.8
  <Scrollama @step-enter="stepHandler" :offset="0.8">
      ...
  </Scrollama>
</template>
```

## Styling
If you inspect the DOM elements set up by `Scrollama`, you'll see three `div` elements:

* `.scrollama-container`: overall container
* `.scrollama-steps`: container for your step elements
* `.scrollama-graphic`: container for your sticky graphic

Add to/override styles of these as per your requirements. 

For higher specificity, passing an `id` prop to `Scrollama` will accordingly postfix the ids of the above `div` elements. See this [example](https://codesandbox.io/s/jv7kx29mry) on CodeSandbox.

## Examples

On CodeSandbox:

* [Basic](https://codesandbox.io/s/5kn98j4w74)
* [Progress](https://codesandbox.io/s/ryx25zrj5q)
* [Sticky Graphic 1](https://codesandbox.io/s/j3oy2k6lxv)
* [Sticky Graphic 2](https://codesandbox.io/s/jznvyjpr9w)

and [more](https://codesandbox.io/search?query=vue-scrollama%20shenoy&page=1&refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=vue-scrollama).
