<template>
  <div :id="`scroll-container-${id}`" class="scroll-container">
    <div :id="`scroll-graphic-${id}`" class="scroll-graphic" ref="scroll-graphic">
      <slot name="graphic"></slot>
    </div>
    <div :id="`scroll-steps-${id}`" class="scroll-steps">
      <slot></slot>
    </div>
    <resize-observer @notify="handleResize"/>
  </div>
</template>

<script>
import scrollama from 'scrollama'
import { ResizeObserver } from 'vue-resize'
import Stickyfill from 'stickyfilljs' 

export default {
  components: {
    ResizeObserver
  },
  props: {
    id: {
      type: String,
      validator: function(value) {
        return !/\s/.test(value);
      },
      default: 'scrollama'
    }
  },
  mounted () {
    // polyfill for CSS position sticky
    Stickyfill.add(this.$refs['scroll-graphic'])

    this.scroller = scrollama()
    this.scroller
      .setup({
        step: `#scroll-steps-${this.id}>div`,
        container: `#scroll-container-${this.id}`,
        graphic: `#scroll-graphic-${this.id}`,
        ...this.$attrs
      })
      .onStepProgress(resp => {
        this.$emit('step-progress', resp)
      })
      .onStepEnter(resp => {
        this.$emit('step-enter', resp)
      })
      .onStepExit(resp => {
        this.$emit('step-exit', resp)
      })
      .onContainerEnter(resp => {
        this.$emit('container-enter', resp)
      })
      .onContainerExit(resp => {
        this.$emit('container-exit', resp)
      })

    this.handleResize()
  },
  methods: {
    handleResize () {
      this.scroller.resize()
    }
  }
};
</script>

<style>
.scroll-container {
  position: relative;
}
.scroll-graphic {
  position: sticky;
  top: 0;
  z-index: -1;
}
</style>
