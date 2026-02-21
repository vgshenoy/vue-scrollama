<template>
  <div class="scrollama__steps">
    <slot />
  </div>
</template>

<script>
import scrollama from 'scrollama';

export default {
  name: 'Scrollama',
  inheritAttrs: false,
  emits: ['step-progress', 'step-enter', 'step-exit'],
  data () {
    return {
      scroller: null
    };
  },
  computed: {
    opts() {
      const listenerProps =
        this.$ && this.$.vnode && this.$.vnode.props ? this.$.vnode.props : {};
      const hasProgressListener = Object.prototype.hasOwnProperty.call(
        listenerProps,
        'onStepProgress'
      );

      return Object.assign({},  {
        step: Array.from(this.$el.children),
        progress: hasProgressListener
      }, this.$attrs);
    }
  },
  mounted () {
    this.scroller = scrollama();
    this.setup();
  },
  beforeUnmount() {
    if (this.scroller) {
      this.scroller.destroy();
    }
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    setup() {
      if (!this.scroller) {
        return;
      }

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

      window.addEventListener('resize', this.handleResize);
    },
    handleResize () {
      if (this.scroller) {
        this.scroller.resize();
      }
    }
  }
};
</script>
