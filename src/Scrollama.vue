<template>
  <div :id="`scrollama-container-${id}`" class="scrollama-container" :class="{'with-graphic': $slots.graphic}">
    <div :id="`scrollama-graphic-${id}`" class="scrollama-graphic" ref="scrollama-graphic">
      <slot name="graphic"></slot>
    </div>
    <div :id="`scrollama-steps-${id}`" class="scrollama-steps">
      <slot></slot>
    </div>
    <resize-observer @notify="handleResize"/>
  </div>
</template>

<script>
import scrollama from 'scrollama'
import { ResizeObserver } from 'vue-resize'
import 'vue-resize/dist/vue-resize.css'
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
        return Math.random().toString(36).substr(2, 9)
      }
    }
  },
  mounted () {
    // polyfill for CSS position sticky
    Stickyfill.add(this.$refs['scrollama-graphic'])

    this.scroller = scrollama()

    const opts = Object.assign({}, this.$attrs, {
      step: `#scrollama-steps-${this.id}>div`,
      container: `#scrollama-container-${this.id}`,
      graphic: `#scrollama-graphic-${this.id}`,
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

<style>
.scrollama-container {
  position: relative;
}

.scrollama-graphic {
  position: sticky;
  top: 0;
}

.scrollama-steps {
  position: relative;
}
</style>
