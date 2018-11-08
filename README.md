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

* [Live Demo](https://vue-scrollama.now.sh)

* CodeSandbox ([Basic](https://codesandbox.io/s/5kn98j4w74), [Sticky Graphic 1](https://codesandbox.io/s/j3oy2k6lxv), [Sticky Graphic 2](https://codesandbox.io/s/jznvyjpr9w))

## Installation

```sh
npm install vue-scrollama intersection-observer
```
Scrollama makes use of [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and you'll want to manually add its polyfill `intersection-observer` for cross-browser support.

## Basic Usage

Any elements placed directly inside a `Scrollama` component will be considered as steps. As the user scrolls, step events will be triggered and emitted which you can handle as required.

* [step-enter](https://github.com/russellgoldenberg/scrollama#scrollamaonstepentercallback)
* [step-exit](https://github.com/russellgoldenberg/scrollama#scrollamaonstepexitcallback)
* [step-progress](https://github.com/russellgoldenberg/scrollama#scrollamaonstepprogresscallback)
* [container-enter](https://github.com/russellgoldenberg/scrollama#scrollamaoncontainerentercallback)
* [container-exit](https://github.com/russellgoldenberg/scrollama#scrollamaoncontainerexitcallback)

Here's a simple example with three `<div>` elements as steps and a `step-enter` event

```html
// classes are helpful to adjust the style and dimensions of a step
// data-* attributes are useful to store instructions to be used in handlers
<template>
  <Scrollama @step-enter="stepEnterHandler">
    <div class="step1" data-step="a">...</div>
    <div class="step2" data-step="b">...</div>
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

<style src="vue-scrollama/dist/vue-scrollama.csss"></style>

<style>
// your styles here
</style>

```


### Sticky Graphic
To add a sticky graphic element to the mix ([example](https://vue-scrollama.now.sh/#/stickygraphic)), place it into a slot with name 'graphic'.

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

### Scrollama Options

Props passed to the `Scrollama` component will be passed on to scrollama's setup method as documented [here](https://github.com/russellgoldenberg/scrollama/blob/master/README.md#api).

* offset
* progress
* threshold
* order
* once
* debug

```html
// example with offset option
<template>
  <Scrollama @step-enter="stepHandler" :offset="0.8">
      ...
  </Scrollama>
</template>
```


