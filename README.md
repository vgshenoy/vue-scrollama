# Vue Scrollama

<p align="center">
    <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer">
        <img height="100" src="https://vuejs.org/images/logo.png" alt="Vue logo">
    </a>
    <a href="https://github.com/russellgoldenberg/scrollama" target="_blank" rel="noopener noreferrer">
        <img height="100" src="https://russellgoldenberg.github.io/scrollama/logo.png" alt="scrollama.js"/>
    </a>
</p>

A Vue component to easily setup scroll-driven interactions (aka scrollytelling) using [Scrollama](https://github.com/russellgoldenberg/scrollama).

STATUS: Alpha

## Installation

Install with npm. Scrollama uses [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) under the hood and you'll want to manually add its polyfill `intersection-observer` for cross-browser support.

```sh
npm install vue-scrollama intersection-observer
```
## Usage

Any elements placed directly inside a `Scrollama` component will be considered as steps. As the user scrolls, the following step events will be triggered and emitted:

* [step-enter](https://github.com/russellgoldenberg/scrollama#scrollamaonstepentercallback)
* [step-exit](https://github.com/russellgoldenberg/scrollama#scrollamaonstepexitcallback)
* [step-progress](https://github.com/russellgoldenberg/scrollama#scrollamaonstepprogresscallback)
* [container-enter](https://github.com/russellgoldenberg/scrollama#scrollamaoncontainerentercallback)
* [container-exit](https://github.com/russellgoldenberg/scrollama#scrollamaoncontainerexitcallback)

```html
// example with three divs as steps and a 'step-enter' event handler
// you can use classes to adjust the height and dimensions of a step
// data-* attributes are useful to store instructions
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

```



### Sticky Graphic
To add a sticky graphic element, place it into a slot with name 'graphic'.
```html
// same example but with a sticky graphic
// you can use a class to adjust the style and dimensions of the graphic
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


### Multiple instances

If you have more than one `Scrollama` components rendered at a time, you will need to pass on `id` as a prop.

```html
<template>
  <Scrollama @step-enter="stepHandler1" id="scrollama1">
      ...
  </Scrollama>
  <Scrollama @step-enter="stepHandler2" id="scrollama2">
      ...
  </Scrollama>
</template>
```