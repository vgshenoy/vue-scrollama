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

## Getting started

Install the component with npm. Scrollama uses [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and you'll want to manually add its polyfill `intersection-observer` for cross-browser support.

```sh
npm install vue-scrollama intersection-observer
```

Import and register a `vue-scrollama` component

```es6
import 'intersection-observer'
import Scrollama from 'vue-scrollama'

export default {
  components: {
    Scrollama
  }
}
```

## Usage

Put step elements to be triggered on scroll in slots exposed by the Scrollama component.

```html
// example with three steps
// adjust height and style of steps using classes
// when a step is triggered, `step-enter`, `step-exit`, `step-progress` events are emitted when triggered, which can be handled as desired
// data-* attributes is useful to store instructions for use in a handler like 'stepHandler' in this example
<template>
  <Scrollama @step-enter="stepHandler">
    <div class="step1" data-step="a">...</div>
    <div class="step2" data-step="b">...</div>
    <div class="step3" data-step="c">...</div>
  </Scrollama>
</template>
```

### Sticky Graphic
Add a sticky graphic element if needed into slot with name `graphic`.
```html
<template>
  <Scrollama @step-enter="stepHandler">
    <div slot="graphic" class="graphic">...</div> 
    <div class="step1" data-step="a">...</div>
    <div class="step2" data-step="b">...</div>
    <div class="step3" data-step="c">...</div>
  </Scrollama>
</template>
```

### Scrollama Options

Props passed to the `Scrollama` component will be passed on to [scrollama's setup method](https://github.com/russellgoldenberg/scrollama/blob/master/README.md#api).

* offset
* progress
* threshold
* order
* once
* debug

```html
//example with offset
<template>
  <Scrollama @step-enter="stepHandler" :offset="0.8">
      ...
  </Scrollama>
</template>
```


### Multiple instances

If you have more than one `Scrollama` components rendered at a time, pass on `id` as a prop.

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
