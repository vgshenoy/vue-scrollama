# Vue Scrollama

<p align="center">
    <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer">
        <img height="100" src="https://vuejs.org/images/logo.png" alt="Vue logo">
    </a>
    <a href="https://frappe.github.io/charts" target="_blank" rel="noopener noreferrer">
        <img height="100" src="https://russellgoldenberg.github.io/scrollama/logo.png" alt="scrollama.js"/>
    </a>
</p>

STATUS: Alpha. Specifically, plan to allow use as a Vue plugin rather than a raw component.

Vue component to create scroll-driven interactions (aka storytelling) using [Scrollama](https://github.com/russellgoldenberg/scrollama)

## Getting started

First install the component from the npm registry. Scrollama uses [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and you'll want to manually add its polyfill for cross-browser support.

```sh
npm install vue-scrollama intersection-observer
```

Then import and register a `Scrollama` component either locally (as shown here) or globally using `Vue.component()`

```es6
import 'intersection-observer'
import Scrollama from 'vue-scrollama'

export default {
  components: {
    Scrollama
  }
}
```

## How to use

### Basic
Simply put the steps to be triggered on scroll in slots exposed by the `Scrollama` component:

```html
<template>
  <Scrollama @step-enter="stepHandler">
    <div class="step" data-step="a"></div>
    <div class="step" data-step="b"></div>
    <div class="step" data-step="c"></div>
  </Scrollama>
</template>
```

`step-enter`, `step-exit`, `step-progress` events are emitted when triggered, which can be handled as desired.

### Sticky Graphic
To implement the sticky graphic scrollytelling pattern, add the graphic into a slot with name `graphic`:
```html
<template>
  <Scrollama @step-enter="stepHandler">
    <div slot="graphic" class="graphic"></div> 
    <div class="step" data-step="a"></div>
    <div class="step" data-step="b"></div>
    <div class="step" data-step="c"></div>
  </Scrollama>
</template>
```

### Options (offset, debug etc)

Any props passed to the `Scrollama` component will be passed on and used in [scrollama's setup](https://github.com/russellgoldenberg/scrollama/blob/master/README.md#api)

### Multiple instances

If you have multiple `Scrollama` components to be rendered at a time, pass on `id` as a prop

```html
<template>
  <Scrollama @step-enter="firstStepHandler" id="first_scrollama">
    <div slot="graphic" class="graphic"></div> 
    <div class="step" data-step="a"></div>
    <div class="step" data-step="b"></div>
    <div class="step" data-step="c"></div>
  </Scrollama>
  <Scrollama @step-enter="secondStepHandler" id="second_scrollama">
    <div slot="graphic" class="graphic"></div> 
    <div class="step" data-step="x"></div>
    <div class="step" data-step="y"></div>
    <div class="step" data-step="z"></div>
  </Scrollama>
</template>
```