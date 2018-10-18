<template>
  <div :id="`scroll-container-${id}`" class="scroll-container">
    <div :id="`scroll-graphic-${id}`" class="scroll-graphic">
      <slot name="graphic"></slot>
    </div>
    <div :id="`scroll-steps-${id}`" class="scroll-steps">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import scrollama from 'scrollama';

export default {
  props: {
    id: {
      type: String,
      validator: function(value) {
        return !/\s/.test(value);
      },
      default: 'scrollama'
    }
  },
  mounted() {
    this.scroller = scrollama();

    this.scroller
      .setup({
        step: `#scroll-steps-${this.id}>div`,
        container: `#scroll-container-${this.id}`,
        graphic: `#scroll-graphic-${this.id}`,
        ...this.$attrs
      })
      .onStepProgress(resp => {
        this.$emit('progress', resp);
      })
      .onStepEnter(resp => {
        this.$emit('step-enter', resp);
      })
      .onStepExit(resp => {
        this.$emit('step-exit', resp);
      })
      .onContainerEnter(resp => {
        this.$emit('container-enter', resp);
      })
      .onContainerExit(resp => {
        this.$emit('container-exit', resp);
      });

    this.handleResize();
  },
  methods: {
    handleResize() {
      this.scroller.resize();
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
  width: 100%;
  z-index: -1;
}
</style>
