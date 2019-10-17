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
import scrollama from 'scrollama';
import { ResizeObserver } from 'vue-resize';
import 'vue-resize/dist/vue-resize.css';
import Stickyfill from 'stickyfilljs';


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
        return Math.random().toString(36).substr(2, 9);
      }
    }
  },
  mounted () {
    // polyfill for CSS position sticky
    Stickyfill.add(this.$refs['scrollama-graphic']);

    this.scroller = scrollama();

    this.setup();
  },
  beforeDestroy() {
    this.scroller.destroy();
  },
  computed: {
    opts() {
      return Object.assign({}, this.$attrs, {
        step: `#scrollama-steps-${this.id}>div`,
        container: `#scrollama-container-${this.id}`,
        graphic: `#scrollama-graphic-${this.id}`,
      });
    }
  },
  methods: {
    setup() {
      this.scroller.destroy();

      this.scroller
        .setup(this.opts)
        .onStepProgress(resp => {
          this.$emit('step-progress', resp)
        })
        .onStepEnter(resp => {
          this.$emit('step-enter', resp);
        })
        .onStepExit(resp => {
          this.$emit('step-exit', resp);
        });

      this.scroller.resize();
    },
    handleResize () {
      this.scroller.resize();
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
