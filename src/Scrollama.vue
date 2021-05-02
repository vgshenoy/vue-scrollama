<template>
  <div :id="`scrollama__container-${id}`" class="scrollama__container">
    <div :id="`scrollama__steps-${id}`" class="scrollama__steps">
      <slot />
    </div>
  </div>
</template>

<script>
import scrollama from 'scrollama';

export default {
  name: 'Scrollama',
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
        step: `#scrollama-steps-${this.id}>div`
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

      window.addEventListener('resize', this.handleResize);
    },
    handleResize () {
      this._scroller.resize();
    }
  }
};
</script>

<style>
.scrollama__container {
  position: relative;
}

.scrollama__steps {
  position: relative;
}
</style>
