<template>
  <div :id="`scroll-container-${id}`" class="scroll-container" :class="{'with-graphic': $slots.graphic}">
    <div :id="`scroll-graphic-${id}`" class="scroll-graphic" ref="scroll-graphic">
      <slot name="graphic"></slot>
    </div>
    <div :id="`scroll-steps-${id}`" class="scroll-steps">
      <slot></slot>
    </div>
    <resize-observer class="vue-scrollama-resize-observer" @notify="handleResize"/>
  </div>
</template>

<script>
import scrollama from 'scrollama'
import { ResizeObserver } from 'vue-resize'
import Stickyfill from 'stickyfilljs' 


export default {
  name: 'Scrollama',
  components: {
    ResizeObserver
  },
  props: {
    id: {
      type: String,
      validator: function(value) {
        return !/\s/.test(value);
      },
      default: () => {
        return '_' + Math.random().toString(36).substr(2, 9)
      }
    }
  },
  mounted () {
    // polyfill for CSS position sticky
    Stickyfill.add(this.$refs['scroll-graphic'])

    this.scroller = scrollama()

    const opts = Object.assign({}, this.$attrs, {
      step: `#scroll-steps-${this.id}>div`,
      container: `#scroll-container-${this.id}`,
      graphic: `#scroll-graphic-${this.id}`,
    })

    this.scroller.setup(opts)
    
    if(this.$listeners['step-progress']) {
      this.scroller.onStepProgress(resp => {
        this.$emit('step-progress', resp)
      })
    }

    if(this.$listeners['step-enter']) {
      this.scroller.onStepEnter(resp => {
        this.$emit('step-enter', resp)
      })
    }

    if(this.$listeners['step-exit']) {
      this.scroller.onStepExit(resp => {
        this.$emit('step-exit', resp)
      })
    }

    if(this.$listeners['container-enter']) {
      this.scroller.onContainerEnter(resp => {
        this.$emit('container-enter', resp)
      })
    }

    if(this.$listeners['container-exit']) {
      this.scroller.onContainerExit(resp => {
        this.$emit('container-exit', resp)
      })
    }

    this.handleResize()
  },
  methods: {
    handleResize () {
      this.scroller.resize()
    }
  }
};
</script>

<style scoped>
.scroll-container {
  position: relative;
}
.scroll-graphic {
  position: sticky;
  top: 0;
}
.scroll-steps {
  position: relative;
}
.with-graphic .scroll-steps {
  pointer-events: none;
}
.vue-scrollama-resize-observer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  pointer-events: none;
  display: block;
  overflow: hidden;
  opacity: 0;
}
</style>
