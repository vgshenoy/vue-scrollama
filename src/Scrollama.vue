<template>
  <div class="scrollama__steps">
    <slot />
  </div>
</template>

<script>
import scrollama from 'scrollama';

export default {
  inheritAttrs: false,
  name: 'Scrollama',
  mounted () {
    this._scroller = scrollama();
    this.setup();
  },
  beforeDestroy() {
    this._scroller.destroy();
  },
  computed: {
    opts() {
      return Object.assign({},  {
        step: Array.from(this.$el.children),
        progress: !!this.$listeners['step-progress']
      }, this.$attrs);
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
