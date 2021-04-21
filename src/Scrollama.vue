<template>
  <div :id="`scrollama-container-${id}`" class="scrollama-container" :class="{'with-graphic': $slots.graphic}">
    <div :id="`scrollama-graphic-${id}`" class="scrollama-graphic" ref="scrollama-graphic">
      <slot name="graphic" />
    </div>
    <div :id="`scrollama-steps-${id}`" class="scrollama-steps">
      <slot />
    </div>
    <resize-observer @notify="handleResize"/>
  </div>
</template>

<script>
import scrollama from 'scrollama';
import { ResizeObserver } from 'vue-resize';
import 'vue-resize/dist/vue-resize.css';

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
    this._scroller = scrollama();
    this.setup();
  },
  beforeDestroy() {
    this._scroller.destroy();
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
      this._scroller.destroy();

      this._scroller
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

      this._scroller.resize();
    },
    handleResize () {
      this._scroller.resize();
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
